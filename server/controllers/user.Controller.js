const User = require("../model/user.model");

const getUsers = async (req, res) => {
    try {
        const users = await User.find(
            { _id: { $ne: req.userId } },
            { password: 0,  }
        ).sort({ fullName: 1 });

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            users,
        });

    } catch (error) {
        console.error("GET USERS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
        });
    }
};

module.exports = { getUsers};