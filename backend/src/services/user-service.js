// services/userService.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crudService = require("./crud-service");
const logger = require("../utils/logger");
const Group = require("../models/Group");

const saltRounds = 10;

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await crudService.create(User, {
    name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "100h",
  });

  response = {
    token: token,
    userName: user.name,
    userEmail: user.email,
  };

  return response;
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  response = {
    token: token,
    userName: user.name,
    userEmail: user.email,
  };

  return response;
};

const addGroup = async ({ name, members }) => {
  const group = new Group({ name, members });
  const resp = await crudService.create(Group, group);
  return resp;
};

const getAllUsers = async (queryParams) => {
  const searchFields = ["name", "email"];
  return await crudService.readAll(User, { ...queryParams, searchFields });
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  addGroup,
};
