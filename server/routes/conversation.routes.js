const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { getConversations} = require("../controllers/conversation.Controller");

router.get( "/", authMiddleware, getConversations);

module.exports = router;