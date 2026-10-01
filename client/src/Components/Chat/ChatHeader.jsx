import React, { useState } from "react";

import {FaVideo,FaPhoneAlt,FaEllipsisV,FaTrashAlt,FaTimes,FaUser} from "react-icons/fa";

const ChatHeader = ({ selectedChat, onCloseChat }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const handleDeleteChat = () => {
        console.log("Delete Chat");
        setMenuOpen(false);
    };

    const handleCloseChat = () => {
        setMenuOpen(false);
        onCloseChat();
    };

    return (
        <div className="chat-header">
            <div className="chat-user-info">
                <div className="conversation-avatar">
                    <FaUser />
                </div>
                <div className="chat-user-details">
                    <h3>
                        {selectedChat.name}
                    </h3>
                    <span>
                        {selectedChat.online
                            ? "Online"
                            : "Offline"
                        }
                    </span>
                </div>
            </div>

            <div className="chat-actions">
                <button type="button" className="chat-action-btn" title="Video Call" >
                    <FaVideo />
                </button>
                <button type="button" className="chat-action-btn" title="Audio Call" >
                    <FaPhoneAlt />
                </button>

                <div className="chat-menu-wrapper">
                    <button type="button" className="chat-action-btn" title="More" onClick={() => setMenuOpen(!menuOpen)}  >
                        <FaEllipsisV />
                    </button>

                    {menuOpen && (
                        <div className="chat-dropdown">
                            <button type="button" className="delete-chat-btn" onClick={handleDeleteChat} >
                                <FaTrashAlt />
                                <span>  Delete Chat  </span>
                            </button>

                            <button type="button" className="close-chat-btn" onClick={handleCloseChat} >
                                <FaTimes />
                                <span>   Close Chat  </span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default ChatHeader;