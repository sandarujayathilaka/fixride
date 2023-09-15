// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvTXFUyCa5XCQ7vBfsh8mmAUdpwpR2RSg",
  authDomain: "fixride-50426.firebaseapp.com",
  projectId: "fixride-50426",
  storageBucket: "fixride-50426.appspot.com",
  messagingSenderId: "171830815870",
  appId: "1:171830815870:web:03334c2a9d5c9250243c2f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore();
