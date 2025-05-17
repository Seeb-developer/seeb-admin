import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import "../src/style.css"; // Import the styles.css file

// Arrange Free React Context Provider
import { SoftUIControllerProvider } from "context";
import { ConfigProvider } from "antd";

// firebase
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
} ``

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#000",
      },
    }}
  >
    <BrowserRouter basename="/">
      <SoftUIControllerProvider>
        <App />
      </SoftUIControllerProvider>
    </BrowserRouter>

  </ConfigProvider>
);
