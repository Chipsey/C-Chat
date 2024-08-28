import React, { useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import CryptoJS from "crypto-js";

const App = () => {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [token, setToken] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000");
    setWs(socket);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const decryptedMessage = CryptoJS.AES.decrypt(
        message.data.text,
        "ENCRYPTION_KEY"
      ).toString(CryptoJS.enc.Utf8);
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...message.data, text: decryptedMessage },
      ]);
    };

    return () => {
      socket.close();
    };
  }, [token]);

  const handleLogin = async () => {
    // Perform login and store token
    const response = await axios.post("http://localhost:8000/login", {
      email: "chipsey@gmail.com",
      password: "123456",
    });
    console.log(response.data);

    setToken(response.data.auth.token);
  };

  const sendMessage = () => {
    if (ws && input) {
      const encryptedText = CryptoJS.AES.encrypt(
        input,
        "ENCRYPTION_KEY"
      ).toString();
      ws.send(
        JSON.stringify({
          type: "MESSAGE",
          data: {
            text: encryptedText,
            recipientId: "recipient_user_id",
            groupId: null,
          },
          token,
        })
      );
      setInput("");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>WebSocket Chat</h1>
      <button onClick={handleLogin}>Login</button>
      <div
        style={{
          border: "1px solid #ccc",
          padding: 10,
          height: 300,
          overflowY: "scroll",
          marginBottom: 10,
        }}
      >
        {messages.map((msg, index) => (
          <div key={index}>{msg.text}</div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        style={{ width: "80%", padding: 8 }}
      />
      <button onClick={sendMessage} style={{ padding: 8 }}>
        Send
      </button>
    </div>
  );
};

export default App;
