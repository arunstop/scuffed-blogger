// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { collection, getFirestore } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAJqdT2SSp1DSuR_9577iwxvT-lk4EZ0E",
  authDomain: "tuturku-3e16b.firebaseapp.com",
  databaseURL:
    "https://tuturku-3e16b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tuturku-3e16b",
  storageBucket: "tuturku-3e16b.appspot.com",
  messagingSenderId: "401343226371",
  appId: "1:401343226371:web:c684d2f415a63c8ac16436",
  measurementId: "G-6N1RGXCFRP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// firestore client
const firestore = getFirestore(app);

// auth
const auth = getAuth(app);

// Databases
export const article = collection(firestore, "articles");

export const firebaseClient = {
  auth,
  db: { article },
};
export const firebaseAuth = auth;
