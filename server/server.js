const express = require("express");
const cors = require("cors");
const http = require("http");

require("dotenv").config();

const connectDB = require("./config/dbConnect");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const messageRoutes = require("./routes/message.routes");
const conversationRoutes = require("./routes/conversation.routes");
const groupRoutes = require("./routes/group.routes");
const groupMessageRoutes = require("./routes/groupMessage.routes");

const {
    initializeSocket,
} = require("./socket/socket");

const app = express();


// Database
connectDB();


// Middleware
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/group-messages", groupMessageRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "ChatMsg server is running",
    });
});

const httpServer = http.createServer(app);

initializeSocket(httpServer);

// Start server
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});