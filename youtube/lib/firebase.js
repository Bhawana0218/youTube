// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, getGoogleAnalyticsClientId } from "firebase/analytics";

import {getAuth, GoogleAuthProvider }from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvRuThXnC-f29TqvQ06Zsl9qwSFoHW_1M",
  authDomain: "fir-c12b6.firebaseapp.com",
  projectId: "fir-c12b6",
  storageBucket: "fir-c12b6.firebasestorage.app",
  messagingSenderId: "121941967798",
  appId: "1:121941967798:web:a4286879f5b2018205b717",
  measurementId: "G-374KJKJR9R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analytics;

if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth, provider};