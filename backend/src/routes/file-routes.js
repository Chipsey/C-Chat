const express = require("express");
const router = express.Router();
const fileController = require("../controllers/file-controller");
const fileMiddleware = require("../middlewares/file-middleware");

// Define the route for uploading the profile picture
router.post(
  "/upload",
  fileMiddleware.single("file"),
  fileController.uploadProfilePicture
);

module.exports = router;
