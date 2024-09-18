const express = require("express");
const http = require("http");
const connectDB = require("./config/mongodb-connection"); // MongoDB connection setup
const WebSocket = require("ws"); // WebSocket for real-time communication
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const logger = require("./utils/logger"); // Custom logger utility
const userRoutes = require("./routes/user-routes"); // User-related routes
const messageRoutes = require("./routes/message-routes"); // Message-related routes
const fileRoutes = require("./routes/file-routes"); // File upload/download routes
const messageService = require("./services/message-service"); // Message service logic

const app = express(); // Express app initialization
const server = http.createServer(app); // HTTP server
const wss = new WebSocket.Server({ server }); // WebSocket server
const path = require("path");

// Middleware Setup
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Allow Cross-Origin requests

// MongoDB Connection Setup
connectDB(); // Initialize MongoDB connection

// Route Definitions
app.use("/users", userRoutes); // User-related routes
app.use("/messages", messageRoutes); // Message-related routes
app.use("/files", fileRoutes); // File-related routes
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error stack
  res.status(500).json({ message: "Internal Server Error" }); // Respond with a 500 status
});

// Store user WebSocket connections by userId
const userSockets = {};

// WebSocket connection handler
wss.on("connection", (ws) => {
  console.log("Client connected");

  const { ObjectId } = mongoose.Types; // For handling MongoDB ObjectId

  // WebSocket message handler
  ws.on("message", async (message) => {
    try {
      const parsedMessage = JSON.parse(message); // Parse the incoming message
      console.log(`Parsed Message: ${JSON.stringify(parsedMessage)}`);

      const { type, data, token } = parsedMessage; // Destructure the message

      // Verify JWT token
      const user = jwt.verify(token, process.env.JWT_SECRET);
      console.log(user?.userId);

      if (user) {
        // Store the WebSocket connection for the user
        userSockets[user?.userId] = ws;
        console.log(`User ${user?.userId} connected`);
      }

      // Handle different WebSocket message types
      switch (type) {
        case "MESSAGE": {
          // Convert recipient ID to ObjectId if present
          if (data.recipient._id) {
            data.recipient._id = new ObjectId(data.recipient._id);
          }

          console.log(`Received Message: ${data}`);

          // Create message data for saving
          let messageData = {
            sender: data.sender._id,
            text: data.text,
            recipient: data.recipient._id,
            group: data.groupId || null,
            type: data.recipient._id ? "user" : "group", // Determine message type
          };

          // Save message to the database
          await messageService.createMessage(messageData);

          // Send the message to the recipient if they're connected
          if (userSockets[data.recipient._id]) {
            userSockets[data.recipient._id].send(
              JSON.stringify({
                type: "MESSAGE",
                data: {
                  ...data,
                  text: data.text,
                },
              })
            );
            messageService.seenMessage(data.sender._id, data.recipient._id);
            // Echo the message back to the sender
            ws.send(
              JSON.stringify({
                type: "MESSAGE",
                data: {
                  ...data,
                  text: data.text,
                  seen_by: [{ user_id: data.recipient._id, date: new Date() }],
                },
              })
            );
          } else {
            ws.send(
              JSON.stringify({
                type: "MESSAGE",
                data: {
                  ...data,
                  text: data.text,
                  seen_by: [],
                },
              })
            );
          }

          break;
        }
        case "CONNECTION": {
          console.log(
            `Received Seen Message------------------: ${JSON.stringify(data)}`
          );

          if (userSockets[data.recipient._id]) {
            userSockets[data.recipient._id].send(
              JSON.stringify({
                type: "SEEN",
                data,
              })
            );
          }
          break;
        }
      }
    } catch (error) {
      // Send error response over WebSocket
      ws.send(
        JSON.stringify({
          type: "ERROR",
          error: error.message || error,
        })
      );
      console.error("Error processing message:", error);
    }
  });

  // WebSocket error handler
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  // WebSocket disconnection handler
  ws.on("close", () => {
    console.log("Client disconnected");
    // Remove the disconnected WebSocket from userSockets
    Object.keys(userSockets).forEach((key) => {
      if (userSockets[key] === ws) {
        delete userSockets[key];
      }
    });
  });
});

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  logger(
    `Server running on ---------------------------------------------------------------------------------------------------------------------------------------------------- port ${PORT}`
  );
});
