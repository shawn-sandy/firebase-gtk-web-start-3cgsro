// Import stylesheets
import './style.css';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from 'firebase/app';

// Add the Firebase products that you want to use
import 'firebase/auth';
import 'firebase/firestore';

import * as firebaseui from 'firebaseui';

// Document elements
const startRsvpButton = document.getElementById('startRsvp');
const guestbookContainer = document.getElementById('guestbook-container');

const form = document.getElementById('leave-message');
const input = document.getElementById('message');
const guestbook = document.getElementById('guestbook');
const numberAttending = document.getElementById('number-attending');
const rsvpYes = document.getElementById('rsvp-yes');
const rsvpNo = document.getElementById('rsvp-no');

var rsvpListener = null;
var guestbookListener = null;

async function main() {
  // Add Firebase project configuration object here
  const firebaseConfig = {
    apiKey: 'AIzaSyDOBlBghPCz1N5WjEnRRzxCS_e3pbtV8S0',
    authDomain: 'fir-web-codelab-6062d.firebaseapp.com',
    projectId: 'fir-web-codelab-6062d',
    storageBucket: 'fir-web-codelab-6062d.appspot.com',
    messagingSenderId: '158831984570',
    appId: '1:158831984570:web:991e784e3179f455e6e783'
  };

  firebase.initializeApp(firebaseConfig);

  // FirebaseUI config
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      // Email / Password Provider.
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // Handle sign-in.
        // Return false to avoid redirect.
        return false;
      }
    }
  };

  // const ui = new firebaseui.auth.AuthUI(firebase.auth());
  const ui = new firebaseui.auth.AuthUI(firebase.auth());

  // Listen to RSVP button clicks
  startRsvpButton.addEventListener('click', () => {
    if (firebase.auth().currentUser) {
      // User is signed in; allows user to sign out
      firebase.auth().signOut();
    } else {
      // No user is signed in; allows user to sign in
      ui.start('#firebaseui-auth-container', uiConfig);
    }
  });

  // ...
  // Listen to the current Auth state
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      startRsvpButton.textContent = 'LOGOUT';
    } else {
      startRsvpButton.textContent = 'RSVP';
    }
  });

  // Listen to the form submission
  form.addEventListener('submit', e => {
    // Prevent the default form redirect
    e.preventDefault();
    // Write a new message to the database collection "guestbook"
    firebase
      .firestore()
      .collection('guestbook')
      .add({
        text: input.value,
        timestamp: Date.now(),
        name: firebase.auth().currentUser.displayName,
        userId: firebase.auth().currentUser.uid
      });
    // clear message input field
    input.value = '';
    // Return false to avoid redirect
    return false;
  });
}
main();
