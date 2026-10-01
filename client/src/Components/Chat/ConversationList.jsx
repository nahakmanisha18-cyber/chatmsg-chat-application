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
    const [suggestedUsers, setSuggestedUsers] = useState([]);

    const currentUser = JSON.parse(
        localStorage.getItem("user")
    );

    const currentUserId = currentUser?._id || currentUser?.id || currentUser?.userId || "";

    useEffect(() => {

        const fetchConversations = async () => {
            try {
                setLoading(true);
                setError("");

                if (type === "group") {
                    const response = await api.get("/groups");
                    const groups = response.data?.groups || [];

                    setConversations(
                        groups.map((group) => {
                            const lastMessage = group.lastMessage || null;
                            const lastMessageSenderId = lastMessage?.sender?._id || lastMessage?.sender?.id || lastMessage?.sender || "";
                            const isSent = lastMessageSenderId && currentUserId && lastMessageSenderId.toString() === currentUserId.toString();
                            const isRead = isSent ? Array.isArray(lastMessage?.readBy) && lastMessage.readBy.some((user) => {
                                const readUserId = user?._id || user?.id || user;
                                return (
                                    readUserId?.toString() !== currentUserId?.toString()
                                );
                            })
                                : false;

                            return {
                                id: group._id,
                                name: group.name,
                                profileImage: group.groupImage || "",
                                online: false,
                                message: lastMessage,
                                messageType: lastMessage?.messageType || "text",
                                fileUrl: lastMessage?.fileUrl || "",
                                fileName: lastMessage?.fileName || "",
                                sender: lastMessage?.sender || "",
                                isSent,
                                isRead,
                                time: lastMessage?.createdAt
                                    ? new Date(
                                        lastMessage.createdAt
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
                const [conversationResponse, usersResponse] =
                    await Promise.all([
                        api.get("/conversations"),
                        api.get("/users"),
                    ]);

                const conversationList = conversationResponse.data?.conversations || [];
                const allUsers = usersResponse.data?.users || [];
                const formattedConversations = conversationList.map((item) => {
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
                });

                setConversations(formattedConversations);
                const conversationUserIds =
                    new Set(
                        formattedConversations.map((conversation) =>
                            conversation.id.toString()
                        )
                    );

                const suggestions = allUsers.filter(
                    (user) => !conversationUserIds.has(user._id.toString())
                );

                setSuggestedUsers(suggestions);

            } catch (error) {
                console.log("GET CONVERSATIONS ERROR:", error);
                setError(error.response?.data?.message || "Failed to load conversations");
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();

    }, [type]);

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

            const existingConversation = prev.find(
                (conversation) => conversation.id?.toString() === otherUserId
            );

            if (existingConversation) {

                const isCurrentChat =
                    selectedChat?.id?.toString() ===
                    otherUserId;

                const updatedConversation = {
                    ...existingConversation,
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

                    unread:
                        receiver === current
                            ? (
                                isCurrentChat
                                    ? 0
                                    : (existingConversation.unread || 0) + 1
                            )
                            : existingConversation.unread,
                };
                return [
                    updatedConversation,
                    ...prev.filter(
                        (conversation) =>
                            conversation.id?.toString() !==
                            otherUserId
                    ),
                ];
            }

            const newUser =
                suggestedUsers.find(
                    (user) => user._id?.toString() === otherUserId
                );

            const otherUser = newUser || (messageData.sender && sender !== current ? messageData.sender : messageData.receiver);

            const newConversation = {
                id: otherUserId,

                name: otherUser?.fullName || otherUser?.name || "User",
                profileImage: otherUser?.profileImage || "",
                online: otherUser?.isOnline || false,
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

                unread: 0,
            };

            return [
                newConversation,
                ...prev,
            ];
        });

        setSuggestedUsers((prev) =>
            prev.filter(
                (user) =>
                    user._id?.toString() !==
                    otherUserId
            )
        );
    };

    useEffect(() => {

        const joinUser = () => {

            const user = JSON.parse(
                localStorage.getItem("user")
            );
            const userId = user?._id || user?.id || user?.userId;
            console.log("CONVERSATION LIST USER:", userId);
            if (userId) {
                socket.emit("join", userId.toString()
                );
                console.log("CONVERSATION LIST JOIN ROOM:", userId.toString());
            }
        };

        const handleReceiveMessage = (messageData) => {

            console.log(
                "PRIVATE MESSAGE:",
                messageData
            );

            if (type !== "group") {
                updateConversationPreview(
                    messageData
                );
            }
        };


        const handleGroupMessage = (messageData) => {

            console.log("GROUP MESSAGE:", messageData);

            if (type !== "group") {
                return;
            }
            const groupId = messageData?.group?._id || messageData?.group?.id || messageData?.group || messageData?.groupId;
            if (!groupId) {
                return;
            }
            const senderId = messageData?.sender?._id || messageData?.sender?.id || messageData?.sender || "";
            const currentUser = JSON.parse(localStorage.getItem("user"));
            const currentUserId = currentUser?._id || currentUser?.id || currentUser?.userId || "";
            const isSent = senderId && currentUserId && senderId.toString() === currentUserId.toString();

            setConversations((prev) => {

                const updated = prev.map(
                    (conversation) => {
                        if (conversation.id?.toString() !== groupId.toString()) {
                            return conversation;
                        }
                        const isCurrentGroup = selectedChat?.id?.toString() === groupId.toString();
                        return {
                            ...conversation,
                            message: messageData,
                            messageType: messageData?.messageType || "text",
                            fileUrl: messageData?.fileUrl || "",
                            fileName: messageData?.fileName || "",
                            sender: messageData?.sender || "",
                            isSent,
                            isRead: isSent ? false : conversation.isRead,
                            time: messageData?.createdAt
                                ? new Date(
                                    messageData.createdAt
                                ).toLocaleTimeString(
                                    [],
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }
                                )
                                : conversation.time,

                            unread: isSent || isCurrentGroup ? 0 : (conversation.unread || 0) + 1,
                        };
                    }
                );


                const updatedConversation =
                    updated.find(
                        (conversation) => conversation.id?.toString() === groupId.toString()
                    );


                if (!updatedConversation) {
                    return prev;
                }


                const otherConversations =
                    updated.filter(
                        (conversation) => conversation.id?.toString() !== groupId.toString()
                    );


                return [
                    updatedConversation,
                    ...otherConversations,
                ];
            });
        };

        const handleGroupMessageRead = (data) => {
            console.log("GROUP MESSAGE READ:", data);

            const groupId =
                data?.groupId ||
                data?.group?._id ||
                data?.group?.id;

            const messageId = data?.messageId;

            if (!groupId) return;

            setConversations((prev) =>
                prev.map((conversation) => {

                    if (
                        conversation.id?.toString() !==
                        groupId.toString()
                    ) {
                        return conversation;
                    }

                    if (
                        messageId &&
                        conversation.message?._id &&
                        conversation.message._id.toString() !==
                        messageId.toString()
                    ) {
                        return conversation;
                    }

                    return {
                        ...conversation,
                        isRead: true,
                    };
                })
            );
        };

        if (!socket.connected) {
            socket.connect();
        }

        if (socket.connected) {
            joinUser();
        }
        socket.on(
            "connect",
            joinUser
        );

        socket.on(
            "receive_message",
            handleReceiveMessage
        );

        socket.on(
            "group_message_received",
            handleGroupMessage
        );

        socket.on(
            "group_message_read",
            handleGroupMessageRead
        );


        return () => {

            socket.off(
                "connect",
                joinUser
            );

            socket.off(
                "receive_message",
                handleReceiveMessage
            );

            socket.off(
                "group_message_received",
                handleGroupMessage
            );

            socket.off(
                "group_message_read",
                handleGroupMessageRead
            );

        };

    }, [selectedChat, type]);


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

                            <button type="button" onClick={handleSelectChats}>
                                <FaCheckSquare />
                                <span>
                                    Select Chats
                                </span>
                            </button>

                            <div className="dropdown-divider"></div>
                            <button type="button" onClick={handleSettings} >
                                <FaCog />
                                <span>
                                    Settings
                                </span>
                            </button>

                            <button type="button" className="logout-option" onClick={handleLogout}>
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

                ) : (
                    <>
                        {filteredConversations.length > 0 && (
                            <>
                                {filteredConversations.map(
                                    (conversation) => (
                                        <ConversationItem key={conversation.id} isGroup={type === "group"} conversation={conversation} selectedChat={selectedChat}
                                            onSelectChat={async (chat) => {
                                                setConversations((prev) =>
                                                    prev.map((item) => item.id === chat.id ? { ...item, unread: 0, } : item)
                                                );
                                                setSelectedChat(chat);
                                                try {
                                                    if (type === "group") {
                                                        await api.put(`/group-messages/read/${chat.id}`);
                                                    } else {
                                                        await api.put(`/messages/read/${chat.id}`);
                                                    }
                                                } catch (error) {
                                                    console.log("MARK READ ERROR:", error.response?.data || error.message);
                                                }
                                            }}
                                        />
                                    )
                                )}
                            </>
                        )}

                        {type !== "group" &&
                            suggestedUsers.length > 0 && (
                                <div className="suggested-users-section">
                                    <div className="suggested-users-title">
                                        <span>Start a new chat</span>
                                    </div>

                                    {suggestedUsers
                                        .filter((user) => user.fullName?.toLowerCase().includes(search.toLowerCase()))
                                        .map((user) => (
                                            <div key={user._id} className="suggested-user-item"
                                                onClick={() => {
                                                    const newChat = {
                                                        id: user._id,
                                                        name: user.fullName,
                                                        profileImage: user.profileImage || "",
                                                        online: user.isOnline || false,
                                                        message: null,
                                                        messageType: "text",
                                                        fileUrl: "",
                                                        fileName: "",
                                                        sender: "",
                                                        isSent: false,
                                                        isRead: false,
                                                        time: "",
                                                        unread: 0,
                                                    };
                                                    setSelectedChat(newChat);
                                                }} >
                                                <div className="suggested-user-image">
                                                    {user.profileImage ? (
                                                        <img src={user.profileImage} alt={user.fullName} />
                                                    ) : (
                                                        <div className="suggested-user-placeholder">
                                                            {user.fullName?.charAt(0)?.toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="suggested-user-info">
                                                    <h4>
                                                        {user.fullName}
                                                    </h4>
                                                    <p>
                                                        Start a conversation
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}

                        {filteredConversations.length === 0 &&
                            suggestedUsers.length === 0 && (
                                <div className="no-conversation">
                                    <FaSearch />
                                    <p>No users found</p>
                                </div>
                            )}
                    </>
                )}

            </div>

        </section>
    );
};


export default ConversationList;