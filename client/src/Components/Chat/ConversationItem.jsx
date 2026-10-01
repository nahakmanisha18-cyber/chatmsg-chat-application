import React from "react";
import { FaUser, FaUsers, FaVideo, FaFileAlt } from "react-icons/fa";
import { Emoji, EmojiStyle } from "emoji-picker-react";

const ConversationItem = ({ conversation, selectedChat, onSelectChat, isGroup = false }) => {

    const isActive = selectedChat?.id === conversation.id;

    const isEmojiOnly = (text) => {
        if (!text || !text.trim()) {
            return false;
        }

        return /^(?:\p{Extended_Pictographic}|\p{Emoji_Presentation}|\p{Emoji_Modifier}|\uFE0F|\u200D|\u20E3|[\u{1F1E6}-\u{1F1FF}]|\s)+$/u.test(
            text.trim()
        );
    };

    const getMessagePreview = () => {

        const messageData = typeof conversation.message === "object" && conversation.message !== null ? conversation.message : null;
        const messageType = messageData?.messageType || conversation.messageType || "";
        const messageText = messageData?.text ||
            (
                typeof conversation.message === "string"
                    ? conversation.message
                    : ""
            );
        const fileName = messageData?.fileName || conversation.fileName || "";

        if (messageType === "image") {
            return (
                <div className="conversation-media-preview">
                    <i className="fa-regular fa-image conversation-image-icon"></i>
                    <span> Photo </span>
                </div>
            );
        }

        if (messageType === "video") {
            return (
                <div className="conversation-media-preview">\
                    <FaVideo className="conversation-preview-icon" />
                    <span> Video </span>
                </div>
            );
        }

        if (messageType === "document") {
            return (
                <div className="conversation-media-preview">
                    <FaFileAlt className="conversation-preview-icon" />
                    <span>
                        {fileName || "Document"}
                    </span>
                </div>
            );
        }

        if (isEmojiOnly(messageText)) {

            const emoji = Array.from(messageText.trim())[0];


            const unified = Array.from(emoji)
                .map((char) =>
                    char.codePointAt(0).toString(16)
                )
                .join("-");


            return (
                <Emoji unified={unified} size={20} emojiStyle={EmojiStyle.APPLE} />
            );
        }

        if (!messageText.trim()) {
            return (
                <span>
                    Hey there! I am using ChatMsg.
                </span>
            );
        }

        return (
            <span>
                {messageText.length > 30 ? messageText.substring(0, 30) + "..." : messageText}
            </span>
        );
    };

    const isSent = conversation.isSent === true;


    return (

        <div className={`conversation-item ${isActive ? "active" : ""}`} onClick={() => onSelectChat(conversation)}  >

            <div className="conversation-avatar-wrapper">
                {isGroup ? (
                    <div className="conversation-avatar">
                        <FaUsers />
                    </div>
                ) : conversation.profileImage ? (
                    <img src={conversation.profileImage} alt={conversation.name || "User"} className="conversation-avatar-image"/>
                ) : (
                    <div className="conversation-avatar">
                        <FaUser />
                    </div>
                )}

                {!isGroup && conversation.online && (
                    <span className="conversation-online"></span>
                )}

            </div>

            <div className="conversation-content">
                <div className="conversation-top">
                    <h3>
                        {conversation.name}
                    </h3>
                    <span>
                        {conversation.time || conversation.lastMessageTime || conversation.updatedAt || ""}
                    </span>
                </div>

                <div className="conversation-bottom">
                    <div className="conversation-message-preview">

                        {isSent && (
                            <i  className={`bi bi-check-all conversation-read-icon ${conversation.isRead  ? "read"  : "" }`} title={ conversation.isRead? "Read" : "Delivered"  } ></i>
                        )}

                        <div className="conversation-preview-content">
                            {getMessagePreview()}
                        </div>
                    </div>

                    {conversation.unread > 0 && (
                        <span className="unread-count">
                            {conversation.unread}
                        </span>
                    )}
                </div>

            </div>

        </div>
    );
};


export default ConversationItem;