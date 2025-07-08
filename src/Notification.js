import React, { useState, useEffect } from "react";
// import toast, { Toaster } from "react-hot-toast";
import { requestForToken, onMessageListener } from "./firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "antd";
import { getToken } from "firebase/messaging";


// const Notification = () => {
//   const [notification, setNotification] = useState({ title: "", body: "" });
//   const notify = () => toast(<ToastDisplay />);
//   function ToastDisplay() {
//     return (
//       <div className="bg-black text-white border rounded-lg ">
//         <p>
//           sdsd
//           <b>{notification?.title} mmmm</b>
//         </p>
//         <p>{notification?.body} mmm</p>
//       </div>
//     );
//   }

//   useEffect(() => {
//     if (notification?.title) {
//       notify();
//     }
//   }, [notification]);

//   requestForToken();

//   onMessageListener()
//     .then((payload) => {
//       setNotification({ title: payload?.notification?.title, body: payload?.notification?.body });
//     })
//     .catch((err) => console.log("failed: ", err));

//   return <Toaster/>;
// };

// export default Notification;


function Notification() {

  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({title: '', body: ''});
  const [isTokenFound, setTokenFound] = useState(false);
  // getToken(setTokenFound);

 useEffect(() => {
  requestForToken()
    .then(() => setTokenFound(true))
    .catch(() => setTokenFound(false));

  const unsubscribe = onMessageListener()
    .then((payload) => {
      toast.info(`${payload?.notification?.title}: ${payload?.notification?.body}`, {
        autoClose: 3000,
      });
      setNotification({ title: payload?.notification?.title, body: payload?.notification?.body });
    })
    .catch((err) => console.log('failed: ', err));

  return () => unsubscribe;
}, []);


  return (
    <div className="App">
        {/* <toast onClose={() => setShow(false)} show={show} delay={3000} autohide animation style={{
          position: 'absolute',
          top: 20,
          right: 20,
          minWidth: 200
        }}>
          <toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded mr-2"
              alt=""
            />
            <strong className="mr-auto">{notification.title}</strong>
            <small>just now</small>
          </toast.Header>
          <toast.Body>{notification.body}</toast.Body>
        </toast> */}
      {/* <header className="App-header">
        {isTokenFound && <h1> Notification permission enabled 👍🏻 </h1>}
        {!isTokenFound && <h1> Need notification permission ❗️ </h1>}
        <img src={logo} className="App-logo" alt="logo" />
        <Button onClick={() => setShow(true)}>Show Toast</Button>
      </header> */}

      <ToastContainer />

    </div>
  );
}
export default Notification;
