const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        text: {
            type: String,
            default: "",
        },

        messageType: {
            type: String,
            enum: ["text", "image", "video", "document"],
            default: "text",
        },

        fileUrl: {
            type: String,
            default: "",
        },

        fileName: {
            type: String,
            default: "",
        },

        fileSize: {
            type: Number,
            default: 0,
        },

        fileMimeType: {
            type: String,
            default: "",
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },

    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Message", messageSchema);