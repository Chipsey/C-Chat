const multer = require("multer");
const path = require("path");

// Define storage for the profile pictures
const storage = multer.diskStorage({
  destination: "../uploads/profile",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File upload and filter configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit the file size to 1MB
  fileFilter: (req, file, cb) => {
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
