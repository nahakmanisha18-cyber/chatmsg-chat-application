import React from "react";
import { FaComments, FaLock, FaBolt } from "react-icons/fa";

const EmptyChat = () => {
    return (
        <section className="empty-chat">
            <div className="empty-chat-icon">
                <FaComments />
            </div>

            <div className="empty-chat-content">
                <h1>Welcome to ChatMsg</h1>
                <p>
                    Select a conversation from the left to start chatting
                    with your friends and stay connected anytime.
                </p>
            </div>

            <div className="empty-chat-features">
                <div className="empty-chat-feature">
                    <span className="empty-feature-icon">
                        <FaBolt />
                    </span>

                    <div>
                        <strong>Fast Messaging</strong>
                        <small>Send messages instantly</small>
                    </div>
                </div>

                <div className="empty-chat-feature">
                    <span className="empty-feature-icon">
                        <FaLock />
                    </span>

                    <div>
                        <strong>Private & Secure</strong>
                        <small>Your conversations stay private</small>
                    </div>
                </div>

            </div>

            <div className="empty-chat-hint">
                <span></span>
                Choose a conversation to begin
            </div>

        </section>
    );
};

export default EmptyChat;