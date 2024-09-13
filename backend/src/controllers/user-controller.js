const userService = require("../services/user-service");
const logger = require("../utils/logger");

const registerUser = async (req, res) => {
  function capitalizeEachWord(sentence) {
    return sentence
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
      .join(" ");
  }
  try {
    const { name, email, password } = req.body;
    logger({ name, email, password });
    const lowerCasedEmail = email.toLowerCase();
    const capitalizedName = capitalizeEachWord(name);
    const auth = await userService.registerUser({
      name: capitalizedName,
      email: lowerCasedEmail,
      password,
    });
    res.status(201).json({ auth });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const lowerCasedEmail = email.toLowerCase();
    const auth = await userService.loginUser({
      email: lowerCasedEmail,
      password,
    });
    res.status(200).json({ auth });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { limit = 10, page = 1, search = "" } = req.query;
    const users = await userService.getAllUsers({ limit, page, search });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addGroup = async (req, res) => {
  try {
    const { name, members } = req.body;
    const group = await userService.addGroup({ name, members });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateUserProfilePicture = async (req, res) => {
  try {
    const { userId } = req.params;
    const { profilePicture } = req.body;

    // Call the service function to update the profile picture
    const user = await userService.updateProfilePicture(userId, profilePicture);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  addGroup,
  updateUserProfilePicture,
};
