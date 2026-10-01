const GroupMessage = require("../model/groupMessage.model");
const Group = require("../model/group.model");
const { getIO } = require("../socket/socket");
const cloudinary = require("../config/cloudinary");


const sendGroupMessage = async (req, res) => {
    try {
        const userId = req.userId;
        const { groupId, text, messageType = "text", fileUrl = "", fileName = "", fileSize = 0, fileMimeType = "" } = req.body;

        if (!groupId) {
            return res.status(400).json({
                success: false,
                message: "Group ID is required",
            });
        }

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Group not found",
            });
        }
        const isMember = group.members.some((memberId) => memberId.toString() === userId.toString());
        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: "You are not a member of this group",
            });
        }


        if (
            messageType === "text" &&
            !text?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Message text is required",
            });
        }

        const message = await GroupMessage.create({
            group: groupId,
            sender: userId,
            text: typeof text === "string" ? text.trim() : "",
            messageType,
            fileUrl,
            fileName,
            fileSize,
            fileMimeType,
            readBy: [userId],
        });

        await message.populate(
            "sender",
            "fullName email profileImage"
        );
        await message.populate(
            "group",
            "name groupImage admin members"
        );
        group.lastMessage = message._id;

        await group.save();

        try {
            const io = getIO();

            group.members.forEach((memberId) => {
                io.to(memberId.toString()).emit(
                    "group_message_received",
                    message
                );
            });

        } catch (socketError) {
            console.log("GROUP SOCKET ERROR:", socketError.message);
        }

        return res.status(201).json({
            success: true,
            message: "Group message sent successfully",
            data: message,
        });

    } catch (error) {

        console.error("SEND GROUP MESSAGE ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send group message",
        });
    }
};


const getGroupMessages = async (req, res) => {
    try {
        const userId = req.userId;
        const { groupId } = req.params;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Group not found",
            });
        }

        const isMember = group.members.some(
            (memberId) =>
                memberId.toString() ===
                userId.toString()
        );

        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: "You are not a member of this group",
            });
        }

        const messages = await GroupMessage.find({ group: groupId, })
            .populate(
                "sender",
                "fullName email profileImage"
            )
            .populate(
                "readBy",
                "_id fullName"
            )
            .sort({
                createdAt: 1,
            });


        return res.status(200).json({
            success: true,
            messages,
        });

    } catch (error) {

        console.error("GET GROUP MESSAGES ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to load group messages",
        });
    }
};

const updateGroupMessage = async (req, res) => {
    try {
        const userId = req.userId;
        const { messageId } = req.params;
        const { text } = req.body;

        if (!text?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message text is required",
            });
        }

        const message = await GroupMessage.findOne({ _id: messageId, sender: userId });
        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found or you are not allowed to update it",
            });
        }

        if (message.messageType !== "text") {
            return res.status(400).json({
                success: false,
                message: "Only text messages can be edited",
            });
        }

        message.text = text.trim();
        await message.save();
        await message.populate(
            "sender",
            "fullName email profileImage"
        );

        await message.populate(
            "group",
            "name groupImage admin members"
        );

        try {
            const io = getIO();

            const group =
                await Group.findById(
                    message.group._id
                ).select("members");


            if (group) {
                group.members.forEach(
                    (memberId) => {
                        io.to(
                            memberId.toString()
                        ).emit(
                            "group_message_updated",
                            message
                        );
                    }
                );
            }

        } catch (socketError) {
            console.log("GROUP UPDATE SOCKET ERROR:",
                socketError.message
            );
        }
        return res.status(200).json({
            success: true,
            message: "Group message updated successfully",
            data: message,
        });

    } catch (error) {

        console.error("UPDATE GROUP MESSAGE ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update group message",
        });
    }
};


