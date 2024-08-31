import React, { useState, useEffect } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import localStorageService from "../utils/localStorage";
import { useNavigate, useParams } from "react-router-dom";
import { JWD_SECRET } from "../config/environment";
import { jwtDecode } from "jwt-decode";
import { Grid, Paper, Typography, TextField, Button, Box } from "@mui/material";
import CustomTextField from "../components/customTextField";
import SendIcon from "@mui/icons-material/Send";

const ChatPage = () => {
  const displayHeight = window.innerHeight - window.innerHeight * 0.1;

  const [ws, setWs] = useState(null);
  const [encryptionKey, setEncryptionKey] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [token, setToken] = useState(null);
  const { recipient, name } = useParams(); // Directly get recipient from useParams
  const [recipientId, setRecipientId] = useState("");
  const [userId, setUserId] = useState("");
  const [senderName, setSenderName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    console.log(recipient);
    setRecipientId(recipient);
    const storedToken = localStorageService.getItem("token");
    const userName = localStorageService.getItem("userName");
    setToken(storedToken);
    const user = jwtDecode(storedToken);
    console.log(user);
    setUserId(user?.userId);
    setSenderName(userName);

    const socket = new WebSocket("ws://192.168.1.187:8000");
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
            console.log(message.data.recipient);
            console.log(recipientId);

            // Decrypt message using the stored encryption key
            const decryptedMessage = CryptoJS.AES.decrypt(
              message?.data?.text,
              "encryptionKey"
            ).toString(CryptoJS.enc.Utf8);

            if (message.data.sender === recipientId) {
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
          recipient: recipientId,
          sender: userId,
          senderName,
          groupId: null,
          type: "user",
        },
        token,
      };

      ws.send(JSON.stringify(message));

      setMessages((prevMessages) => [
        ...prevMessages,
        { ...message.data, text: input },
      ]);

      setInput("");
    }
  };

  // return (
  //   <div style={{ padding: 20 }}>
  //     <div
  //       style={{
  //         border: "1px solid #ccc",
  //         padding: 10,
  //         height: 300,
  //         overflowY: "scroll",
  //         marginBottom: 10,
  //       }}
  //     >
  //       {messages.map((msg, index) => (
  //         <div key={index}>{msg.text}</div>
  //       ))}
  //     </div>
  //     <input
  //       type="text"
  //       value={input}
  //       onChange={(e) => setInput(e.target.value)}
  //       placeholder="Type a message..."
  //       style={{ width: "80%", padding: 8 }}
  //     />
  //     <button onClick={sendMessage} style={{ padding: 8 }}>
  //       Send
  //     </button>
  //   </div>
  // );
  return (
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
            >
              {messages.map((msg, index) => (
                <Grid
                  item
                  container
                  justifyContent={
                    userId === msg?.sender ? "flex-end" : "flex-start"
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
                      background: "rgba(46,51,61,255)",
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
                      {msg?.senderName}
                    </Typography>
                    {msg?.text}
                  </Grid>
                </Grid>
              ))}
            </Grid>

            <Grid container xl={12}>
              <Grid xl={11} md={10}>
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
                    background: "#454c5c",
                    marginTop: "0.5rem",
                    color: "lightgrey",
                  }}
                  endIcon={<SendIcon />}
                  onClick={sendMessage}
                ></Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ChatPage;

// [
//   {
//     text: "aefaef",
//     recipient: "66cf6a15dceafc75c4e01a09",
//     sender: "66d234bbc80866e5e789ddd9",
//     senderName: "Malithi",
//     groupId: null,
//     type: "user",
//   }
// ];
