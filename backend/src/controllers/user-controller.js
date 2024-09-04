const userService = require("../services/user-service");
const logger = require("../utils/logger");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log({ name, email, password });
    const auth = await userService.registerUser({ name, email, password });
    res.status(201).json({ auth });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log({ email, password });
    const auth = await userService.loginUser({ email, password });
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

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  addGroup,
};

// const User = require("../models/User");
// const crudService = require("../services/crud-service");

// // Get all Users
// const getAllUsers = async (req, res) => {
//   try {
//     const users = await crudService.readAll(User);
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Create a new User
// const createUser = async (req, res) => {
//   try {
//     const user = await crudService.create(User, req.body);
//     res.status(201).json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get User by ID
// const getUserById = async (req, res) => {
//   try {
//     const user = await crudService.readById(User, req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Update User by ID
// const updateUserById = async (req, res) => {
//   try {
//     const user = await crudService.updateById(User, req.params.id, req.body);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Delete User by ID
// const deleteUserById = async (req, res) => {
//   try {
//     const user = await crudService.deleteById(User, req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json({ message: "User deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = {
//   createUser,
//   getAllUsers,
//   getUserById,
//   updateUserById,
//   deleteUserById,
// };
