const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },

        groupImage: {
            type: String,
            default: "",
        },

        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GroupMessage",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Group", groupSchema);