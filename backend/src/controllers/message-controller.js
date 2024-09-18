const messageService = require("../services/message-service");
const logger = require("../utils/logger");

// Create a new message
exports.createMessage = async (req, res) => {
  try {
    const message = await messageService.createMessage(req.body);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all messages (filter by user or group if provided)
exports.getAllMessages = async (req, res) => {
  try {
    const { sender, recipient, group, limit = 10, page = 1 } = req.query;
    const messages = await messageService.getAllMessages({
      sender,
      recipient,
      group,
      limit,
      page,
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch chat history
// Route
exports.getChatHistory = async (req, res) => {
  try {
    const { sender, recipient, page, limit } = req.query;
    if (sender && recipient) {
      const chatHistory = await messageService.getChatHistory(
        sender,
        recipient,
        page,
        limit
      );
      res.status(200).json(chatHistory);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching chat history" });
  }
};

// Get a message by ID
exports.getMessageById = async (req, res) => {
  try {
    const message = await messageService.getMessageById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a message by ID
exports.updateMessage = async (req, res) => {
  try {
    const message = await messageService.updateMessage(req.params.id, req.body);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.seenMessage = async (req, res) => {
  try {
    const { senderId, recipientId } = req.params;

    try {
      const result = await messageService.seenMessage(
        senderId,
        recipientId
      );

      if (!result.success) {
        return res.status(404).json({ message: result.message });
      }

      res.status(200).json({ message: result.message });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a message by ID
exports.deleteMessage = async (req, res) => {
  try {
    const message = await messageService.deleteMessage(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to get the last message for a specific recipient or group
exports.getLastMessage = async (req, res) => {
  try {
    const { recipient, sender, group } = req.query;

    if (!recipient && !group) {
      return res
        .status(400)
        .json({ message: "Recipient or group is required" });
    }

    const lastMessage = await messageService.getLastMessageByRecipient({
      recipient,
      sender,
      group,
    });

    if (!lastMessage) {
      return res.status(404).json({ message: "No messages found" });
    }

    res.status(200).json(lastMessage);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching the last message",
      error: error.message,
    });
  }
};
