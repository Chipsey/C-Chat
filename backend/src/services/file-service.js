const path = require("path");

const saveProfilePicture = (file) => {
  // const profilePictureUrl = `/uploads/${file.filename}`;
  const profilePictureUrl = file.filename;
  return profilePictureUrl;
};

module.exports = {
  saveProfilePicture,
};
