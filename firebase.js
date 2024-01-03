import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyC-XghyP-lfiLIoBgh6o8FqIHQMZQNDHfI",
  authDomain: "hotel-odevi.firebaseapp.com",
  projectId: "hotel-odevi",
  storageBucket: "hotel-odevi.appspot.com",
  messagingSenderId: "962186619984",
  appId: "1:962186619984:web:164d2be3049fd8f1abb555",
  measurementId: "G-K2NW5CDTK5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  // Pass the app instance to getAuth
const db = getFirestore(app);  // Pass the app instance to getFirestore
const database = getDatabase(app);

export {
  auth,
  db,
  database
};
