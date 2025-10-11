import React, { useState, useEffect } from "react";
import { requestForToken, onMessageListener } from "./firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Notification() {
  const [notification, setNotification] = useState({ title: "", body: "" });

  useEffect(() => {    
    // Listen for messages
    onMessageListener()
      .then((payload) => {
      const title = payload?.notification?.title;
      const body = payload?.notification?.body;
      setNotification({ title, body });
      console.log("Notification page:", payload, title, body );

      toast.info(
        <>
          <strong>{title}</strong>
          <div>{body}</div>
        </>,
        {
          autoClose: 4000,
        }
      );
    }).catch((err) => {
      console.error("❌ Failed to receive message:", err);
    });

  }, []);
    
  //  useEffect(() => {
  //   toast.info("🎉 Welcome! Dummy notification working.", {
  //     autoClose: 3000,
  //     position: "bottom-right",
  //   });
  // });

  return (
    <div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default Notification;
