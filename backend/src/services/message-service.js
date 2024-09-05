const mongoose = require("mongoose");
const Message = require("../models/Message");

// Create a new message
exports.createMessage = async (messageData) => {
  const message = new Message(messageData);
  return await message.save();
};

// Get all messages (with optional filtering and pagination)
// Get all messages (with optional filtering and pagination)
exports.getAllMessages = async ({ sender, recipient, group, limit, page }) => {
  const query = {};

  if (sender) query.sender = sender;
  if (recipient) query.recipient = recipient;
  if (group) query.group = group;

  const messages = await Message.find(query)
    .populate("sender recipient group")
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const count = await Message.countDocuments(query);

  await Message.updateMany(
    { _id: { $in: messages.map((msg) => msg._id) }, seen: false },
    { $set: { seen: true } }
  );

  return { messages, totalMessages: count };
};

// Chat History
exports.getChatHistory = async (sender, recipient, page = 1, limit = 20) => {
  try {
    // Check if sender and recipient are valid ObjectId strings
    const senderId = mongoose.Types.ObjectId.isValid(sender)
      ? new mongoose.Types.ObjectId(sender)
      : null;
    const recipientId = mongoose.Types.ObjectId.isValid(recipient)
      ? new mongoose.Types.ObjectId(recipient)
      : null;

    if (!senderId || !recipientId) {
      throw new Error("Invalid sender or recipient ID");
    }

    const query = {
      $or: [
        { sender: senderId, recipient: recipientId },
        { sender: recipientId, recipient: senderId },
      ],
    };

    const messages = await Message.find(query)
      .sort({ createdAt: 1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate("sender", "-password")
      .populate("recipient", "-password");

    console.log("Messages:", messages);
    return messages;
  } catch (error) {
    console.error("Error fetching chat history:", error.message);
    throw new Error("Error fetching chat history");
  }
};

// Get a message by ID
exports.getMessageById = async (id) => {
  return await Message.findById(id).populate("sender recipient group");
};

// Get the last message for a specific recipient (or group)
exports.getLastMessageByRecipient = async ({ recipient, group }) => {
  const query = {};

  if (recipient) query.recipient = recipient;
  if (group) query.group = group;

  return await Message.findOne(query)
    .populate("sender recipient group")
    .sort({ createdAt: -1 }); // Sort by creation date, descending to get the latest message
};

// Update a message by ID
exports.updateMessage = async (id, messageData) => {
  return await Message.findByIdAndUpdate(id, messageData, { new: true });
};

// Delete a message by ID
exports.deleteMessage = async (id) => {
  return await Message.findByIdAndDelete(id);
};
