import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { Menu, MenuItem } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { listenToMessages, sendMessage } from "./firebaseChat";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db, auth } from "firebaseConfig";
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import axios from "axios";
import select from "assets/theme/components/form/select";


const TicketDetails = () => {
    const location = useLocation();
    const ticketData = location.state?.ticket;
    const [ticket, setTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploading, setUploading] = useState(true);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [ticketStatus, setTicketStatus] = useState("");
    const id = localStorage.getItem('id')
    const bottomRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const isTypingRef = useRef(false);
    const [adminTyping, setAdminTyping] = useState(false);

    const ticketUID = ticketData?.ticket_uid || ticketData?.id;

    useEffect(() => {
        fetchTicketDetails();
    }, [ticketData]);


    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView();
        }
    }, [messages]); // 👈 trigger when messages update

    useEffect(() => {
        const unsubscribeRef = { current: null };

        onAuthStateChanged(auth, (user) => {
            if (!user) {
                console.warn("❌ Firebase user not authenticated yet.");
                return;
            }


            if (!ticketUID) return;
            const ticketRef = doc(db, "tickets", ticketUID);
            const messagesRef = collection(ticketRef, "messages");
            const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

            unsubscribeRef.current = onSnapshot(
                messagesQuery,
                (snapshot) => {
                    const firebaseMessages = snapshot.docs.map((doc) => {
                        const data = doc.data();
                        const timestamp = data.timestamp?.toDate?.();
                        return {
                            id: doc.id,
                            ...data,
                            formattedTime: timestamp
                                ? `${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                : '',
                        };
                    });

                    // console.log("📥 Messages fetched from Firestore:", firebaseMessages);
                    setMessages(firebaseMessages);
                },
                (error) => {
                    console.error("🔥 Snapshot listener error:", error);
                }
            );
        });

        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
            }
        };
    }, [ticketData]);

    const updateTypingStatus = async (isTyping) => {
        try {
            const typingRef = doc(db, 'tickets', ticketUID, 'typing_status', 'admin');
            await setDoc(typingRef, {
                typing: isTyping,
                updated_at: serverTimestamp(),
            });
            // console.log('✅ Typing status updated');
        } catch (err) {
            console.error('🔥 Failed to update typing status:', err);
        }
    };


    useEffect(() => {
        if (!ticketUID) return;
        const db = getFirestore();
        const typingRef = doc(db, 'tickets', ticketUID, 'typing_status', 'partner');

        const unsubscribe = onSnapshot(typingRef, (docSnap) => {
            if (docSnap.exists()) {
                setAdminTyping(docSnap.data().typing);
            }
        });

        return unsubscribe;
    }, [ticketUID]);


    const displayMessages = adminTyping
        ? [...(messages || []), {
            id: 'typing',
            sender_type: 'partner',
            message: 'typing...',
            timestamp: new Date(),
            is_typing: true,
        }]
        : messages || [];


    const formatMessages = (messages) => {
        return messages.map((msg) => {
            const timestamp = msg.createdAt?.toDate?.();
            const timeString = timestamp
                ? `${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : '';
            return { ...msg, formattedTime: timeString };
        });
    };

    const uploadImageToBackend = async (image) => {
        const formData = new FormData();
        formData.append('file', image);

        const response = await axios.post(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}tickets/upload-image`, formData);

        console.log("image", response.data)
        return response.data?.file_path || null;
    };

    const handleSendMessage = async () => {

        const user = auth.currentUser;

        if (!newMessage.trim() && !selectedImage) return;

        try {
            setUploading(true);
            let imageUrl = null;

            if (selectedImage) {
                imageUrl = await uploadImageToBackend(selectedImage);
            }

            const messageData = {
                message: newMessage,
                image: imageUrl,
                ticket_id: ticketData.id,
                user_id: user.uid, // use actual ID
                sender_id: id || null,
                sender_type: 'admin',
                timestamp: serverTimestamp(),
                is_read_by_admin: true,
                is_read_by_user: false,
            };

            const PayloadData = {
                message: newMessage,
                file: imageUrl,
                ticket_id: ticketData.id,
                sender_id: id || null,
                sender_type: 'admin',
            };

            // Send to backend
            await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}tickets/add-message`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(PayloadData),
            });

            // Send to Firestore
            await addDoc(collection(db, "tickets", ticket?.ticket_uid, "messages"), messageData);

            setNewMessage("");
            setSelectedImage(null);
            setImagePreviewUrl(null);
        } catch (err) {
            console.error("Error sending message:", err);
        } finally {
            setUploading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const previewUrl = URL.createObjectURL(file); // 🖼️ blob preview
            setImagePreviewUrl(previewUrl);
        }
    };

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
            const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}tickets/update-status/${ticketData.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            console.log("url", `${process.env.REACT_APP_HAPS_MAIN_BASE_URL}tickets/update-status/${ticketData.id}`);

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
                        {displayMessages.map((msg, index) => {
                            const isLast = index === messages.length - 1;
                            return (
                                <div key={index} ref={isLast ? bottomRef : null} className={`flex ${msg.sender_type === "admin" ? "justify-end" : "justify-start"} mb-2`}>
                                    <div className={`p-3 rounded-lg text-white max-w-xs ${msg.sender_type === "admin" ? "bg-blue-500" : "bg-gray-600"}`}>
                                        <p className="text-sm font-semibold">{msg.created_by}</p>
                                        {msg.is_typing ? (
                                            <p className="italic animate-pulse">Typing...</p>
                                        ) : (
                                            <>
                                                {msg.image && (
                                                    <img
                                                        src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + msg.image}
                                                        alt="Message Attachment"
                                                        className="rounded-lg object-contain w-[200px] mt-1"
                                                    />
                                                )}
                                                <p>{msg.message}</p>
                                                <p className="text-xs text-gray-300 mt-1">{msg.formattedTime}</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                        {imagePreviewUrl && (
                            <div className="mt-2 flex items-center gap-2 relative w-fit">
                                <img
                                    src={imagePreviewUrl}
                                    alt="Preview"
                                    className="max-w-[150px] rounded border"
                                />
                                <button
                                    onClick={() => {
                                        setSelectedImage(null);
                                        setImagePreviewUrl(null);
                                    }}
                                    className="text-sm w-6 h-6 bg-red-700 rounded-full text-white  hover:bg-red-800 transition absolute top-0 right-[-30px]"
                                >
                                    x
                                </button>
                            </div>
                        )}
                    </div>


                    <div className="mt-4 flex items-center gap-2">
                        {/* File Upload Icon */}
                        <label htmlFor="image-upload" className="cursor-pointer bg-gray-200 p-2 rounded hover:bg-gray-300">
                            <AttachFileIcon />
                        </label>
                        <input
                            type="file"
                            id="image-upload"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <input
                            type="text"
                            className="border p-3 flex-1 rounded text-lg"
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => {
                                setNewMessage(e.target.value)
                                let text = e.target.value;
                                if (!isTypingRef.current && text.length > 0) {
                                    updateTypingStatus(true);
                                    isTypingRef.current = true;
                                }

                                // Clear previous timeout
                                if (typingTimeoutRef.current) {
                                    clearTimeout(typingTimeoutRef.current);
                                }

                                // Stop typing after 2s of inactivity
                                typingTimeoutRef.current = setTimeout(() => {
                                    updateTypingStatus(false);
                                    isTypingRef.current = false;
                                }, 2000);
                            }}

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
