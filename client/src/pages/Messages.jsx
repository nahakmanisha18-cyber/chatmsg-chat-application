import React, { useState } from "react";

import "../style/Messages.css";
import Sidebar from "../Components/Chat/Sidebar";
import ConversationList from "../Components/Chat/ConversationList";
import ChatWindow from "../Components/Chat/ChatWindow";
import EmptyChat from "../Components/Chat/EmptyChat";
import CreateGroup from "../Components/Chat/CreateGroup";

const Messages = () => {

    const [selectedChat, setSelectedChat] = useState(null);
    const [createGroupOpen, setCreateGroupOpen] = useState(false);

    return (
        <div className="messages-page">

            <div className="messages-layout">

                <Sidebar />
                <ConversationList selectedChat={selectedChat} setSelectedChat={setSelectedChat} setCreateGroupOpen={setCreateGroupOpen}/>
                {createGroupOpen ? (
                    <CreateGroup
                        onClose={() => setCreateGroupOpen(false)}
                        onGroupCreated={(newGroup) => {
                            console.log( "New Group Created:",  newGroup );
                            setCreateGroupOpen(false);
                        }}
                    />
                ) : selectedChat ? (
                    <ChatWindow selectedChat={selectedChat} onCloseChat={() => setSelectedChat(null)}/>
                ) : (
                    <EmptyChat />
                )}

            </div>

        </div>
    );
};

export default Messages;