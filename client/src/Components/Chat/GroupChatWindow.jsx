import React, { useEffect, useState } from "react";
import ChatHeader from "./ChatHeader";
import GroupChatMessages from "./GroupChatMessages";
import MessageInput from "./MessageInput";
import socket from "../../socket/socket";

const GroupChatWindow = ({ selectedGroup, onCloseChat }) => {

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!selectedGroup?._id) {
            return;
        }

        const groupId = selectedGroup._id;
        if (!socket.connected) {
            socket.connect();
        }
        const joinGroup = () => {
            console.log("JOINING GROUP:", groupId);
            socket.emit( "join_group", groupId );
        };
        if (socket.connected) {
            joinGroup();
        }
        socket.on("connect",joinGroup  );

        return () => {
            socket.off( "connect",  joinGroup  );
        };
    }, [
        selectedGroup,
    ]);


    if (!selectedGroup) {

        return (

            <section className="chat-window">
                <div className="no-chat-selected">
                    <p>
                        Select a group to start messaging
                    </p>
                </div>
            </section>
        );

    }

    return (

        <section className="chat-window group-chat-window">
            <ChatHeader selectedChat={selectedGroup} onCloseChat={onCloseChat} />
            <GroupChatMessages selectedChat={selectedGroup} messages={messages} setMessages={setMessages}/>
            <MessageInput selectedChat={selectedGroup} setMessages={setMessages} isGroup={true} groupId={selectedGroup?._id}/>
        </section>

    );

};


export default GroupChatWindow;