const deleteGroupMessage = async (req, res) => {
    try {
        const userId = req.userId;
        const { messageId } = req.params;
        const message = await GroupMessage.findOne({ _id: messageId, sender: userId });
        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found or you are not allowed to delete it",
            });
        }
        const groupId = message.group.toString();

        await GroupMessage.deleteOne({ _id: messageId });
        try {
            const io = getIO();
            const group = await Group.findById(groupId).select("members");

            if (group) {
                group.members.forEach(
                    (memberId) => {
                        io.to(
                            memberId.toString()
                        ).emit(
                            "group_message_deleted",
                            {
                                messageId,
                                groupId,
                            }
                        );
                    }
                );
            }

        } catch (socketError) {
            console.log("GROUP DELETE SOCKET ERROR:", socketError.message);
        }

        return res.status(200).json({
            success: true,
            message: "Group message deleted successfully",
            messageId,
        });

    } catch (error) {

        console.error("DELETE GROUP MESSAGE ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete group message",
        });
    }
};

const markGroupMessagesAsRead = async (req, res) => {
    try {
        const userId = req.userId;
        const { groupId } = req.params;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Group not found",
            });
        }

        const isMember = group.members.some(
            (memberId) =>  memberId.toString() === userId.toString()
        );

        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: "You are not a member of this group",
            });
        }
        const unreadMessages = await GroupMessage.find({
            group: groupId,
            sender: { $ne: userId },
            readBy: { $ne: userId },
        }).select("_id sender");

        await GroupMessage.updateMany(
            {
                group: groupId,
                sender: { $ne: userId },
                readBy: { $ne: userId },
            },
            {
                $addToSet: {
                    readBy: userId,
                },
            }
        );
        try {
            const io = getIO();
            unreadMessages.forEach((message) => {
                io.to(message.sender.toString()).emit(
                    "group_message_read",
                    {
                        groupId: groupId.toString(),
                        messageId: message._id.toString(),
                        readBy: userId.toString(),
                    }
                );
            });

        } catch (socketError) {
            console.log(
                "GROUP READ SOCKET ERROR:",
                socketError.message
            );
        }

        return res.status(200).json({
            success: true,
            message: "Group messages marked as read",
        });

    } catch (error) {
        console.error(
            "MARK GROUP MESSAGES READ ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to mark group messages as read",
        });
    }
};

const uploadGroupMessageFile = async (req, res) => {
    try {
        const senderId = req.userId;
        const { groupId } = req.body;

        if (!groupId) {
            return res.status(400).json({
                success: false,
                message: "Group ID is required",
            });
        }


        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one file is required",
            });
        }

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Group not found",
            });
        }


        const isMember = group.members.some(
            (member) => member.toString() === senderId.toString()
        );

        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: "You are not a member of this group",
            });
        }

        const uploadedMessages = [];

        for (const file of req.files) {

            const uploadResult = await new Promise(
                (resolve, reject) => {

                    const uploadStream =
                        cloudinary.uploader.upload_stream(
                            {
                                folder: "chatmsg/group-messages",
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

            let messageType = "document";
            if (file.mimetype.startsWith("image/")) {
                messageType = "image";
            } else if (file.mimetype.startsWith("video/")) {
                messageType = "video";
            }

            const message = await GroupMessage.create({
                group: groupId,
                sender: senderId,
                text: "",
                messageType,
                fileUrl: uploadResult.secure_url,
                fileName: file.originalname,
                fileSize: file.size,
                fileMimeType: file.mimetype,
                readBy: [senderId],
            });

            group.lastMessage = message._id;
            await group.save();
            await message.populate(
                "sender",
                "fullName profileImage"
            );
            await message.populate(
                "group",
                "name groupImage"
            );

            const io = getIO();
            for (const memberId of group.members) {
                io.to(
                    memberId.toString()
                ).emit(
                    "group_message_received",
                    message
                );

            }
            uploadedMessages.push(message);
        }

        return res.status(201).json({
            success: true,
            message: "Group file(s) uploaded successfully",
            data: uploadedMessages,
        });

    } catch (error) {
        console.error("UPLOAD GROUP MESSAGE ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Group file upload failed",
            error: error.message,
        });
    }
};

module.exports = { sendGroupMessage, getGroupMessages, updateGroupMessage, deleteGroupMessage, markGroupMessagesAsRead, uploadGroupMessageFile };