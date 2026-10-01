const { Server } = require("socket.io");

let io;

const initializeSocket = (httpServer) => {

    io = new Server(httpServer, {
        cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
    });

    console.log("Socket.io initialized");
    io.on("connection", (socket) => {
        console.log("USER CONNECTED:", socket.id);
        socket.on("join", (userId) => {
            if (!userId) {
                console.log("No user ID for join");
                return;
            }
            socket.join(userId);
            console.log(`USER ${userId} JOINED ROOM`);
        });


        socket.on("send_message", (messageData) => {
            console.log("MESSAGE RECEIVED:", messageData);
            io.emit(
                "receive_message", messageData
            );

        });

        socket.on("disconnect", () => {
            console.log("USER DISCONNECTED:", socket.id);

        });
    });
    return io;
};


const getIO = () => {

    if (!io) {
        throw new Error("Socket.io has not been initialized");
    }
    return io;
};


module.exports = { initializeSocket, getIO };