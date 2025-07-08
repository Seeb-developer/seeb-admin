import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDEaP0WI39iJNeLeCGKXhW6ctJ5iGLvT7o",
  authDomain: "seeb-partner.firebaseapp.com",
  projectId: "seeb-partner",
  storageBucket: "seeb-partner.firebasestorage.app",
  messagingSenderId: "835008801894",
  appId: "1:835008801894:web:9bdb1f1492901aa32391a7",
  measurementId: "G-Y811F2XMSS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);
// Add the public key generated from the console here.
export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "eAHKfgMz4JTOnKE0DT6rIofnuqVpCh3XQw11SyZrbLs",
    });
    if (currentToken) {
      console.log("current token for client: ", currentToken);
    } else {
      // Show permission request UI
      console.log("No registration token available. Request permission to generate one.");
    }
  } catch (err) {
    console.log("An error occurred while retrieving token. ", err);
  }
};
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("payload", payload);
      resolve(payload);
    });
  });
