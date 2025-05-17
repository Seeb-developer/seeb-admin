import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
// TODO: Replace the following with your app's Firebase project configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDQWhiMJaE9d06keQ4ybm3NX1zlcvSoAY8",
//   authDomain: "dorfee-admin.firebaseapp.com",
//   projectId: "dorfee-admin",
//   storageBucket: "dorfee-admin.appspot.com",
//   messagingSenderId: "55118931471",
//   appId: "1:55118931471:web:a3fe11cbdc22307b27257a",
//   measurementId: "G-S7V9QY12KL",
// };

const firebaseConfig = {
  apiKey: "AIzaSyCsL9U_oh9LlD3GxyRIaI--MrSsDj0smi0",
  authDomain: "seeb-e3cea.firebaseapp.com",
  databaseURL: "https://seeb-e3cea-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "seeb-e3cea",
  storageBucket: "seeb-e3cea.firebasestorage.app",
  messagingSenderId: "700320378270",
  appId: "1:700320378270:web:e4d5a0fce9687ea0ce7a8f",
  measurementId: "G-B1X3YNCE4L"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);
// Add the public key generated from the console here.
export const requestForToken = () => {
  return getToken(messaging, {
    vapidKey:
      "BLfvjp_ONVGofOddLbdxHm9LiJhGunkbjXw-AL-m1Yv6-qbJhsxa6faSSfC8ZfL9yYlPACvPWAiNVUJHfa_NueM",
  })
    .then((currentToken) => {
      if (currentToken) {
        console.log("current token for client: ", currentToken);
        // Perform any other neccessary action with the token
      } else {
        // Show permission request UI
        console.log("No registration token available. Request permission to generate one.");
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
    });
};
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("payload", payload);
      resolve(payload);
    });
  });
