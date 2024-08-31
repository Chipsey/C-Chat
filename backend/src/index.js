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

app.use("/users", userRoutes);

const userSockets = {}; // Object to store user WebSocket connections

wss.on("connection", (ws) => {
  console.log("Client connected");

  // Add the new connection to the collection
  const { ObjectId } = mongoose.Types;

  ws.on("message", async (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      console.log(
        `parsedMessage -------------------------------------------------------------- ${JSON.stringify(parsedMessage)}`
      );
      const { type, data, token } = parsedMessage;

      // Verify and decode the JWT token
      const user = jwt.verify(token, process.env.JWT_SECRET);
      console.log(user?.userId);

      if (user) {
        userSockets[user?.userId] = ws;
        console.log(`User ${user?.userId} connected`);
      }

      // Handle message type
      switch (type) {
        case "MESSAGE": {
          if (data.recipient) {
            // Convert recipientId to ObjectId
            data.recipient = new ObjectId(data.recipient); // Correct usage
          }
          console.log(
            `Data -------------------------------------------------------------- ${data.text}`
          );

          await Message.create({
            sender: user.id,
            text: data.text,
            recipient: data.recipient,
            group: data.groupId || null,
            type: data.recipient ? "user" : "group",
          });

          // Send to the recipient if available
          if (userSockets[data.recipient]) {
            userSockets[data.recipient].send(
              JSON.stringify({
                type: "MESSAGE",
                data: { ...data, text: data.text },
              })
            );
          }
          ws.send(
            JSON.stringify({
              type: "MESSAGE",
              data: { ...data, text: data.text },
            })
          );
          break;
        }
      }
    } catch (error) {
      ws.send(
        JSON.stringify({
          type: "ERROR",
          error: error,
        })
      );
      console.error("Error processing message:", error);
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

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  logger(
    `Server running on port-------------------------------------- ${PORT}`
  );
});
