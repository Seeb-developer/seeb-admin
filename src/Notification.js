import React, { useState, useEffect } from "react";
import { requestForToken, onMessageListener } from "./firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Notification() {
  const [notification, setNotification] = useState({ title: "", body: "" });

  useEffect(() => {
    // Request permission and token
    requestForToken()
      .then(() => console.log("✅ Token found"))
      .catch(() => console.log("🚫 Token not found"));

    // Listen for messages
    const unsubscribe = onMessageListener((payload) => {
      const title = payload?.notification?.title || "Notification";
      const body = payload?.notification?.body || "";
      setNotification({ title, body });

      toast.info(
        <>
          <strong>{title}</strong>
          <div>{body}</div>
        </>,
        {
          autoClose: 4000,
        }
      );
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  return (
    <div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default Notification;
