const Group = require("../model/group.model");

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
                console.log( "MEMBERS JSON PARSE ERROR:",  error );
               
                return res.status(400).json({
                    success: false,
                    message: "Invalid group members"
                });

            }

        }

        if (!Array.isArray(members)) {  
            members = [];
        }
        const groupMembers = [ userId, ...members];

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

        await group.populate( "members", "fullName email profileImage");
        await group.populate( "admin", "fullName email profileImage" );

        return res.status(201).json({
            success: true,
            message: "Group created successfully",
            group,
        });

    } catch (error) {
       
        console.error( "CREATE GROUP ERROR:",  error );
        return res.status(500).json({
            success: false,
            message: "Failed to create group",
            error:
                process.env.NODE_ENV === "development"   ? error.message: undefined,
        });

    }

};


const getGroups = async (req, res) => {

    try {

        const userId = req.userId;
        const groups = await Group.find({ members: userId})
            .populate(
                "members",
                "fullName email profileImage"
            )
            .populate(
                "admin",
                "fullName email profileImage"
            )
            .populate({
                path: "lastMessage",
                select: "text messageType fileUrl fileName sender receiver isRead createdAt",
            })
            .sort({ updatedAt: -1});

        return res.status(200).json({
            success: true,
            groups,
        });


    } catch (error) {

        console.error( "GET GROUPS ERROR:",error );
        return res.status(500).json({
            success: false,
            message: "Failed to load groups",
        });

    }

};


module.exports = {  createGroup,  getGroups};