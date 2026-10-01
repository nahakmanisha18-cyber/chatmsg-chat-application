import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import socket from "../../socket/socket";
import api from "../../api/axios";
import { FaLock, } from "react-icons/fa";

const ChatMessages = ({ selectedChat, messages, setMessages }) => {

    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!messages.length) {
            return;
        }
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [messages]);

    const getCurrentUserId = () => {

        try {

            const user = JSON.parse(localStorage.getItem("user"));
            console.log("CURRENT USER:", user);
            return (
                user?._id ||
                user?.id ||
                user?.userId ||
                null
            )?.toString();

        } catch (error) {
            console.log("CURRENT USER ERROR:", error);
            return null;
        }
    };
    const selectedUserId = selectedChat?._id || selectedChat?.id || selectedChat?.userId;
    const handleEditMessage = async (messageId, newText) => {

        try {

            console.log("EDIT MESSAGE ID:", messageId);
            console.log("EDIT MESSAGE TEXT:", newText);
            const response = await api.put(`/messages/${messageId}`,
                { text: newText.trim(), }
            );

            console.log("UPDATE MESSAGE RESPONSE:", response.data);
            const updatedMessage = response.data?.data;

            if (!updatedMessage) {
                console.log("UPDATED MESSAGE NOT FOUND");
                return;
            }

            setMessages((prevMessages) =>
                prevMessages.map((item) =>
                    item._id === updatedMessage._id ? updatedMessage : item
                )
            );

        } catch (error) {
            console.log("UPDATE MESSAGE ERROR:", error);
            console.log("STATUS:", error.response?.status);
            console.log("ERROR RESPONSE:", error.response?.data);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this message?");
            if (!confirmDelete) {
                return;
            }
            const response = await api.delete(`/messages/${messageId}`);

            console.log("DELETE MESSAGE RESPONSE:", response.data);

            setMessages((prevMessages) =>
                prevMessages.filter((item) => item._id !== messageId)
            );

        } catch (error) {
            console.log("DELETE MESSAGE ERROR:", error);
            console.log("ERROR RESPONSE:", error.response?.data);
            alert(error.response?.data?.message || "Failed to delete message");
        }
    };

    useEffect(() => {
        const selectedUserId =
            selectedChat?._id ||
            selectedChat?.id ||
            selectedChat?.userId;

        const fetchMessages = async () => {
            if (!selectedUserId) {
                setMessages([]);
                return;
            }

            try {
                console.log("LOADING CHAT:", selectedUserId);
                const response = await api.get(`/messages/${selectedUserId}`);
                console.log("MESSAGES API RESPONSE:", response.data);
                const loadedMessages = response.data?.messages || response.data?.data || [];

                setMessages(
                    Array.isArray(loadedMessages) ? loadedMessages : []
                );
            } catch (error) {
                console.log("GET MESSAGES ERROR:", error);
                console.log("ERROR RESPONSE:", error.response?.data);

                setMessages([]);
            }
        };

        fetchMessages();
    }, [selectedChat, setMessages]);

    useEffect(() => {

        const handleReceiveMessage = (messageData) => {
            console.log("SOCKET MESSAGE RECEIVED:", messageData);

            if (!selectedUserId) {
                return;
            }
            const senderId = (
                messageData?.sender?._id ||
                messageData?.sender?.id ||
                messageData?.sender ||
                messageData?.senderId ||
                ""
            ).toString();

            const receiverId = (
                messageData?.receiver?._id ||
                messageData?.receiver?.id ||
                messageData?.receiver ||
                messageData?.receiverId ||
                ""
            ).toString();
            const currentUserId = getCurrentUserId();

            if (!senderId || !receiverId || !currentUserId) {
                return;
            }
            const selectedUserIdString = selectedUserId.toString();
            const isCurrentChat =
                (
                    senderId === selectedUserIdString &&
                    receiverId === currentUserId
                ) ||
                (
                    senderId === currentUserId &&
                    receiverId === selectedUserIdString
                );

            if (!isCurrentChat) {
                return;
            }

            setMessages((prevMessages) => {
                const alreadyExists =
                    prevMessages.some(
                        (item) =>
                            item._id &&
                            messageData._id &&
                            item._id.toString() ===
                            messageData._id.toString()
                    );

                if (alreadyExists) {
                    return prevMessages;
                }
                return [
                    ...prevMessages,
                    messageData,
                ];
            });

        };
        socket.on("receive_message", handleReceiveMessage);
        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };

    }, [selectedUserId]);

    if (!selectedChat) {

        return (
            <div className="chat-messages">
                <div className="no-chat-selected">
                    <p>Select a chat to start messaging </p>
                </div>
            </div>
        );
    }

    const currentUserId = getCurrentUserId();

    return (
        <div className="chat-messages">

            <div className="chat-security-info">
                <div className="chat-security-icon">
                    <FaLock />
                </div>

                <div className="chat-security-content">
                    <p> Messages and calls are end-to-end encrypted. </p>

                    <span>
                        Only people in this chat can read,
                        listen to, or share them.{" "}
                        <button type="button">
                            Learn more
                        </button>
                    </span>
                </div>
            </div>

            {messages.map((message) => {

                const senderId = message.sender?._id || message.sender?.id || message.sender;

                const sender = senderId?.toString();
                const current = currentUserId?.toString();
                const isSent = sender === current;


                console.log("MESSAGE TYPE CHECK:", {message: message.text,sender,current,isSent});
                return (
                    <MessageBubble
                        key={message._id}
                        message={message}
                        messageId={message._id}
                        time={
                            message.createdAt
                                ? new Date(message.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })
                                : ""
                        }
                        type={isSent ? "sent" : "received"}
                        isRead={message.isRead}
                        onEdit={handleEditMessage}
                        onDelete={handleDeleteMessage}
                    />
                );
            })}

            <div ref={messagesEndRef} />
        </div>

    );

};


export default ChatMessages;