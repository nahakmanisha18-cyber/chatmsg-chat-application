const Group = require("../model/group.model");
const GroupMessage = require("../model/groupMessage.model");

const createGroup = async (req, res) => {
    try {

        const userId = req.userId;
        const { name } = req.body;
        let { members } = req.body;

        if (!name?.trim()) {

            return res.status(400).json({
                success: false,
                message: "Group name is required",
            });

        }

        if (typeof members === "string") {
            try {
                members = JSON.parse(members);
            } catch (error) {
                console.log("MEMBERS JSON PARSE ERROR:", error);

                return res.status(400).json({
                    success: false,
                    message: "Invalid group members"
                });

            }

        }

        if (!Array.isArray(members)) {
            members = [];
        }
        const groupMembers = [userId, ...members];

        const uniqueMembers = [
            ...new Set(
                groupMembers.map(
                    (id) => id.toString()
                )
            ),
        ];

        const group = await Group.create({
            name: name.trim(),
            admin: userId,
            members: uniqueMembers
        });

        await group.populate("members", "fullName email profileImage");
        await group.populate("admin", "fullName email profileImage");

        return res.status(201).json({
            success: true,
            message: "Group created successfully",
            group,
        });

    } catch (error) {

        console.error("CREATE GROUP ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create group",
            error:
                process.env.NODE_ENV === "development" ? error.message : undefined,
        });

    }

};

const getGroups = async (req, res) => {
    try {
        const userId = req.userId;

        const groups = await Group.find({
            members: userId,
        })
            .populate(
                "lastMessage",
                "text messageType fileUrl fileName fileSize fileMimeType createdAt sender"
            )
            .populate(
                "members",
                "fullName email profileImage"
            )
            .populate(
                "admin",
                "fullName email profileImage"
            );

        const groupsWithUnreadCount = await Promise.all(
            groups.map(async (group) => {

                const unreadCount =
                    await GroupMessage.countDocuments({
                        group: group._id,
                        sender: { $ne: userId },
                        readBy: { $ne: userId },
                    });

                return {
                    ...group.toObject(),
                    unreadCount,
                };
            })
        );

        return res.status(200).json({
            success: true,
            groups: groupsWithUnreadCount,
        });

    } catch (error) {

        console.error(
            "GET GROUPS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to load groups",
        });
    }
};

module.exports = { createGroup, getGroups, };