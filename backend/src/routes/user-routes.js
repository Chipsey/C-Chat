// routes/userRoutes.js
const express = require("express");
const userController = require("../controllers/user-controller");
const {
  registerSchema,
  loginSchema,
} = require("../validation/user-validation");
const validateRequest = require("../middlewares/validate-request-service");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// User Registration with validation
router.post(
  "/register",
  validateRequest(registerSchema),
  userController.registerUser
);
router.post("/login", validateRequest(loginSchema), userController.loginUser);
router.get("/", authMiddleware, userController.getAllUsers);
router.post("/group", authMiddleware, userController.addGroup);
router.put(
  "/:userId/profile-picture",
  authMiddleware,
  userController.updateUserProfilePicture
);

module.exports = router;
