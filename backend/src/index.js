const express = require("express");
const http = require("http");
const connectDB = require("./config/mongodb-connection");
const WebSocket = require("ws");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const cors = require("cors");
const logger = require("./utils/logger");
const userRoutes = require("./routes/user-routes");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(cors());

// MongoDB setup
connectDB();

const User = require("./models/User");
const Message = require("./models/Message");
const Group = require("./models/Group");

app.use("/", userRoutes);

// Web Socket Setup

// WebSocket setup
wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", async (message) => {
    console.log(message);
    const parsedMessage = JSON.parse(message);
    const { type, data, token } = parsedMessage;

    // Authenticate WebSocket messages
    const user = jwt.verify(token, "SECRET_KEY");
    ws.userId = user.id; // Store user ID in the WebSocket object

    // Store connection
    if (!userSockets[user.id]) {
      userSockets[user.id] = ws;
    }

    switch (type) {
      case "MESSAGE":
        // Handle sending messages
        const { recipientId, groupId, text } = data;
        const encryptedText = crypto
          .createCipher("aes-256-cbc", "ENCRYPTION_KEY")
          .update(text, "utf8", "hex");

        let messageData = { sender: user.id, text: encryptedText };
        if (recipientId) {
          messageData.recipient = recipientId;
          // Save to database
          await Message.create({ ...messageData, type: "user" });
          // Send message to specific user
          if (userSockets[recipientId]) {
            userSockets[recipientId].send(
              JSON.stringify({ type: "MESSAGE", data: messageData })
            );
          }
        } else if (groupId) {
          messageData.group = groupId;
          // Save to database
          await Message.create({ ...messageData, type: "group" });
          // Broadcast to group members
          const group = await Group.findById(groupId);
          group.members.forEach((memberId) => {
            if (userSockets[memberId]) {
              userSockets[memberId].send(
                JSON.stringify({ type: "MESSAGE", data: messageData })
              );
            }
          });
        }
        break;

      // Handle other message types (e.g., JOIN_GROUP)
      default:
        console.log("Unknown message type:", type);
    }
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    // Remove connection from userSockets
    delete userSockets[ws.userId];
  });
});

// Start the Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  logger(
    `Server running on ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ port ${PORT}`
  );
});
