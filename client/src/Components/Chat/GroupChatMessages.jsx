import React, { useEffect, useRef } from "react";
import { FaLock } from "react-icons/fa";
import GroupMessageBubble from "./GroupMessageBubble";
import socket from "../../socket/socket";
import api from "../../api/axios";

const GroupChatMessages = ({ selectedChat, messages, setMessages }) => {

    const messagesEndRef = useRef(null);
    const groupId = selectedChat?._id || selectedChat?.id || selectedChat?.groupId;
    const getCurrentUserId = () => {

        try {
            const user = JSON.parse(localStorage.getItem("user"));
            return (user?._id || user?.id || user?.userId || null)?.toString();
        } catch (error) {
            console.log("CURRENT USER ERROR:", error);
            return null;
        }
    };

    useEffect(() => {

        if (!messages?.length) {
            return;
        }
        messagesEndRef.current?.scrollIntoView(
            { behavior: "smooth", block: "end" }
        );
    }, [messages]);

    useEffect(() => {
        const fetchGroupMessages = async () => {

            if (!groupId) {
                setMessages([]);
                return;
            }

            try {

                console.log("LOADING GROUP:", groupId);
                const response = await api.get(`/group-messages/${groupId}`);
                console.log("GROUP MESSAGES RESPONSE:", response.data);

                const loadedMessages = response.data?.messages || response.data?.data || [];
                setMessages(
                    Array.isArray(
                        loadedMessages
                    )
                        ? loadedMessages
                        : []
                );

            } catch (error) {

                console.log("GET GROUP MESSAGES ERROR:", error);
                console.log("ERROR RESPONSE:", error.response?.data);
                setMessages([]);
            }
        };
        fetchGroupMessages();

    }, [groupId, setMessages]);

    useEffect(() => {
        if (!groupId) {
            return;
        }
        if (!socket.connected) {
            socket.connect();
        }

        const joinGroup = () => {
            console.log("JOIN GROUP ROOM:", groupId);
            socket.emit("join_group", groupId);

        };

        if (socket.connected) {
            joinGroup();
        }
        socket.on("connect", joinGroup);

        return () => {
            socket.off("connect", joinGroup);
        };

    }, [groupId]);

    useEffect(() => {

        if (!groupId) {
            return;
        }


        const handleGroupMessage =
            (messageData) => {
                console.log("GROUP SOCKET MESSAGE:", messageData);
                const messageGroupId = messageData?.group?._id || messageData?.group?.id || messageData?.group || messageData?.groupId;
                if (!messageGroupId || messageGroupId.toString() !== groupId.toString()) {
                    return;
                }
                setMessages(
                    (prevMessages) => {
                        const alreadyExists =
                            prevMessages.some(
                                (item) => item?._id && messageData?._id && item._id.toString() === messageData._id.toString()
                            );
                        if (alreadyExists) {
                            return prevMessages;
                        }
                        return [
                            ...prevMessages,
                            messageData,
                        ];

                    }
                );

            };


        socket.on("group_message_received", handleGroupMessage);


        return () => {
            socket.off("group_message_received", handleGroupMessage);
        };
    }, [groupId, setMessages]);

    const handleEditMessage =
        async (messageId, newText) => {
            try {

                console.log("GROUP EDIT ID:", messageId);
                const response = await api.put(`/group-messages/${messageId}`,
                    {
                        text: newText.trim(),
                    }
                );
                const updatedMessage = response.data?.message || response.data?.data;
                if (!updatedMessage) {
                    return;
                }

                setMessages(
                    (prevMessages) =>
                        prevMessages.map(
                            (item) => item._id === updatedMessage._id ? updatedMessage : item
                        )
                );

            } catch (error) {
                console.log("GROUP EDIT ERROR:", error);
            }
        };

    const handleDeleteMessage =
        async (messageId) => {

            try {

                console.log("GROUP DELETE ID:", messageId);
                const response = await api.delete(`/group-messages/${messageId}`);
                console.log("GROUP DELETE RESPONSE:", response.data);
                setMessages(
                    (prevMessages) =>
                        prevMessages.filter(
                            (item) => item._id !== messageId
                        )
                );

            } catch (error) {
                console.log("GROUP DELETE ERROR:",error);
            }

        };

    if (!selectedChat) {
        return (
            <div className="chat-messages">
                <div className="no-chat-selected">
                    <p>Select a group to start messaging</p>
                </div>
            </div>

        );
    }


    const currentUserId = getCurrentUserId();

    return (

        <div className="chat-messages group-chat-messages">
            <div className="chat-security-info">
                <div className="chat-security-icon">
                    <FaLock />
                </div>

                <div className="chat-security-content">
                    <p>Messages and calls are end-to-end encrypted. </p>
                    <span>
                        Only people in this group can read,
                        listen to, or share them.{" "}
                        <button type="button">
                            Learn more
                        </button>
                    </span>
                </div>
            </div>

            {messages.map(
                (message) => {
                    const senderId = message?.sender?._id || message?.sender?.id || message?.sender;
                    const sender = senderId?.toString();
                    const current = currentUserId?.toString();
                    const isSent = sender === current;
                    const senderName = message?.sender?.fullName || message?.sender?.name || message?.sender?.username || "Unknown";
                    const senderAvatar = message?.sender?.profileImage || message?.sender?.avatar || "";
                    const messageTime = message?.createdAt
                        ? new Date(
                            message.createdAt
                        ).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" }
                        ) : "";
                    return (
                        <GroupMessageBubble key={message._id} message={message} messageId={message._id} time={messageTime} type={isSent ? "sent" : "received"} onEdit={handleEditMessage} onDelete={handleDeleteMessage} senderName={senderName} senderAvatar={senderAvatar} />
                    );

                }
            )}

            <div ref={messagesEndRef} />

        </div>

    );

};


export default GroupChatMessages;