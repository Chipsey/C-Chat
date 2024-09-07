const express = require("express");
const messageController = require("../controllers/message-controller");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.post("/", authMiddleware, messageController.createMessage);
router.get("/", authMiddleware, messageController.getAllMessages);
router.get("/history", authMiddleware, messageController.getChatHistory);
router.get("/:id", authMiddleware, messageController.getMessageById);
router.get("/last-message", authMiddleware, messageController.getLastMessage);
router.put("/:id", authMiddleware, messageController.updateMessage);
router.delete("/:id", authMiddleware, messageController.deleteMessage);

module.exports = router;
