import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getMessaging } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyANtl6NgF4_nhUWBxn9exIBcXrfBHNePVE",
  authDomain: "educore-erp.firebaseapp.com",
  projectId: "educore-erp",
  storageBucket: "educore-erp.firebasestorage.app",
  messagingSenderId: "671546845544",
  appId: "1:671546845544:web:55739b3f4181613aed0edd",
  measurementId: "G-CMQ5NMLXNM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);
