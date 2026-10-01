const mongoose = require("mongoose");

const groupMessageSchema = new mongoose.Schema(
    {

        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
        },

        sender: {
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

        readBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },

    {
        timestamps: true,
    }
);

module.exports = mongoose.model( "GroupMessage", groupMessageSchema);