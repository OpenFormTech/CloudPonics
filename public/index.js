// The Firebase SDK is initialized and acessible via firebase.{SERVICE}. For example:
// firebase.auth().onAuthStateChanged(user => { });
// firebase.database().ref('/path/to/ref').on('value', snapshot => { });
// firebase.messaging().requestPermission().then(() => { });
// firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
// firebase.analytics(); // call to activate
// firebase.analytics().logEvent('tutorial_completed');
// firebase.performance(); // call to activate

//You can use any of these: https://firebase.google.com/docs/web/setup#namespace
//Follow this for quickstart - https://firebase.google.com/docs/web/setup  


//When DOM content is loaded, remove the "loading" text and replace it with a list of loaded SDK services.
document.addEventListener('DOMContentLoaded', function() {
    const loadEl = document.querySelector('#load');
    
    try {
        let app = firebase.app();
        let features = [
            'auth', 
            'database', 
            // 'messaging', 
            // 'storage', 
            // 'analytics', 
            // 'remoteConfig',
            // 'performance',
        ].filter(feature => typeof app[feature] === 'function');
        loadEl.textContent = `Firebase SDK loaded with ${features.join(', ')}`;
    } catch (e) {
        console.error(e);
        loadEl.textContent = 'Error loading the Firebase SDK, check the console.';
    }
});