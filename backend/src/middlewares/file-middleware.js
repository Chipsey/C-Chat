const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Define the path for profile uploads
const uploadDirectory = path.join(__dirname, "../uploads");

// Ensure the upload directory exists
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Define storage for the profile pictures
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory); // Use the absolute path for the destination
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname); // Get the file extension
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension); // Add extension to the file name
  },
});

const upload = multer({
  storage: storage,
  // limits: { fileSize: 1000000 }, // Limit the file size to 1MB
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Error: Images Only!"));
    }
  },
});

module.exports = upload;
