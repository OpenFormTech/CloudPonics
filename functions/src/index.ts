import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as iot from '@google-cloud/iot';
import {v4 as uuid} from 'uuid';
import * as fs from 'fs';
import { exec } from 'child_process';

const deviceManagerClient : iot.v1.DeviceManagerClient = new iot.v1.DeviceManagerClient();
const shell = (command : string) : Promise<string> => {
    return new Promise<string>((resolve, reject)=>{
        exec(command, (error, stdout, stderr)=>{
            if(error){
                reject(error);
            }else if(stderr.length > 0){
                reject(stderr);
            } else {
                resolve(stdout);
            }
        });
    });
};

admin.initializeApp();

interface IData {
    label : string
    value : number
    timestamp : number
    project : string
    run : string
};

interface IRunDocCache {
    device: string,
    timestamp: admin.firestore.Timestamp
}
// Caches only the permanent stuff
interface IRunCache {
    [projectid: string] : {
        [runid: string] : IRunDocCache
    }
};

let runcache : IRunCache;

type Keypair = {
    public: string,
    private: string
}

async function copyDoc(collectionFrom: string, docFrom: string, collectionTo: string, docTo: string, data: any = {}, recursive = false): Promise<any> {
    // document reference
    const docRef = admin.firestore().collection(collectionFrom).doc(docFrom);
    let docData;
    try {
        // copy the document
        docData = await docRef
        .get()
        .then((doc) => doc.exists && doc.data());
    } catch (err) {
        throw new Error('Error reading document "'+`${collectionFrom}/${docFrom}`+'": '+JSON.stringify(err));
    }
    if (docData) {
        // document exists, create the new item
        await admin.firestore().collection(collectionTo).doc(docTo).set({
            ...docData, 
            ...data 
        }).catch((error) => {
            throw new Error('Error creating document: "'+`${collectionTo}/${docTo}`+'": '+JSON.stringify(error));
        });
    
        // if copying of the subcollections is needed
        if (recursive) {
            // subcollections
            const subcollections = await docRef.listCollections();
            for await (const subcollectionRef of subcollections) {
                const subcollectionPath = `${collectionFrom}/${docFrom}/${subcollectionRef.id}`;
                // get all the documents in the collection
                return await subcollectionRef.get()
                .then(async (snapshot) => {
                    const docs = snapshot.docs;
                    for await (const doc of docs) {
                        await copyDoc(subcollectionPath, doc.id, `${collectionTo}/${docTo}/${subcollectionRef.id}`, doc.id, true);
                    }
                }).catch((error) => {
                    throw new Error('Error reading subcollection: "'+`${subcollectionPath}`+'": '+JSON.stringify(error));
                });
            }
        }
    }
};
  

/**
* Populates database data fields from IoT telemetry.
*/
exports.environmentData = functions.pubsub.topic('data').onPublish(async (message, context)=>{
    const data = message.json as IData;
    const device : string = message.attributes['deviceId'];
    //Destination project & run exists?
    if((await admin.firestore().doc('/projects/'+data.project).get()).exists) {
        // Check for cache
        if(!runcache[data.project][data.run]){
            // Create cache if exists, otherwise fail
            const runref = await admin.firestore().doc('/projects/'+data.project+'/runs/'+data.run).get();
            if(runref.exists){
                runcache[data.project][data.run] = {
                    device: runref.get("device"),
                    timestamp: runref.get("timestamp")
                };
            } else {
                return new Error('No destination run "'+data.run+'/'+data.project+'" exists.');
            }
        }
        if(runcache[data.project][data.run].device === null){
            console.info('Binding device "'+device+'" to run "'+data.run+'/'+data.project+'".');
            runcache[data.project][data.run].device = device;
            await admin.firestore().doc('/projects/'+data.project+'/runs/'+data.run).update({device: device});
        } else if(runcache[data.project][data.run].device !== device){
            return new Error('Incorrect device ID "'+device+'" for run "'+data.run+'", expected "'+device+'"');
        }
        console.info('Recieved device data successfully from "'+device+'": '+data.label+' - '+data.value);
        return admin.firestore().collection('/projects/'+data.project+'/runs/'+data.run+'/'+data.label).add({
            timestamp : data.timestamp,
            value : data.value
        });
    } else {
        return new Error('No destination project "'+message.json.project+'" exists.');
    }
});

/**
 * Generates user database entry on user creation
 */
exports.newUser = functions.auth.user().onCreate((user, context)=>{
    const name = user.displayName || user.email;
    console.info('New user "'+name+'" (UID: "'+user.uid+'") has authenticated at time '+context.timestamp);
    return copyDoc('users', 'default', 'users', user.uid, {
        timestamp : admin.firestore.FieldValue.serverTimestamp()
    }, true);
});

async function generateRSAKeypair() : Promise<Keypair>{
    await shell('openssl genpkey -algorithm RSA -out rsa_private.pem -pkeyopt rsa_keygen_bits:2048');
    await shell('openssl rsa -in rsa_private.pem -pubout -out rsa_public.pem');
    const publickey = fs.readFileSync('./rsa_public.pem').toString();
    const privatekey = fs.readFileSync('./rsa_private.pem').toString();
    fs.unlinkSync('./rsa_public.pem');
    fs.unlinkSync('./rsa_private.pem');
    return {
        public: publickey,
        private: privatekey
    };
}

