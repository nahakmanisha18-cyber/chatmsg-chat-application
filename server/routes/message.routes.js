const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const { sendMessage, getMessages, markMessagesAsRead, updateMessage, deleteMessage, uploadMessageFile } = require("../controllers/message.Controller");

router.post("/", authMiddleware, sendMessage);
router.get("/:userId", authMiddleware, getMessages);
router.put("/read/:userId", authMiddleware, markMessagesAsRead);
router.put("/:messageId", authMiddleware, updateMessage);
router.delete( "/:messageId",  authMiddleware,  deleteMessage);
router.post( "/upload",   authMiddleware, upload.array("files", 20), uploadMessageFile);

module.exports = router;