import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as iot from '@google-cloud/iot';

const deviceManagerClient : iot.v1.DeviceManagerClient = new iot.v1.DeviceManagerClient();

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
    timestamp: FirebaseFirestore.Timestamp
}
// Caches only the permanent stuff
interface IRunCache {
    [projectid: string] : {
        [runid: string] : IRunDocCache
    }
};

var runcache : IRunCache;

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
                return new Error('No destination run "'+data.run+'/'+data.project+'" exists.'), message;
            }
        }
        if(runcache[data.project][data.run].device === null){
            console.log('Binding device "'+device+'" to run "'+data.run+'/'+data.project+'".');
            runcache[data.project][data.run].device = device;
            await admin.firestore().doc('/projects/'+data.project+'/runs/'+data.run+'/').update({device: device});
        } else if(runcache[data.project][data.run].device === device){
            console.info('Recieved device data successfully from "'+device+'": '+data.label+' - '+data.value);
            return admin.firestore().collection('/projects/'+data.project+'/runs/'+data.run+'/'+data.label).add({
                timestamp : data.timestamp,
                value : data.value
            });
        } else {
            return new Error('Incorrect device ID "'+device+'" for run "'+data.run+'", expected "'+device+'"'), message;
        }
    } else {
        return new Error('No destination project "'+message.json.project+'" exists.'), message;
    }
});

/**
 * Generates user database entry on user creation
 */
exports.newUser = functions.auth.user().onCreate((user, context)=>{
    const name = user.displayName || user.email;
    console.log('New user '+name+' (UID: '+user.uid+') has authenticated at time '+context.timestamp);
    return [admin.firestore().doc('users/'+user.uid).set(admin.firestore().doc('users/default')),admin.firestore().doc('/users/'+user.uid).update({
        timestamp : FirebaseFirestore.FieldValue.serverTimestamp()
    })];
});

/**
* Registers a new device with the user
*/
exports.createDevice = functions.https.onCall(async (data : {name: string, request: iot.protos.google.cloud.iot.v1.CreateDeviceRequest}, context)=>{
    if(context.auth !== undefined){
        admin.firestore().doc('users/'+context.auth.uid).get().then(async userdoc=>{
            // Check user device registry limit
            if((userdoc.get('devices') as Array<any>).length >= userdoc.get('devicelimit')){
                return new functions.https.HttpsError('resource-exhausted', "Failed to register device: Account device registration limit exceeded. Your limit is "+userdoc.get('devicelimit')+" device(s).");
            }
            try {

                var response = await deviceManagerClient.createDevice(data.request);
            } catch (err){
                return new functions.https.HttpsError('invalid-argument', "Failed to register device: "+String(err));
            }
            try{
                console.log('User '+context.auth?.uid+' created device: ', response[0]);
                // Create device
                let deviceref = admin.firestore().doc('/devices/'+data.request.device?.id);
                await deviceref.set({
                    'name' : data.name,
                    'state' : 0,
                    'timestamp' : FirebaseFirestore.FieldValue.serverTimestamp(),
                    'owner' : admin.firestore().doc('/users/'+context.auth?.uid)
                });
                // Add to user
                await admin.firestore().doc('/users/'+context.auth?.uid).update({
                    devices: FirebaseFirestore.FieldValue.arrayUnion(deviceref)
                });
                return response[0];
            } catch (err) {
                return new functions.https.HttpsError('failed-precondition', "Failed to register device: "+String(err));
            }
        });
    } else {
        return new functions.https.HttpsError('unauthenticated', "Failed to register device: "+"User not authenticated!");
    }
});

/**
* Populates program metadata (owner, creation timestamp), user program ownership, and parent project's program shortlist on program creation.
*/
exports.programCreation = functions.database.ref('/projects/{projectid}/programs/{programid}/').onCreate((snapshot, context)=>{
    const projectid = String(context.params.projectid);
    const programid = String(context.params.programid);
    const uid = context.auth?.uid;
    const timestamp = context.timestamp;
    console.log('Program '+programid+' has been created in project '+projectid+' by user '+uid+' at time '+timestamp);
    //Metadata
    const p1 = snapshot.ref.child('metadata').set({
        'owner' : uid,
        'timestamp' : FirebaseFirestore.FieldValue.serverTimestamp()
    });
    //User reflection
    const p2 = admin.database().ref('/users/'+uid+'/programs/'+programid).set(projectid);
    //Shortlist reflection
    const p3 = admin.database().ref('/projects/'+projectid+'/programlist/'+programid).set(true);
    return Promise.all([p1,p2,p3]);
});

/**
* Populates run metadata (owner, creation timestamp), user run ownership, and parent project's run shortlist on run creation.
*/
exports.runCreation = functions.database.ref('/projects/{projectid}/runs/{runid}/').onCreate((snapshot, context)=>{
    const projectid = String(context.params.projectid);
    const runid = String(context.params.runid);
    const uid = context.auth?.uid;
    const timestamp = context.timestamp;
    console.log('Run '+runid+' has been created in project '+projectid+' by user '+uid+' at time '+timestamp);
    //Metadata
    const p1 = snapshot.ref.child('metadata').set({
        'owner' : uid,
        'timestamp' : FirebaseFirestore.FieldValue.serverTimestamp()
    });
    //User reflection
    const p2 = admin.database().ref('/users/'+uid+'/runs/'+runid).set(projectid);
    //Shortlist reflection
    const p3 = admin.database().ref('/projects/'+projectid+'/runlist/'+runid).set(true);
    return Promise.all([p1,p2,p3]);
});

/**
* Populates project metadata (owner, creation timestamp), user project ownership, and project shortlist on project creation.
*/
exports.projectCreation = functions.database.ref('/projects/{projectid}/').onCreate((snapshot, context)=>{
    const projectid = String(context.params.projectid);
    const uid = context.auth?.uid;
    const timestamp = context.timestamp;
    console.log('Project '+projectid+' has been created by user '+uid+' at time '+timestamp);
    //Metadata
    const p1 = snapshot.ref.child('metadata').set({
        'owner' : uid,
        'timestamp' : FirebaseFirestore.FieldValue.serverTimestamp()
    });
    //User reflection
    const p2 = admin.database().ref('/users/'+uid+'/projects/'+projectid).set(true);
    //Shortlist reflection
    const p3 = admin.database().ref('/projectlist/'+projectid).set(true);
    //Update cloud functions cache
    // const p4 = updateProjectListCache();
    return Promise.all([p1,p2,p3]);
});