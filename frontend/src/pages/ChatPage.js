import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import localStorageService from "../utils/localStorage";
import { useNavigate, useParams } from "react-router-dom";
import { JWD_SECRET } from "../config/environment";
import { jwtDecode } from "jwt-decode";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import CustomTextField from "../components/customTextField";
import SendIcon from "@mui/icons-material/Send";
import { LOCAL_SERVER_URL, LOCAL_WS_SERVER_URL } from "../config/apiEndpoints";
import { fetchItems } from "../api/api";

const ChatPage = () => {
  const displayHeight = window.innerHeight - window.innerHeight * 0.1;

  const [ws, setWs] = useState(null);
  const [encryptionKey, setEncryptionKey] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [token, setToken] = useState(null);
  const { recipient, name } = useParams(); // Directly get recipient from useParams
  const [recipientId, setRecipientId] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [userId, setUserId] = useState("");
  const [senderName, setSenderName] = useState("");
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [fetch, setFetch] = useState(false);
  const limit = 10;

  const navigate = useNavigate();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    console.log(recipient);
    setRecipientId(recipient);
    setRecipientName(name);
    const storedToken = localStorageService.getItem("token");
    const userName = localStorageService.getItem("userName");
    setToken(storedToken);
    const user = jwtDecode(storedToken);
    console.log(user);
    setUserId(user?.userId);
    setSenderName(userName);

    setFetch(true);

    const socket = new WebSocket(LOCAL_WS_SERVER_URL);
    setWs(socket);

    socket.onopen = () => {
      const connectionMessage = {
        type: "CONNECTION",
        data: null,
        token: storedToken,
      };

      socket.send(JSON.stringify(connectionMessage)); // Send the connection message once the socket is open
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        switch (message?.type) {
          case "ERROR": {
            switch (message?.error?.name) {
              case "TokenExpiredError": {
                handleLogOut();
                break;
              }
              default:
                console.log("Unhandled error:", message?.error?.name);
            }
            break;
          }
          case "MESSAGE": {
            console.log(message.data);
            console.log(recipientId);

            // Decrypt message using the stored encryption key
            const decryptedMessage = CryptoJS.AES.decrypt(
              message?.data?.text,
              "encryptionKey"
            ).toString(CryptoJS.enc.Utf8);

            if (message.data.sender._id === recipientId) {
              setMessages((prevMessages) => [
                ...prevMessages,
                { ...message.data, text: decryptedMessage },
              ]);
            }
            break;
          }
        }
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
      console.log(messages);
    };

    return () => {
      socket.close();
    };
  }, [token]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetchItems(
          `${LOCAL_SERVER_URL}/messages/history?limit=${limit}&page=${page}&sender=${userId}&recipient=${recipientId}`
        );

        if (response && Array.isArray(response)) {
          // Decrypt all messages in the response
          const decryptedMessages = response.map((message) => {
            const decryptedText = CryptoJS.AES.decrypt(
              message.text,
              "encryptionKey"
            ).toString(CryptoJS.enc.Utf8);
            return { ...message, text: decryptedText };
          });

          // Update the state with the new decrypted messages
          setMessages(decryptedMessages);
        }

        console.log(messages);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();
  }, [page, fetch]);

  function handleLogOut() {
    localStorageService.clear();
    navigate("/login");
  }

  const sendMessage = () => {
    if (ws && input) {
      const encryptionKey = localStorageService.getItem("userEmail");
      const encryptedText = CryptoJS.AES.encrypt(
        input,
        "encryptionKey"
      ).toString();

      const message = {
        type: "MESSAGE",
        data: {
          text: encryptedText,
          recipient: {
            _id: recipientId,
            name: recipientName,
          },
          sender: {
            _id: userId,
            name: senderName,
          },
          senderName,
          groupId: null,
          type: "user",
        },
        token,
      };

      console.log(message);

      ws.send(JSON.stringify(message));

      setMessages((prevMessages) => [
        ...prevMessages,
        { ...message.data, text: input },
      ]);

      setInput("");
    }
  };

  return loading ? (
    <div className="align-middle">
      <CircularProgress sx={{ color: "rgba(107,138,253,255)" }} />
    </div>
  ) : (
    <Grid container xl={12} md={12} spacing={1} mt={1}>
      <Grid xl={3} md={3}></Grid>
      <Grid container xl={6} md={6}>
        <Box
          sx={{
            width: "100%",
            height: displayHeight,
            p: 5,
            borderRadius: 7,
            bgcolor: "rgba(32,35,41,255)",
            gap: 2,
          }}
        >
          <Grid container xl={12}>
            <Grid xl={12} mb={4} sx={{ fontWeight: "bold" }}>
              {name}
              <br />
              <span
                className="font-smaller fw-100 opacity-50"
                style={{ fontSize: "0.7rem" }}
              >
                {recipientId}
              </span>
            </Grid>

            <Grid
              container
              item
              display={"block"}
              xl={12}
              sx={{
                height: displayHeight - window.innerHeight * 0.14,
                overflowY: "auto",
                position: "relative",
              }}
              p={2}
            >
              {messages.map((msg, index) => (
                <Grid
                  item
                  container
                  justifyContent={
                    userId === msg?.sender?._id ? "flex-end" : "flex-start"
                  }
                  xl={12}
                  key={index}
                  mb={1}
                >
                  <Grid
                    item
                    xl={5.5}
                    md={5.5}
                    className="fade-slide-up"
                    sx={{
                      background:
                        userId === msg?.sender?._id
                          ? "rgba(107,138,253,255)"
                          : "rgba(46,51,61,255)",
                      fontSize: "1rem",
                    }}
                    p={2}
                    borderRadius={3}
                  >
                    <Typography
                      mb={1}
                      sx={{
                        fontSize: "0.6rem",
                      }}
                    >
                      {msg?.sender?.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "1rem",
                      }}
                    >
                      {msg?.text}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.5rem",
                        opacity: "0.6",
                        textAlign: "right",
                      }}
                    >
                      {new Date(msg?.updatedAt).toLocaleString("en-US", {
                        timeZone: "Asia/Colombo",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </Typography>
                  </Grid>
                </Grid>
              ))}
              <div ref={messagesEndRef} />
            </Grid>

            <Grid container xl={12}>
              <Grid xl={11} md={10} sm={10}>
                <CustomTextField
                  label="You Message..."
                  type="text"
                  name="Message"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  required={false}
                />
              </Grid>
              <Grid xl={1} alignContent={"center"}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    height: "3rem",
                    background: "rgba(107,138,253,255)",
                    marginTop: "0.5rem",
                    color: "lightgrey",
                    borderRadius: "0rem 0.5rem 0.5rem 0rem",
                  }}
                  onClick={sendMessage}
                >
                  <SendIcon />
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ChatPage;
