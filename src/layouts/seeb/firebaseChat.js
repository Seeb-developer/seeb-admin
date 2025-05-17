
// Ensure this points to Firestore setup
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "firebaseConfig";

// Send message to Firestore
export const sendMessage = async (ticketId, message) => {
  const msgRef = collection(db, "tickets", ticketId, "messages");
  await addDoc(msgRef, {
    senderId: "admin_001", // replace with actual admin/user ID
    senderType: "admin",   // or 'user'
    message,
    timestamp: serverTimestamp(),
  });
};

// Listen for messages in Firestore
export const listenToMessages = (ticketId, callback) => {
  const msgRef = collection(db, "tickets", ticketId, "messages");
  const q = query(msgRef, orderBy("timestamp", "asc"));

  return onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs.map(doc => doc.data());
    msgs.forEach(msg => callback(msg));
  });
};

