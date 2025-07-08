import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getDatabase } from "firebase/database"; // Optional if you use Realtime DB
import { getFirestore } from "firebase/firestore";

// 🔐 Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEaP0WI39iJNeLeCGKXhW6ctJ5iGLvT7o",
  authDomain: "seeb-partner.firebaseapp.com",
  projectId: "seeb-partner",
  storageBucket: "seeb-partner.firebasestorage.app",
  messagingSenderId: "835008801894",
  appId: "1:835008801894:web:9bdb1f1492901aa32391a7",
  measurementId: "G-Y811F2XMSS",
};

// 🔄 Initialize Firebase App
const app = initializeApp(firebaseConfig);

// 📦 Export Firestore and optionally Realtime DB
const db = getFirestore(app);
const rtdb = getDatabase(app); // Optional — only if needed
export { db, rtdb };

// 🔔 Setup Messaging
const messaging = getMessaging(app);

// 🔑 Request FCM Token
export const requestForToken = async () => {
  try {
    const registration = await navigator.serviceWorker.ready; // ✅ wait for registration

    const currentToken = await getToken(getMessaging(), {
      vapidKey: "eAHKfgMz4JTOnKE0DT6rIofnuqVpCh3XQw11SyZrbLs",
      serviceWorkerRegistration: registration, // ✅ pass it explicitly
    });

    if (currentToken) {
      console.log("✅ FCM Token:", currentToken);
      return currentToken;
    } else {
      console.warn("❗ No token available. Permission may be required.");
    }
  } catch (err) {
    console.error("❌ An error occurred while retrieving token:", err);
  }
};

// 📥 Listen for foreground messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("📩 Foreground FCM Payload:", payload);
      resolve(payload);
    });
  });
