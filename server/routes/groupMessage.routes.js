const express = require("express");

const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const { sendGroupMessage, getGroupMessages, updateGroupMessage, deleteGroupMessage, markGroupMessagesAsRead, uploadGroupMessageFile } = require("../controllers/groupMessage.controller");

router.post("/upload", authMiddleware, upload.array("files", 20), uploadGroupMessageFile);
router.post("/", authMiddleware, sendGroupMessage);
router.get("/:groupId", authMiddleware, getGroupMessages);
router.put("/read/:groupId", authMiddleware, markGroupMessagesAsRead);
router.put("/:messageId", authMiddleware, updateGroupMessage);
router.delete("/:messageId", authMiddleware, deleteGroupMessage);

module.exports = router;