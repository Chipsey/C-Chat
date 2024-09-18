const mongoose = require("mongoose");
const Message = require("../models/Message");
const logger = require("../utils/logger");
const { readById } = require("./crud-service");
const User = require("../models/User");

// Create a new message
exports.createMessage = async (messageData) => {
  const message = new Message(messageData);
  logger("createMessage" + JSON.stringify(message));
  return await message.save();
};

exports.getAllMessages = async ({ sender, recipient, group, limit, page }) => {
  const senderId = mongoose.Types.ObjectId.isValid(sender)
    ? new mongoose.Types.ObjectId(sender)
    : null;
  const recipientId = mongoose.Types.ObjectId.isValid(recipient)
    ? new mongoose.Types.ObjectId(recipient)
    : null;

  const query = {
    $or: [
      { sender: senderId, recipient: recipientId },
      { sender: recipientId, recipient: senderId },
    ],
  };

  // Fetch messages with sorting by 'createdAt'
  const messages = await Message.find(query)
    .populate({ path: "sender", select: "-password" }) // Exclude password from sender
    .populate({ path: "recipient", select: "-password" }) // Exclude password from recipient
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 }); // Sort in descending order of creation time

  const count = await Message.countDocuments(query);

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
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate("sender", "-password")
      .populate("recipient", "-password");

    // console.log("Messages:", messages);
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

// Get the last message between a sender and recipient (or group)
exports.getLastMessageByRecipient = async ({ recipient, sender, group }) => {
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

  // If a group is provided, modify the query to handle group messages
  if (group) query.group = group;

  return await Message.findOne(query)
    .populate("sender recipient group")
    .sort({ createdAt: -1 }); // Sort by creation date, descending to get the latest message
};

// Update a message by ID
exports.updateMessage = async (id, messageData) => {
  return await Message.findByIdAndUpdate(id, messageData, { new: true });
};

exports.seenMessage = async (senderId, recipientId) => {
  try {
    // Correct instantiation using 'new'
    const senderObjectId = new mongoose.Types.ObjectId(senderId);
    const recipientObjectId = new mongoose.Types.ObjectId(recipientId);

    // Find all messages with matching sender and recipient
    const messages = await Message.find({
      sender: senderObjectId,
      recipient: recipientObjectId,
    });

    if (messages.length === 0) {
      return { success: false, message: "No messages found." };
    }

    // Mark messages as seen by the recipient
    const seenUpdatePromises = messages.map(async (message) => {
      const alreadySeen = message.seen_by.some(
        (seen) => seen.user_id.toString() === recipientId
      );

      if (!alreadySeen) {
        message.seen_by.push({
          user_id: recipientObjectId,
          date: new Date(),
        });
        await message.save();
      }
    });

    await Promise.all(seenUpdatePromises);

    return { success: true, message: "Messages marked as seen." };
  } catch (error) {
    console.error(error);
    throw new Error("Error marking messages as seen");
  }
};

// Delete a message by ID
exports.deleteMessage = async (id) => {
  return await Message.findByIdAndDelete(id);
};
