// Main module

// initialization

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyC7iBFv4PEmWss4h_Ul01Mpkzgpu2GuXao",
    authDomain: "peapod-283416.firebaseapp.com",
    databaseURL: "https://peapod-283416.firebaseio.com",
    projectId: "peapod-283416",
    storageBucket: "peapod-283416.appspot.com",
    messagingSenderId: "513099710307",
    appId: "1:513099710307:web:9280ad994c219256f79d56",
    measurementId: "G-39TFQEV2HD"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// const vars for various functions
const auth = firebase.auth();
const functions = firebase.functions();
const database = firebase.database();

// sections which display sign in/out data
const signedOut = document.getElementById("signedOut");
const signedIn = document.getElementById("signedIn");

// sign in/out buttons
const signInBtn_Google = document.getElementById("google");
const signOutBtn = document.getElementById("signOutButton");

// user div
const userInfo = document.getElementById("userDetails");

// auth providers
const providerGoogle = new firebase.auth.GoogleAuthProvider();

// sign in/out listeners
signInBtn_Google.onclick = () => auth.signInWithPopup(providerGoogle);

signOutBtn.onclick = () => auth.signOut();


// auth state changes
auth.onAuthStateChanged(user => {
    if (user) {
        // user is signed in
        signedOut.hidden = true;
        signedIn.hidden = false;
        
        // populating the div with informatio
        userInfo.innerHTML = `<p>${user.displayName}<br/>${user.email}</p>`;
    } else {
        // user is signed out
        signedOut.hidden = false;
        signedIn.hidden = true;

        // removing the inputted information when the user is signed out
        userInfo.innerHTML = '';
    }
});