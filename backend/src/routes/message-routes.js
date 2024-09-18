const express = require("express");
const messageController = require("../controllers/message-controller");
const authMiddleware = require("../middlewares/auth");
const validateRequest = require("../middlewares/validate-request-service");
const { createMessage } = require("../validation/message-validation");

const router = express.Router();

router.post(
  "/",
  validateRequest(createMessage),
  authMiddleware,
  messageController.createMessage
);
router.get("/", authMiddleware, messageController.getAllMessages);
router.post("/create", authMiddleware, messageController.createMessage);
router.get("/history", authMiddleware, messageController.getChatHistory);
router.get("/:id", authMiddleware, messageController.getMessageById);
router.get("/last-message", authMiddleware, messageController.getLastMessage);
router.put("/:id", authMiddleware, messageController.updateMessage);
router.put(
  "/mark-seen/:senderId/:recipientId",
  authMiddleware,
  messageController.seenMessage
);
router.delete("/:id", authMiddleware, messageController.deleteMessage);

module.exports = router;
