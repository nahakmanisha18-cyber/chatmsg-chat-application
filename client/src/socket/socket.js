import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
    autoConnect: false,
    transports: ["websocket"],
});
socket.on("connect", () => {
    console.log("SOCKET CONNECTED:", socket.id);
});
socket.on("connect_error", (error) => {
    console.log("SOCKET CONNECTION ERROR:", error.message
    );
});
socket.on("disconnect", (reason) => {
    console.log("SOCKET DISCONNECTED:", reason);
});


export default socket;