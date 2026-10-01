import React, { useEffect, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import MessageInput from "./MessageInput";
import socket from "../../socket/socket";


const ChatWindow = ({ selectedChat, onCloseChat }) => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {

        if (!socket.connected) {
            socket.connect();
        }

        const joinUser = () => {
            const user = JSON.parse(localStorage.getItem("user"));
            console.log("CURRENT USER:", user);

            if (user?._id) {
                socket.emit("join", user._id);
                console.log("JOIN ROOM:", user._id);
            }

        };

        if (socket.connected) {
            joinUser();
        }
        socket.on("connect", joinUser);
        return () => {
            socket.off("connect", joinUser);
        };

    }, []);


    return (
        <section className="chat-window">
            <ChatHeader selectedChat={selectedChat} onCloseChat={onCloseChat} />
            <ChatMessages messages={messages} setMessages={setMessages} selectedChat={selectedChat} />
            <MessageInput selectedChat={selectedChat} setMessages={setMessages} />
        </section>
    );
};


export default ChatWindow;