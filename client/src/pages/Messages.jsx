import React, { useState } from "react";

import "../style/Messages.css";
import Sidebar from "../Components/Chat/Sidebar";
import ConversationList from "../Components/Chat/ConversationList";
import ChatWindow from "../Components/Chat/ChatWindow";
import EmptyChat from "../Components/Chat/EmptyChat";

const Messages = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    return (
        <div className="messages-page">
            <div className="messages-layout">

                <Sidebar />
                <ConversationList selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
                {selectedChat ? (
                    <ChatWindow selectedChat={selectedChat}  onCloseChat={() => setSelectedChat(null)} />
                ) : (
                    <EmptyChat />
                )}
            </div>
        </div>
    );
};


export default Messages;