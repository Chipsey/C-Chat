const express = require("express");
const messageController = require("../controllers/message-controller");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.post("/", messageController.createMessage);
router.get("/", messageController.getAllMessages);
router.get("/history", messageController.getChatHistory);
router.get("/:id", messageController.getMessageById);
router.get("/last-message", messageController.getLastMessage);
router.put("/:id", messageController.updateMessage);
router.delete("/:id", messageController.deleteMessage);

module.exports = router;
