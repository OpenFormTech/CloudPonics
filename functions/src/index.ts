import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { DeviceManagerClient } from '@google-cloud/iot';
import { HttpsFunction } from 'firebase-functions';

const deviceManagerClient : DeviceManagerClient = new DeviceManagerClient();

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
                console.error('No destination run "'+data.run+'/'+data.project+'" exists.', message);
                return;
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
            console.error('Incorrect device ID "'+device+'" for run "'+data.run+'", expected "'+device+'"', message);
        }
    } else {
        console.error('No destination project "'+message.json.project+'" exists.', message);
    }
});

/**
 * Generates user database entry on user creation
 */
exports.newUser = functions.auth.user().onCreate((user, context)=>{
    const name = user.displayName || user.email;
    console.log('New user '+name+' (UID: '+user.uid+') has authenticated at time '+context.timestamp);
    return [admin.firestore().doc('users/'+user.uid).set(admin.firestore().doc('users/default')),admin.firestore().doc('/users/'+user.uid).update({
        timestamp:Date.parse(context.timestamp)
    })];
});

/**
* Registers a new device with the user
*/
exports.createDevice = functions.https.onCall(async (data, context)=>{
    return new Promise(async (resolve, reject)=>{
        if(context.auth !== undefined){
            //User is eligible? - throw 'resource-exhausted'
            //Device ID is valid
            try {
                var response = await deviceManagerClient.createDevice(data.request);
            } catch (e){
                reject(new functions.https.HttpsError('invalid-argument', String(e)))
            }
            try{
                await admin.database().ref('/users/'+context.auth.uid+'/devices/'+data.request.device.id).set(true);

                await admin.database().ref('/devices/'+data.request.device.id).set({
                    info : {
                        'name' : data.name,
                        'state' : 0
                    },
                    metadata : {
                        'creation-timestamp' : Date.now(),
                        'owner' : context.auth.uid
                    }
                });
                console.log('User '+context.auth.uid+' created device: ', response[0]);
                resolve(response[0]);
            } catch (err) {
                reject(new functions.https.HttpsError('failed-precondition', String(e)));
            }
        } else {
            reject(new functions.https.HttpsError('unauthenticated', "User not authenticated"));
        }
    });
});

/**
* Populates program metadata (owner, creation timestamp), user program ownership, and parent project's program shortlist on program creation.
*/
exports.programCreation = functions.database.ref('/projects/{projectid}/programs/{programid}/').onCreate((snapshot, context)=>{
    const projectid = String(context.params.projectid);
    const programid = String(context.params.programid);
    const uid = context.auth.uid;
    const timestamp = context.timestamp;
    console.log('Program '+programid+' has been created in project '+projectid+' by user '+uid+' at time '+timestamp);
    //Metadata
    const p1 = snapshot.ref.child('metadata').set({
        'owner' : uid,
        'creation-timestamp' : Date.parse(timestamp)
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
    const uid = context.auth.uid;
    const timestamp = context.timestamp;
    console.log('Run '+runid+' has been created in project '+projectid+' by user '+uid+' at time '+timestamp);
    //Metadata
    const p1 = snapshot.ref.child('metadata').set({
        'owner' : uid,
        'creation-timestamp' : Date.parse(timestamp)
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
    const uid = context.auth.uid;
    const timestamp = context.timestamp;
    console.log('Project '+projectid+' has been created by user '+uid+' at time '+timestamp);
    //Metadata
    const p1 = snapshot.ref.child('metadata').set({
        'owner' : uid,
        'creation-timestamp' : Date.parse(timestamp)
    });
    //User reflection
    const p2 = admin.database().ref('/users/'+uid+'/projects/'+projectid).set(true);
    //Shortlist reflection
    const p3 = admin.database().ref('/projectlist/'+projectid).set(true);
    //Update cloud functions cache
    const p4 = updateProjectListCache();
    return Promise.all([p1,p2,p3,p4]);
});