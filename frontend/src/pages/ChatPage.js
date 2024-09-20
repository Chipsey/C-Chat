import React, { useState, useEffect, useRef } from "react";
import CryptoJS from "crypto-js";
import localStorageService from "../utils/localStorage";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  Grid,
  Typography,
  Button,
  Box,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import CustomTextField from "../components/customTextField";
import SendIcon from "@mui/icons-material/Send";
import { LOCAL_SERVER_URL, LOCAL_WS_SERVER_URL } from "../config/apiEndpoints";
import { createItem, fetchItems, setSeenMessages } from "../api/api";

import CheckIcon from "@mui/icons-material/Check";
import DoneAllIcon from "@mui/icons-material/DoneAll";

const ChatPage = () => {
  const displayHeight = window.innerHeight - window.innerHeight * 0.1;

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

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
  const [isVideoCall, setIsVideoCall] = useState(true);
  const limit = 30;

  let iceCandidateQueue = [];
  let isRemoteDescriptionSet = false;

  const navigate = useNavigate();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  function generateEncryptionKey(str1, str2) {
    console.log(str1, str2);

    const combinedStr = str1 + str2;
    const charArray = combinedStr.split("");
    const sortedArray = charArray.sort();
    const sortedStr = sortedArray.join("");
    console.log(sortedStr);
    return `${sortedStr}^$*#&&$!`;
  }

  useEffect(() => {
    // console.log(recipient);
    setRecipientId(recipient);
    setRecipientName(name);
    const storedToken = localStorageService.getItem("token");
    const userName = localStorageService.getItem("userName");
    setToken(storedToken);
    const user = jwtDecode(storedToken);
    // console.log(user);
    setUserId(user?.userId);
    setSenderName(userName);
    var dynamicKey = generateEncryptionKey(
      userId.toString(),
      recipientId.toString()
    );
    console.log(dynamicKey);

    setEncryptionKey(dynamicKey);

    const socket = new WebSocket(LOCAL_WS_SERVER_URL);
    setWs(socket);

    socket.onopen = () => {
      const connectionMessage = {
        type: "CONNECTION",
        data: {
          recipient: { _id: recipientId, name: recipientName },
          sender: { _id: userId, name: senderName },
          groupId: null,
          type: "user",
          updatedAt: new Date(),
        },
        token: storedToken,
      };

      socket.send(JSON.stringify(connectionMessage));
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
            console.log(message);
            // Decrypt message using the stored encryption key
            const decryptedMessage = CryptoJS.AES.decrypt(
              message?.data?.text,
              encryptionKey
            ).toString(CryptoJS.enc.Utf8);

            // if (message.data.sender._id === recipientId) {
            setMessages((prevMessages) => [
              { ...message.data, text: decryptedMessage },
              ...prevMessages,
            ]);
            // }
            break;
          }
          case "SEEN": {
            console.log(message);

            setMessages((prevMessages) =>
              prevMessages.map((msg) => {
                if (
                  !msg.seen_by.some(
                    (seen) => seen.user_id === message?.sender?._id
                  )
                ) {
                  return {
                    ...msg,
                    seen_by: [
                      ...msg.seen_by,
                      { user_id: message?.sender?._id, date: new Date() },
                    ],
                  };
                }
                return msg;
              })
            );
            break;
          }
        }
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
      // console.log(messages);
    };

    return () => {
      socket.close();
    };
  }, [token, encryptionKey]);

  useEffect(() => {
    const seenMessages = async () => {
      try {
        const response = await setSeenMessages(
          `${LOCAL_SERVER_URL}/messages/mark-seen/${recipientId}/${userId}`
        );
        console.log(response);
      } catch (error) {
        console.error("Error seen messages history:", error);
      }
    };
    seenMessages();
  }, [recipientId, userId]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!encryptionKey) return; // Wait until the encryption key is available
      try {
        const response = await fetchItems(
          `${LOCAL_SERVER_URL}/messages/history?limit=${limit}&page=${page}&sender=${userId}&recipient=${recipientId}`
        );

        if (response && Array.isArray(response)) {
          const decryptedMessages = response.map((message) => {
            try {
              const decryptedText = CryptoJS.AES.decrypt(
                message.text,
                encryptionKey
              ).toString(CryptoJS.enc.Utf8);
              return { ...message, text: decryptedText };
            } catch (error) {
              console.error("Failed to decrypt message:", error);
              return message; // Return the message unaltered if decryption fails
            }
          });

          // Update the state with the new decrypted messages
          setMessages(decryptedMessages);
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();
  }, [page, encryptionKey]); // Add encryptionKey as a dependency

  function handleLogOut() {
    localStorageService.clear();
    navigate("/login");
  }

  const sendMessage = async () => {
    if (input) {
      const encryptedText = CryptoJS.AES.encrypt(
        input,
        encryptionKey
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
          updatedAt: new Date(),
          createdAt: new Date(),
        },
        token,
      };

      // Check if WebSocket is connected
      if (ws && ws.readyState === WebSocket.OPEN) {
        // Send message via WebSocket
        ws.send(JSON.stringify(message));

        // Update messages immediately in the UI
        // setMessages((prevMessages) => [
        //   { ...message.data, text: input, seen_by: [] },
        //   ...prevMessages,
        // ]);
      } else {
        // WebSocket is not connected, send the message via API
        try {
          const response = await createItem(
            `${LOCAL_SERVER_URL}/messages/create`,
            message
          );

          setMessages((prevMessages) => [
            { ...response.data, text: input },
            ...prevMessages,
          ]);
        } catch (error) {
          console.error("Failed to send message via API:", error);
        }
      }

      // Clear the input field
      setInput("");
    }
  };

  // useEffect(() => {
  //   const initializeChat = async () => {
  //     if (ws && ws.readyState === WebSocket.OPEN) {
  //       try {
  //         const message = {
  //           type: "SEEN",
  //           data: {
  //             recipient: { _id: recipientId, name: recipientName },
  //             sender: { _id: userId, name: senderName },
  //             groupId: null,
  //             type: "user",
  //             updatedAt: new Date(),
  //           },
  //           token: token,
  //         };
  //         ws.send(JSON.stringify(message));
  //       } catch (error) {
  //         console.error("Error initializing chat:", error);
  //       }
  //     }
  //   };

  //   initializeChat();
  // }, [ws, WebSocket]);

  const startLocalStream = async () => {
    try {
      // Request access to video and audio
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Assign the stream to the local video element
      localVideoRef.current.srcObject = stream;
      return stream;
    } catch (err) {
      console.error("Error accessing media devices.", err);
      return null; // Ensure we handle the error case properly
    }
  };

  // ICE configuration for STUN/TURN servers
  const iceConfiguration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      {
        urls: "turn:your-turn-server-url",
        username: "your-username",
        credential: "your-credential",
      },
    ],
  };

  // Create the RTCPeerConnection instance
  const peerConnection = new RTCPeerConnection(iceConfiguration);

  // Start the local media stream and add tracks to the peer connection
  const startCall = async () => {
    const localStream = await startLocalStream();

    if (localStream) {
      // Add the local stream tracks (audio, video) to the peer connection
      localStream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, localStream));

      try {
        // Create the SDP offer and set it as the local description
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        // Send the offer to the remote peer via WebSocket
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "OFFER", data: { offer }, token }));
        }
      } catch (error) {
        console.error("Error creating or sending the offer", error);
      }
    }
  };

  // Handle the incoming call offer from the remote peer
  const handleIncomingCall = async (offer) => {
    try {
      console.log("Incoming call:", offer);

      // Set the remote description (offer from remote peer)
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      isRemoteDescriptionSet = true;

      // Add buffered ICE candidates
      iceCandidateQueue.forEach(async (candidate) => {
        try {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.error("Error adding buffered ICE candidate:", error);
        }
      });

      iceCandidateQueue = []; // Clear the queue

      // Create an answer to the offer
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      // Send the answer back to the remote peer via WebSocket
      ws.send(JSON.stringify({ type: "ANSWER", data: { answer }, token }));
    } catch (error) {
      console.error("Error handling the incoming call", error);
    }
  };

  // Handle ICE candidates from remote peer
  const handleIceCandidate = async (candidate) => {
    try {
      if (!isRemoteDescriptionSet) {
        // Buffer the candidate until the remote description is set
        iceCandidateQueue.push(candidate);
        console.log("Buffered ICE candidate:", candidate);
      } else {
        // Add the ICE candidate directly
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("Successfully added ICE candidate");
      }
    } catch (error) {
      console.error("Error adding received ICE candidate", error);
    }
  };

  // Listen for ICE candidates and send them to the remote peer
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      ws.send(
        JSON.stringify({
          type: "ICE_CANDIDATE",
          data: { candidate: event.candidate },
          token,
        })
      );
    }
  };

  // Listen for incoming media streams from the remote peer and display it in the video element
  peerConnection.ontrack = (event) => {
    console.log("Remote track received:", event.track);
    if (event.track.kind === "video") {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        console.log("Assigned video stream to video element.");
        testVideoDisplay();
      } else {
        console.error("Remote video element is not available.");
      }
    }
  };

  const testVideoDisplay = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = stream;
      console.log("Test video stream assigned.");
    }
  };

  // WebSocket message handler for receiving signaling data
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.onmessage = async (message) => {
      const data = JSON.parse(message.data);

      switch (data.type) {
        case "OFFER":
          await handleIncomingCall(data.data.offer);
          break;

        case "ANSWER":
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(data.data.answer)
          );
          break;

        case "ICE_CANDIDATE":
          await handleIceCandidate(data.data.candidate);
          break;

        default:
          console.error("Unknown message type:", data.type);
      }
    };
  }

  // End the call and clean up resources
  const endCall = () => {
    peerConnection
      .getSenders()
      .forEach((sender) => peerConnection.removeTrack(sender));
    peerConnection.close();

    // Reset video elements if needed
    localVideoRef.current.srcObject = null;
    remoteVideoRef.current.srcObject = null;
  };

  return isVideoCall ? (
    <div>
      <video ref={remoteVideoRef} autoPlay playsInline></video>
      <div>
        <video ref={localVideoRef} autoPlay playsInline></video>
      </div>
      <Button onClick={startCall}>Start Call</Button>
      <Button onClick={endCall}>End Call</Button>
    </div>
  ) : loading ? (
    <div className="align-middle">
      <CircularProgress sx={{ color: "rgba(107,138,253,255)" }} />
    </div>
  ) : (
    <Grid container xs={12}>
      <Grid container xs={0} sm={0} md={1} lg={2} xl={2} p={5}>
        {/* <Profile userName={name}></Profile> */}
      </Grid>
      <Grid container xs={12} sm={12} md={10} lg={8} xl={8}>
        <Box
          sx={{
            width: "100%",
            height: displayHeight,
            p: 5,
            borderRadius: 7,
            bgcolor: "rgba(32,0,41,0)",
            gap: 2,
          }}
        >
          <Grid container xs={12}>
            <Grid xs={12} mb={2} sx={{ fontSize: "1rem" }}>
              {name}
              {/* <br />
              <span
                className="font-smaller fw-100 opacity-50"
                style={{ fontSize: "0.7rem" }}
              >
                {recipientId}
              </span> */}
            </Grid>

            <Grid
              container
              item
              display={"block"}
              xs={12}
              sx={{
                height: displayHeight - window.innerHeight * 0.14,
                overflowY: "auto",
                position: "relative",
              }}
              p={2}
            >
              {messages
                .slice()
                .reverse()
                .map((msg, index) => (
                  <Grid
                    item
                    container
                    justifyContent={
                      userId === msg?.sender?._id ? "flex-end" : "flex-start"
                    }
                    xs={12}
                    key={index}
                    mb={3}
                  >
                    <Grid
                      item
                      xs={5.5}
                      className="fade-slide-up"
                      sx={{
                        background:
                          userId === msg?.sender?._id
                            ? "rgba(213,229,242,255)"
                            : "rgba(255,255,255,255)",
                        fontSize: "1rem",
                        borderRadius:
                          userId === msg?.sender?._id
                            ? "1rem 1rem 0rem 1rem"
                            : "1rem 1rem 1rem 0rem",
                      }}
                      p={2}
                    >
                      <Typography
                        mb={1}
                        sx={{
                          fontSize: "0.55rem",
                        }}
                      >
                        {msg?.sender?.name ??
                          `${msg?.sender?.first_name} ${msg?.sender?.last_name}`}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.8rem",
                        }}
                      >
                        {msg?.text}
                      </Typography>
                      <Grid container justifyContent="flex-end">
                        {userId === msg?.sender?._id &&
                          (msg?.seen_by.length > 0 ? (
                            <Grid
                              display={"flex"}
                              alignItems={"center"}
                              gap={1}
                            >
                              <Tooltip
                                title={new Date(
                                  msg?.seen_by[0]?.date
                                ).toLocaleString("en-US", {
                                  timeZone: "Asia/Colombo",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                                placement="left"
                                arrow
                                leaveDelay={2000}
                              >
                                <DoneAllIcon sx={{ width: "1rem" }} />
                              </Tooltip>
                            </Grid>
                          ) : (
                            <CheckIcon sx={{ width: "1rem" }} />
                          ))}
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      justifyContent={
                        userId === msg?.sender?._id ? "flex-end" : "flex-start"
                      }
                    >
                      <Typography
                        mt={0.5}
                        sx={{
                          fontSize: "0.5rem",
                          opacity: "0.6",
                          textAlign: "right",
                        }}
                      >
                        {new Date(msg?.createdAt).toLocaleString("en-US", {
                          timeZone: "Asia/Colombo",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    </Grid>
                  </Grid>
                ))}
              <div ref={messagesEndRef} />
            </Grid>

            <Grid container xs={12}>
              <Grid item xs={11}>
                <CustomTextField
                  label=""
                  type="text"
                  name="Message"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  required={true}
                  onSubmit={sendMessage}
                  sx={{ mb: 2 }}
                  multiline={true}
                />
              </Grid>
              <Grid
                item
                xs={1}
                container
                justifyContent="center"
                alignItems="center"
              >
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    height: "3rem",
                    marginTop: "0.5rem",
                    color: "white",
                    borderRadius: "0rem 0.5rem 0.5rem 0rem",
                  }}
                  className="background-color-primary"
                  onClick={sendMessage}
                >
                  <SendIcon />
                </Button>
              </Grid>
            </Grid>

            <Grid container justifyContent="center" xs={12} mb={2} mt={1}>
              <Typography
                textAlign="center"
                fontSize="0.6rem"
                sx={{ opacity: 0.5 }}
              >
                - END TO END ENCRYPTED -
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ChatPage;
