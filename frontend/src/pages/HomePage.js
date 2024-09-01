import React, { useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import CryptoJS from "crypto-js";
import localStorageService from "../utils/localStorage";
import { useNavigate } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import CustomTextField from "../components/customTextField";

const HomePage = () => {
  const displayHeight = window.innerHeight - window.innerHeight * 0.1;

  const [ws, setWs] = useState(null);
  const [encryptionKey, setEncryptionKey] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [token, setToken] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorageService.getItem("token");
    setToken(storedToken);
    const socket = new WebSocket("ws://localhost:8000");
    setWs(socket);

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log(message?.type);

        switch (message?.type) {
          case "ERROR": {
            switch (message?.error?.name) {
              case "TokenExpiredError": {
                console.log("Logout");
                handleLogOut();
                break;
              }
              default:
                console.log("Unhandled error:", message?.error?.name);
            }
            break;
          }
          case "MESSAGE": {
            // Decrypt message using the stored encryption key
            const decryptedMessage = CryptoJS.AES.decrypt(
              message?.data?.text,
              "encryptionKey"
            ).toString(CryptoJS.enc.Utf8);

            setMessages((prevMessages) => [
              ...prevMessages,
              { ...message.data, text: decryptedMessage },
            ]);
            console.log(messages);
            break;
          }
        }
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    };

    return () => {
      socket.close();
    };
  }, [token]);

  function handleLogOut() {
    localStorageService.clear();
    navigate("/login");
  }

  return (
    <Grid container xl={12} md={12} spacing={1} mt={1}>
      <Grid xl={0.5} md={0.5}></Grid>
      <Grid xl={3} md={3}>
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
          <Grid xl={8} md={8}>
            <CustomTextField
              label="Search"
              type="text"
              name="Message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              required={false}
            />
          </Grid>
        </Box>
      </Grid>
      <Grid xl={6} md={6}>
        <Box
          sx={{
            width: "100%",
            height: displayHeight,
            p: 5,
            borderRadius: 7,
            // bgcolor: "rgba(32,35,41,255)",
            bgcolor: "rgba(0,35,41,255)",
            gap: 2,
          }}
        ></Box>
      </Grid>
    </Grid>
  );
};

export default HomePage;
