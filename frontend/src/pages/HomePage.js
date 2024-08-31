import React, { useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import CryptoJS from "crypto-js";
import localStorageService from "../utils/localStorage";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
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

  return <div style={{ padding: 20 }}>Home</div>;
};

export default HomePage;
