const Conversation = require("../model/conversation.model");
const Message = require("../model/message.model");
const User = require("../model/user.model");



const getConversations = async (req, res) => {

    try {

        const currentUserId = req.userId;
        const conversations = await Conversation.find({
            participants: currentUserId
        })
            .populate(
                "participants",
                "fullName profileImage isOnline"
            )
            .populate({
                path: "lastMessage",
                select:
                    "text messageType fileUrl fileName sender receiver isRead createdAt"
            })
            .sort({
                updatedAt: -1
        });

        const conversationList = await Promise.all(
            conversations.map(async (conversation) => {
                const otherUser = conversation.participants.find(
                    (user) => user._id.toString() !==  currentUserId.toString()
                );

                if (!otherUser) {
                    return null;
                }

                const unreadCount = await Message.countDocuments({
                    conversation: conversation._id,
                    receiver: currentUserId,
                    isRead: false,
                });


                return {
                    conversationId: conversation._id,
                    user: otherUser,
                    lastMessage: conversation.lastMessage,
                    unreadCount,

                };

            })
        );
        const filteredList = conversationList.filter(Boolean);


        return res.status(200).json({
            success: true,
            conversations: filteredList,
        });


    } catch (error) {
        console.error( "GET CONVERSATIONS ERROR:",  error );
        return res.status(500).json({ 
            success: false,
            message: "Failed to get conversations",
        });

    }

};
module.exports = {
    getConversations,
};