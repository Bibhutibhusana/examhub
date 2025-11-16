// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYljOjjC3ApdMQfP8Hg99wfLgPPwqsyj4",
  authDomain: "legendbibhu-ef9d7.firebaseapp.com",
  projectId: "legendbibhu-ef9d7",
  storageBucket: "legendbibhu-ef9d7.firebasestorage.app",
  messagingSenderId: "768013324731",
  appId: "1:768013324731:web:3cfd22885b29d40383f49e",
  measurementId: "G-L9KM879XPH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
