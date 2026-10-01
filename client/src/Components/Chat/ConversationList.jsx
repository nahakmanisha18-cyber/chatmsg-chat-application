import api from "../../api/axios";
import React, { useEffect, useState } from "react";
import socket from "../../socket/socket";
import { FaEllipsisV, FaCheckSquare, FaCog, FaSignOutAlt, FaSearch, FaPlus, } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ConversationItem from "./ConversationItem";
import "../../style/Messages.css";
import white from "../../assets/logo.png";
import dark from "../../assets/msg.png";


const ConversationList = ({ selectedChat, setSelectedChat, type = "private" }) => {

    const [menuOpen, setMenuOpen] = useState(false);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [conversations, setConversations] = useState([]);
    const currentUser = JSON.parse(
        localStorage.getItem("user")
    );

    const currentUserId = currentUser?._id || currentUser?.id || currentUser?.userId || "";

    useEffect(() => {

        const fetchConversations = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await api.get(
                    type === "group" ? "/groups" : "/conversations"
                );



                const conversationList = type === "group" ? response.data?.groups || [] : response.data?.conversations || [];

                if (type === "group") {

                    setConversations(
                        conversationList.map((group) => {

                            return {
                                id: group._id,
                                name: group.name,
                                profileImage: group.groupImage || "",
                                online: false,
                                message: group.lastMessage || null,
                                messageType: group.lastMessage?.messageType || "text",
                                fileUrl: group.lastMessage?.fileUrl || "",
                                fileName: group.lastMessage?.fileName || "",
                                sender: group.lastMessage?.sender || "",
                                isSent: false,
                                isRead: true,
                                time:
                                    group.lastMessage?.createdAt
                                        ? new Date(
                                            group.lastMessage.createdAt
                                        ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })
                                        : "",

                                unread: group.unreadCount || 0,
                                members: group.members || [],
                                isGroup: true,
                            };

                        })
                    );

                    return;
                }


                setConversations(
                    conversationList.map((item) => {

                        const lastMessage = item.lastMessage || null;
                        const lastMessageSenderId = lastMessage?.sender?._id || lastMessage?.sender?.id || lastMessage?.sender || "";

                        return {

                            id: item.user._id,

                            name: item.user.fullName,

                            profileImage: item.user.profileImage || "",

                            online: item.user.isOnline || false,

                            message: lastMessage,

                            messageType: lastMessage?.messageType || "text",

                            fileUrl: lastMessage?.fileUrl || "",

                            fileName: lastMessage?.fileName || "",

                            sender: lastMessage?.sender || "",

                            isSent: lastMessageSenderId && currentUserId && lastMessageSenderId.toString() === currentUserId.toString(),

                            isRead: lastMessage?.isRead || false,

                            time: lastMessage?.createdAt
                                ? new Date(
                                    lastMessage.createdAt
                                ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })
                                : "",

                            unread: item.unreadCount || 0,
                        };

                    })
                );

            } catch (error) {

                console.log("GET CONVERSATIONS ERROR:", error);
                setError(error.response?.data?.message || "Failed to load conversations");
            } finally {
                setLoading(false);
            }

        };

        fetchConversations();

    }, []);
    const updateConversationPreview = (messageData) => {
        const senderId = messageData.sender?._id || messageData.sender?.id || messageData.sender;
        const receiverId = messageData.receiver?._id || messageData.receiver?.id || messageData.receiver;
        const currentUser = JSON.parse(localStorage.getItem("user"));
        const currentUserId = currentUser?._id || currentUser?.id || currentUser?.userId;

        if (!senderId || !receiverId || !currentUserId) {
            return;
        }

        const sender = senderId.toString();
        const receiver = receiverId.toString();
        const current = currentUserId.toString();

        const otherUserId = sender === current ? receiver : sender;

        setConversations((prev) => {
            const updatedConversations = prev.map((conversation) => {

                if (conversation.id?.toString() !== otherUserId) {
                    return conversation;
                }

                const isCurrentChat = selectedChat?.id?.toString() === otherUserId;

                return {
                    ...conversation,
                    message: messageData,
                    messageType: messageData.messageType || "text",
                    fileUrl: messageData.fileUrl || "",
                    fileName: messageData.fileName || "",
                    sender: messageData.sender || "",
                    isSent: sender === current,
                    isRead: messageData.isRead || false,
                    time: messageData.createdAt
                        ? new Date(
                            messageData.createdAt
                        ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })
                        : "",

                    unread: receiver === current
                        ? (
                            isCurrentChat
                                ? 0
                                : (conversation.unread || 0) + 1
                        )
                        : conversation.unread,
                };
            });

            const updatedConversation = updatedConversations.find(
                (conversation) =>
                    conversation.id?.toString() ===
                    otherUserId
            );

            const otherConversations = updatedConversations.filter(
                (conversation) =>
                    conversation.id?.toString() !==
                    otherUserId
            );

            if (!updatedConversation) {
                return prev;
            }

            return [updatedConversation, ...otherConversations];
        });
    };

    useEffect(() => {

        const joinUser = () => {

            const user = JSON.parse(localStorage.getItem("user"));
            const userId = user?._id || user?.id || user?.userId;

            console.log("CONVERSATION LIST USER:", userId);

            if (userId) {
                socket.emit("join", userId.toString());
                console.log("CONVERSATION LIST JOIN ROOM:", userId.toString());
            }
        };

        const handleReceiveMessage = (messageData) => {
            console.log(" CONVERSATION LIST SOCKET:", messageData);
            updateConversationPreview(messageData);
        };

        if (!socket.connected) {
            socket.connect();
        }


        if (socket.connected) {
            joinUser();
        }
        socket.on("connect", joinUser);
        socket.on("receive_message", handleReceiveMessage);

        return () => {
            socket.off("connect", joinUser);

            socket.off("receive_message", handleReceiveMessage);

        };

    }, [selectedChat]);


    const filteredConversations = conversations.filter(
        (conversation) => conversation.name?.toLowerCase().includes(search.toLowerCase())
    );

    const handleNewGroup = () => {
        console.log("New Group");
        setMenuOpen(false);
    };

    const handleSelectChats = () => {
        console.log("Select Chats");
        setMenuOpen(false);
    };

    const handleSettings = () => {
        console.log("Settings");
        setMenuOpen(false);
    };

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setMenuOpen(false);
            navigate("/login");

        } catch (error) {
            console.log("LOGOUT ERROR:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setMenuOpen(false);
            navigate("/login");
        }
    };

    return (
        <section className="conversation-list">

            <div className="conversation-header">
                <div className="conversation-title">
                    <div className="conversation-logo">
                        <div className="conversation-logo">
                            <img className="logo-light" src={dark} alt="ChatMsg" />
                            <img className="logo-dark" src={white} alt="ChatMsg" />
                        </div>
                    </div>
                </div>

                <div className="conversation-menu-wrapper">
                    <button type="button" className="conversation-menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Conversation menu" >
                        <FaEllipsisV />
                    </button>

                    {menuOpen && (
                        <div className="conversation-dropdown">
                            <button type="button" onClick={handleNewGroup}>
                                <FaPlus />
                                <span>
                                    New Group
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={handleSelectChats}
                            >
                                <FaCheckSquare />
                                <span>
                                    Select Chats
                                </span>
                            </button>

                            <div className="dropdown-divider"></div>
                            <button
                                type="button"
                                onClick={handleSettings}
                            >
                                <FaCog />
                                <span>
                                    Settings
                                </span>
                            </button>

                            <button
                                type="button"
                                className="logout-option"
                                onClick={handleLogout}
                            >
                                <FaSignOutAlt />
                                <span>
                                    Logout
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="conversation-search-box">
                <FaSearch
                    className="conversation-search-icon"
                />
                <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    placeholder="Search conversations..."
                />
                {search && (
                    <button
                        type="button"
                        className="clear-search-btn"
                        onClick={() => setSearch("")}
                    >
                        ×
                    </button>
                )}
            </div>


            <div className="conversation-items">
                {loading ? (
                    <div className="no-conversation">
                        <p>Loading conversations...</p>
                    </div>

                ) : error ? (
                    <div className="no-conversation">
                        <p>{error}</p>
                    </div>

                ) : filteredConversations.length > 0 ? (
                    filteredConversations.map((conversation) => (
                        <ConversationItem
                            key={conversation.id}
                            isGroup={type === "group"}
                            conversation={conversation}
                            selectedChat={selectedChat}
                            onSelectChat={async (chat) => {
                                setConversations((prev) =>
                                    prev.map((item) =>
                                        item.id === chat.id
                                            ? {
                                                ...item,
                                                unread: 0,
                                            }
                                            : item
                                    )
                                );
                                setSelectedChat(chat);
                                try {
                                    await api.put(`/messages/read/${chat.id}`);
                                    console.log("MESSAGES MARKED AS READ");
                                } catch (error) {
                                    console.log("MARK READ ERROR:", error.response?.data || error.message);
                                }

                            }}
                        />
                    ))

                ) : (
                    <div className="no-conversation">
                        <FaSearch />
                        <p>No users found</p>
                    </div>
                )}

            </div>

        </section>
    );
};


export default ConversationList;