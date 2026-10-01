const Conversation = require("../model/conversation.model");
const Message = require("../model/message.model");
const { getIO } = require("../socket/socket");
const cloudinary = require("../config/cloudinary");


const sendMessage = async (req, res) => {

    try {
        const senderId = req.userId;
        const { receiverId, text } = req.body;
        if (!receiverId || !text?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Receiver and message are required",
            });

        }
        let conversation = await Conversation.findOne({
            participants: {
                $all: [
                    senderId,
                    receiverId
                ],
            },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [
                    senderId,
                    receiverId
                ],
            });

        }
        const message = await Message.create({
            conversation: conversation._id,
            sender: senderId,
            receiver: receiverId,
            text: text.trim(),
        });

        conversation.lastMessage = message._id;

        await conversation.save();
        await message.populate(
            "sender",
            "fullName profileImage"
        );
        await message.populate(
            "receiver",
            "fullName profileImage"
        );

        const io = getIO();
        io.to(
            receiverId.toString()
        ).emit(
            "receive_message",
            message
        );
        io.to(
            senderId.toString()
        ).emit(
            "receive_message",
            message
        );

        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: message,
        });


    } catch (error) {
        console.error("SEND MESSAGE ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send message",
        });
    }
};

const getMessages = async (req, res) => {

    try {
        const currentUserId = req.userId;
        const otherUserId = req.params.userId;
        const conversation =
            await Conversation.findOne({
                participants: {
                    $all: [
                        currentUserId,
                        otherUserId
                    ]
                }
            });

        if (!conversation) {
            return res.status(200).json({
                success: true,
                messages: []
            });

        }

        const messages = await Message.find({ conversation: conversation._id })
            .populate(
                "sender",
                "fullName profileImage"
            )
            .populate(
                "receiver",
                "fullName profileImage"
            )
            .sort({
                createdAt: 1
            });


        return res.status(200).json({
            success: true,
            messages
        });

    } catch (error) {

        console.error("GET MESSAGES ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get messages"

        });
    }
};

const markMessagesAsRead = async (req, res) => {

    try {
        const currentUserId = req.userId;
        const otherUserId = req.params.userId;
        const conversation = await Conversation.findOne({
            participants: {
                $all: [
                    currentUserId,
                    otherUserId
                ]
            }
        });
        if (!conversation) {
            return res.status(200).json({
                success: true,
                message: "No conversation found",
            });
        }
        await Message.updateMany(
            {
                conversation: conversation._id,
                receiver: currentUserId,
                isRead: false,
            },
            {
                $set: {
                    isRead: true,
                }
            }
        );
        return res.status(200).json({
            success: true,
            message: "Messages marked as read",
        });


    } catch (error) {
        console.error("MARK MESSAGE READ ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to mark messages as read",

        });

    }

};

const updateMessage = async (req, res) => {
    try {
        const userId = req.userId;
        const messageId = req.params.messageId;
        const { text } = req.body;

        if (!text?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message text is required",
            });
        }
        const message = await Message.findOne({ _id: messageId, sender: userId, });
        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found or you are not allowed to update it",
            });
        }

        message.text = text.trim();
        await message.save();
        await message.populate(
            "sender",
            "fullName profileImage"
        );
        await message.populate(
            "receiver",
            "fullName profileImage"
        );
        const io = getIO();
        io.to(message.receiver._id.toString()).emit(
            "message_updated",
            message
        );

        io.to(message.sender._id.toString()).emit(
            "message_updated",
            message
        );

        return res.status(200).json({
            success: true,
            message: "Message updated successfully",
            data: message,
        });

    } catch (error) {
        console.error("UPDATE MESSAGE ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update message",
        });
    }
};


const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const message = await Message.findOne({ _id: messageId, sender: req.userId });

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }

        await Message.findByIdAndDelete(messageId);
        const io = getIO();
        io.to(message.receiver.toString()).emit("message_deleted", {
            messageId,
        });

        io.to(message.sender.toString()).emit("message_deleted", {
            messageId,
        });

        res.status(200).json({
            success: true,
            message: "Message deleted successfully",
            messageId,
        });

    } catch (error) {
        console.error("DELETE MESSAGE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete message",
        });
    }
};

const uploadMessageFile = async (req, res) => {
    try {

        const senderId = req.userId;
        const { receiverId } = req.body;

        if (!receiverId) {
            return res.status(400).json({
                success: false,
                message: "Receiver ID is required",
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one file is required",
            });
        }

        let conversation = await Conversation.findOne({
            participants: {
                $all: [
                    senderId,
                    receiverId
                ],
            },
        });

        if (!conversation) {

            conversation = await Conversation.create({
                participants: [
                    senderId,
                    receiverId
                ],
            });

        }

        const uploadedMessages = [];

        for (const file of req.files) {

            const uploadResult = await new Promise(
                (resolve, reject) => {

                    const uploadStream =
                        cloudinary.uploader.upload_stream(
                            {
                                folder: "chatmsg/messages",
                                resource_type: "auto",
                            },
                            (error, result) => {

                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(result);
                                }

                            }
                        );

                    uploadStream.end(file.buffer);

                }
            );

            const message = await Message.create({
                conversation: conversation._id,
                sender: senderId,
                receiver: receiverId,
                text: "",
                messageType:
                    file.mimetype.startsWith("image/")
                        ? "image"
                        : file.mimetype.startsWith("video/")
                            ? "video"
                            : "document",
                fileUrl: uploadResult.secure_url,
                fileName: file.originalname,
                fileSize: file.size,
                fileMimeType: file.mimetype,
            });

            conversation.lastMessage = message._id;
            await conversation.save();
            await message.populate(
                "sender",
                "fullName profileImage"
            );
            await message.populate(
                "receiver",
                "fullName profileImage"
            );
            const io = getIO();

            io.to(
                receiverId.toString()
            ).emit(
                "receive_message",
                message
            );

            io.to(
                senderId.toString()
            ).emit(
                "receive_message",
                message
            );
            uploadedMessages.push(message);

        }

        return res.status(201).json({
            success: true,
            message: "File(s) uploaded successfully",
            data: uploadedMessages,
        });

    } catch (error) {

        console.error("UPLOAD MESSAGE ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "File upload failed",
            error: error.message,
        });
    }
};

module.exports = { sendMessage, getMessages, markMessagesAsRead, updateMessage, deleteMessage, uploadMessageFile };