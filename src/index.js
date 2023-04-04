// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHBh5GCt0nV9IJpAUZtwDXa2WkL8yDfUg",
  authDomain: "fall-of-the-bgc.firebaseapp.com",
  projectId: "fall-of-the-bgc",
  storageBucket: "fall-of-the-bgc.appspot.com",
  messagingSenderId: "11710345981",
  appId: "1:11710345981:web:7b7bcff6fbc9fb4b944494",
  measurementId: "G-WJ6CWF3033"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
