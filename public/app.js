// Main module

// Initializing Firebase from another file
import { firebaseConfig } from "/src/js/init-firebase.js";
firebase.initializeApp(firebaseConfig)

// Initializing FirebaseUI from another file
import { uiConfig } from "/src/js/firebaseui.js";
// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

// const vars for various functions
// const auth = firebase.auth();
// const functions = firebase.functions();
// const database = firebase.database();

/**
 * centralize init-firebase.js and firebaseui.js to one file
 */