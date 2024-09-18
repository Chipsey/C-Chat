// services/userService.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crudService = require("./crud-service");
const logger = require("../utils/logger");
const Group = require("../models/Group");

const saltRounds = 10;

const registerUser = async ({ payload }) => {
  // logger(JSON.stringify(payload));
  const existingUser = await User.findOne({ email: payload?.email });
  // logger(existingUser);
  if (existingUser) {
    throw new Error("User already exists");
  }
  const hashedPassword = await bcrypt.hash(payload?.password, saltRounds);
  const user = await crudService.create(User, {
    ...payload,
    password: hashedPassword,
  });
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "240h",
  });
  response = {
    token: token,
    payload: user,
  };
  return response;
};

const loginUser = async ({ email, password }) => {
  // logger(email);
  const user = await User.findOne({ email });
  // logger("user");
  // logger(user);

  if (!user) {
    throw new Error("Invalid credentials-1");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials-2");
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "240h",
  });

  response = {
    token: token,
    user: user.toObject(),
  };

  delete response?.user?.password;

  return response;
};

const addGroup = async ({ name, members }) => {
  const group = new Group({ name, members });
  const resp = await crudService.create(Group, group);
  return resp;
};

const getAllUsers = async (queryParams) => {
  const searchFields = ["first_name", "last_name", "github_username", "email"];
  const projection = { password: 0 };
  return await crudService.readAll(User, {
    ...queryParams,
    searchFields,
    projection,
  });
};

const updateProfilePicture = async (userId, profilePicture) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture },
      { new: true }
    );
    return user;
  } catch (error) {
    throw new Error(`Error updating profile picture: ${error.message}`);
  }
};

const updateProfile = async ({ userId, payload }) => {
  try {
    console.log(userId, JSON.stringify(payload));

    const user = await User.findByIdAndUpdate(
      userId,
      { ...payload },
      { new: true }
    );
    return user;
  } catch (error) {
    throw new Error(`Error updating profile picture: ${error.message}`);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  addGroup,
  updateProfilePicture,
  updateProfile,
};
