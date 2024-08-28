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

// User Login with validation
router.post("/login", validateRequest(loginSchema), userController.loginUser);

// User get all
router.get("/", userController.getAllUsers);

router.post("/group", authMiddleware, userController.addGroup);

module.exports = router;

// // routes/userRoutes.js
// const express = require("express");
// const userController = require("../controllers/user-controller");

// const router = express.Router();

// // CRUD Routes
// router.post("/", userController.createUser); // Create
// router.get("/", userController.getAllUsers); // Read All
// router.get("/:id", userController.getUserById); // Read by ID
// router.put("/:id", userController.updateUserById); // Update by ID
// router.delete("/:id", userController.deleteUserById); // Delete by ID

// // Hash password before saving the user
// UserSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// module.exports = router;
