const express = require("express");
const router = express.Router();

const { createGroup, getGroups } = require("../controllers/group.controller");
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.post("/", authMiddleware, upload.single("groupImage"), createGroup);
router.get( "/",  authMiddleware,  getGroups);

module.exports = router;