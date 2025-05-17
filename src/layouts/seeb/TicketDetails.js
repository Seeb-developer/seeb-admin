import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { Menu, MenuItem } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { listenToMessages, sendMessage } from "./firebaseChat";
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "firebaseConfig";

const TicketDetails = () => {
    const location = useLocation();
    const ticketData = location.state?.ticket;
    const [ticket, setTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [ticketStatus, setTicketStatus] = useState("");
    const id = localStorage.getItem('id')

    useEffect(() => {
        fetchTicketDetails();

    }, [ticketData]);


    useEffect(() => {
        const q = query(
            collection(db, "tickets", ticketData?.ticket_uid, "messages"),
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // if (msgs.length == 0) {
            //     // console.log('No snapshots')
            //     // setMessage(data.subject);
            //     sendMessage();
            // }
            const processedMessages = formatMessages(msgs);
            setMessages(processedMessages);
            // setMessages(msgs);
        });

        return () => unsubscribe();
    }, []);

    const formatMessages = (messages) => {
        return messages.map((msg) => {
            const timestamp = msg.createdAt?.toDate?.();
            const timeString = timestamp
                ? `${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : '';
            return { ...msg, formattedTime: timeString };
        });
    };

    const handleSendMessage = async (msg) => {
        newMessage.trim();
        if (!newMessage) return;

        const body = {
            message: newMessage,
            ticket_id: ticketData.id,
            user_id: id, // use actual ID
            sender_id: id,
            created_by: "Admin",
        };
        console.log(body)
        try {
            // Send to backend
            await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}tickets/add-message`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            // Send to Firestore
            await addDoc(collection(db, "tickets", ticket?.ticket_uid, "messages"), {
                senderId: id,
                user_id: id,
                created_by: "admin",
                text: newMessage,
                createdAt: serverTimestamp(),
            });

            setNewMessage(""); // Clear input if user typed
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };


    // const handleSendMessage = async (optionalMsg) => {
    //     const messageToSend = optionalMsg ?? newMessage.trim();
    //     if (!messageToSend) return;

    //     await sendMessage(ticketId, messageToSend);
    //     setNewMessage(""); // Clear input only if it's from the input box
    // };

    const fetchTicketDetails = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}tickets/ticket/${ticketData.id}`);
            const result = await response.json();
            if (result.status === 200) {
                setTicket(result.data.ticket);
                setTicketStatus(result.data.ticket.status);
            }
        } catch (error) {
            console.error("Error fetching ticket details:", error);
        }
    };

    const updateTicketStatus = async (status) => {
        setTicketStatus(status);
        setAnchorEl(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}tickets/update-status${ticketData.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            const result = await response.json();
            if (result.status === 200) {
                toast.success("Ticket status updated successfully");
                fetchTicketDetails();
            }
        } catch (error) {
            toast.error("Failed to update ticket status");
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Toaster position="top-center" reverseOrder={false} />

            <div className="flex gap-6 mt-2 p-6 bg-white rounded-lg shadow-lg w-full h-[87vh]">
                {/* Left Section: Ticket and User Details */}
                <div className="w-1/3 border-r pr-4">
                    <h2 className="text-2xl font-bold mb-4">Ticket Details</h2>
                    {ticket ? (
                        <>
                            <p><strong>ID:</strong> {ticket.ticket_uid}</p>
                            <p><strong>Subject:</strong> {ticket.subject}</p>
                            <p><strong>Status:</strong> {ticketStatus}</p>
                            <p><strong>Date:</strong> {ticket.created_at}</p>
                            {ticket.file &&
                                <p>
                                    <strong>File:</strong>{" "}
                                    <a href={process.env.REACT_APP_HAPS_MAIN_BASE_URL + ticket.file} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                        Open
                                    </a>
                                </p>
                            }

                        </>
                    ) : (
                        <p>Loading ticket details...</p>
                    )}
                </div>

                {/* Right Section: ChatBot */}
                <div className="w-2/3 relative">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-bold">Chat</h2>
                        <div>
                            <MoreVertIcon
                                className="cursor-pointer"
                                onClick={(e) => setAnchorEl(e.currentTarget)}
                            />
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                                <MenuItem onClick={() => updateTicketStatus("Open")}>Open</MenuItem>
                                <MenuItem onClick={() => updateTicketStatus("In Progress")}>In Progress</MenuItem>
                                <MenuItem onClick={() => updateTicketStatus("Closed")}>Closed</MenuItem>
                            </Menu>
                        </div>
                    </div>
                    <div className="border p-4 rounded-lg h-[70vh] overflow-y-auto bg-gray-100">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.created_by === "admin" ? "justify-end" : "justify-start"} mb-2`}>
                                <div className={`p-3 rounded-lg text-white max-w-xs ${msg.created_by === "admin" ? "bg-blue-500" : "bg-gray-600"}`}>
                                    <p className="text-sm font-semibold">{msg.created_by}</p>
                                    <p>{msg.text}</p>
                                    <p className="text-xs text-gray-300 mt-1">
                                        {msg.formattedTime}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex">
                        <input
                            type="text"
                            className="border p-3 flex-1 rounded-l-lg text-lg"
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSendMessage();
                            }}
                        />
                        <button
                            className="bg-blue-500 text-white px-6 py-3 rounded-r-lg text-lg"
                            onClick={handleSendMessage}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TicketDetails;
