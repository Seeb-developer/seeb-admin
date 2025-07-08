// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyDEaP0WI39iJNeLeCGKXhW6ctJ5iGLvT7o",
  authDomain: "seeb-partner.firebaseapp.com",
  projectId: "seeb-partner",
  storageBucket: "seeb-partner.firebasestorage.app",
  messagingSenderId: "835008801894",
  appId: "1:835008801894:web:9bdb1f1492901aa32391a7",
  measurementId: "G-Y811F2XMSS"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
