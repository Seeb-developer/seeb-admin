// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyDQWhiMJaE9d06keQ4ybm3NX1zlcvSoAY8",
  authDomain: "dorfee-admin.firebaseapp.com",
  projectId: "dorfee-admin",
  storageBucket: "dorfee-admin.appspot.com",
  messagingSenderId: "55118931471",
  appId: "1:55118931471:web:a3fe11cbdc22307b27257a",
  measurementId: "G-S7V9QY12KL",
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
