const Joi = require("joi");

const registerSchema = Joi.object({
  first_name: Joi.string().min(3).max(30).required(),
  last_name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  profilePicture: Joi.string(),
  github_username: Joi.string(),
  birthday: Joi.date(),
  password: Joi.string().min(6).required(),
});

const updateUserSchema = Joi.object({
  first_name: Joi.string().min(3).max(30),
  last_name: Joi.string().min(3).max(30),
  profilePicture: Joi.string(),
  github_username: Joi.string(),
  birthday: Joi.date(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateUserSchema,
};