/**
* Registers a new device with the user
*/
exports.createDevice = functions.https.onCall(async (data : {devicename: string, region: string, registry: string}, context)=>{
    if(context.auth !== undefined){
        return admin.firestore().doc('users/'+context.auth.uid).get().then(async userdoc=>{
            // Check user device registry limit
            if((userdoc.get('devices') as Array<any>).length >= userdoc.get('devicelimit')){
                return new functions.https.HttpsError('resource-exhausted', "Failed to register device: Account device registration limit exceeded. Your limit is "+userdoc.get('devicelimit')+" device(s).");
            }
            let response;
            const keypair = await generateRSAKeypair();
            const request : iot.protos.google.cloud.iot.v1.ICreateDeviceRequest = {
                parent: deviceManagerClient.registryPath(process.env.GCLOUD_PROJECT as string, data.region, data.registry),
                device : {
                    id: 'peapod-'+uuid(),
                    credentials: [
                        {
                            publicKey: {
                                format: 'RSA_PEM',
                                key: keypair.public,
                            }
                        }
                    ]
                }
            };
            try {
                response = await deviceManagerClient.createDevice(request);
            } catch (err){
                return new functions.https.HttpsError('invalid-argument', "Failed to register device: "+String(err));
            }
            try{
                console.info('User '+context.auth?.uid+' created device: ', response[0]);
                // Create device
                await admin.firestore().doc('/devices/'+request.device?.id).set({
                    'name' : data.devicename,
                    'state' : 0,
                    'timestamp' : admin.firestore.FieldValue.serverTimestamp(),
                    'owner' : context.auth?.uid
                });
                // Add to user
                await admin.firestore().doc('/users/'+context.auth?.uid).update({
                    devices: admin.firestore.FieldValue.arrayUnion(request.device?.id)
                });
                return {device: response[0], privatekey: keypair.private};
            } catch (err) {
                return new functions.https.HttpsError('failed-precondition', "Failed to register device: "+String(err));
            }
        }).catch(err=>{
            return err;
        });
    } else {
        return new functions.https.HttpsError('unauthenticated', "Failed to register device: "+"User not authenticated!");
    }
});

/**
* Populates project metadata (owner, creation timestamp) and user project ownership on project creation.
*/
exports.projectCreation = functions.firestore.document('/projects/{projectid}').onCreate((snapshot, context)=>{
    if(snapshot.get("uid")){
        const projectid = context.params.projectid;
        const uid = snapshot.get("uid");
        const timestamp = context.timestamp;
        console.info('Project "'+projectid+'" has been created by user "'+uid+'" at time '+timestamp);
        //Metadata
        const p1 = snapshot.ref.update({
            'timestamp' : admin.firestore.FieldValue.serverTimestamp(),
            'owner' : uid,
            'uid' : admin.firestore.FieldValue.delete()
        });
        //User ownership
        const p2 = admin.firestore().doc('/users/'+uid).update({
            projects: admin.firestore.FieldValue.arrayUnion(projectid)
        });
        return Promise.all([p1,p2]);
    }
    return;
});

/**
* Populates run metadata (owner, creation timestamp) and user run ownership on run creation.
*/
exports.runCreation = functions.firestore.document('/projects/{projectid}/runs/{runid}').onCreate((snapshot, context)=>{
    if(snapshot.data().uid){
        const projectid = String(context.params.projectid);
        const runid = String(context.params.runid);
        const uid = snapshot.data().uid as string;
        const timestamp = context.timestamp;
        console.info('Run "'+projectid+'/'+runid+'" has been created by user "'+uid+'" at time '+timestamp);
        //Metadata
        const p1 = snapshot.ref.update({
            'owner' : uid,
            'timestamp' : admin.firestore.FieldValue.serverTimestamp(),
            'complete' : false,
            'uid' : admin.firestore.FieldValue.delete()
        });
        //User ownership
        const p2 = admin.firestore().doc('/users/'+uid).update({
            runs: admin.firestore.FieldValue.arrayUnion({
                project: projectid,
                run: runid
            })
        });
        return Promise.all([p1,p2]);
    }
    return;
});

/**
* Populates program metadata (owner, creation timestamp) and user program ownership on program creation.
*/
// exports.programCreation = functions.database.ref('/projects/{projectid}/programs/{programid}/').onCreate((snapshot, context)=>{
//     // TODO: Check for field completeness? Interface?
//     const projectid = String(context.params.projectid);
//     const programid = String(context.params.programid);
//     const uid = context.auth?.uid;
//     const timestamp = context.timestamp;
//     const userdoc = admin.firestore().doc('/users/'+uid);
//     console.info('Program "'+programid+'" for project "'+projectid+'" has been created by user "'+uid+'" at time '+timestamp);
//     //Metadata
//     const p1 = snapshot.ref.child('metadata').set({
//         'owner' : userdoc,
//         'timestamp' : admin.firestore.FieldValue.serverTimestamp()
//     });
//     //User reflection
//     const p2 = userdoc.update({
//         programs: admin.firestore.FieldValue.arrayUnion(snapshot.ref)
//     });
//     return Promise.all([p1,p2]);
// });