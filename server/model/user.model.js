const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
        },

        email: {
            type: String,
            unique: true,
            lowercase: true,
        },

        mobileNumber: {
            type: String,
        },

        password: {
            type: String,
        },

        profileImage: {
            type: String,
            default: "",
        },

        about: {
            type: String,
            default: "Hey there! I am using ChatMsg.",
        },

        isOnline: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);