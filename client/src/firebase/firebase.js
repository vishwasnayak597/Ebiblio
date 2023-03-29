import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBxDEo5SBAycqLr6BcajsM1VlfaRc4Jr5Y",
    authDomain: "ebiblio-10ef0.firebaseapp.com",
    projectId: "ebiblio-10ef0",
    storageBucket: "ebiblio-10ef0.appspot.com",
    messagingSenderId: "1049552740455",
    appId: "1:1049552740455:web:6041ce67a4f945a0ef34c2",
    measurementId: "G-Q3B3RJR9DB" 
  };

  firebase.initializeApp(firebaseConfig);

  export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();