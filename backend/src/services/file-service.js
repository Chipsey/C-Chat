const path = require("path");

const saveProfilePicture = (file) => {
  const profilePictureUrl = `/uploads/profile_pictures/${file.filename}`;
  return profilePictureUrl;
};

module.exports = {
  saveProfilePicture,
};
