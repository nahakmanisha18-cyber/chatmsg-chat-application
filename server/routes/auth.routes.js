const express = require("express");


const { registerValidator, loginValidator, validateRequest} = require("../middleware/validator.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const {  registerUser,  loginUser,   getMe, logout } = require("../controllers/auth.Controller");
const router = express.Router();

router.post( "/register",  registerValidator, validateRequest, registerUser);
router.post( "/login",  loginValidator,  validateRequest, loginUser);
router.get("/me", authMiddleware, getMe);
router.post("/logout", authMiddleware, logout);

module.exports = router;