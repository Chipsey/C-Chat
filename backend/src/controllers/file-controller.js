const fileService = require("../services/file-service");

const uploadProfilePicture = (req, res) => {
  try {
    console.log(req.file);
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const profilePictureUrl = fileService.saveProfilePicture(req.file);

    return res.status(200).json({ fileName: profilePictureUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({ message: "Failed to upload file" });
  }
};

module.exports = {
  uploadProfilePicture,
};
