import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDev2rqu-cdfY6EJYLEvhGYlOxmFpXQIAs",
  authDomain: "forms-33dba.firebaseapp.com",
  projectId: "forms-33dba",
  storageBucket: "forms-33dba.firebasestorage.app",
  messagingSenderId: "526818739317",
  appId: "1:526818739317:web:3448774e401818e0e0243c",
  measurementId: "G-22TMSZEEKH",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);
