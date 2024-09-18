const Joi = require("joi");

// Define the validation schema for the message
const createMessage = Joi.object({
  sender: Joi.string().hex().length(24).required().messages({
    "string.base": "Sender must be a string",
    "string.length": "Sender ID must be a valid ObjectId",
    "any.required": "Sender is required",
  }),
  recipient: Joi.string().hex().length(24).allow(null).messages({
    "string.length": "Recipient ID must be a valid ObjectId",
  }),
  group: Joi.string().hex().length(24).allow(null).messages({
    "string.length": "Group ID must be a valid ObjectId",
  }),
  text: Joi.string().required().messages({
    "string.base": "Text must be a string",
    "any.required": "Text is required",
  }),
  type: Joi.string().valid("user", "group").required().messages({
    "any.only": "Type must be either 'user' or 'group'",
    "any.required": "Type is required",
  }),
});

module.exports = {
  createMessage,
};
