import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { fetchItems } from "../api/api";
import CryptoJS from "crypto-js";
import localStorageService from "../utils/localStorage";
import { Link, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  CircularProgress,
  Grid,
  Icon,
  Typography,
} from "@mui/material";
import CustomTextField from "../components/customTextField";
import { LOCAL_SERVER_URL } from "../config/apiEndpoints";
import NavBar from "../components/navBar";

const HomePage = () => {
  const displayHeight = window.innerHeight - window.innerHeight * 0.1;

  const [ws, setWs] = useState(null);
  const [encryptionKey, setEncryptionKey] = useState(null);
  const [messages, setMessages] = useState([]);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [lastMessages, setLastMessages] = useState({});
  const [page, setPage] = useState(1);
  const [sender, setSender] = useState("");
  const [userName, setUserName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const limit = 10;

  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearch(searchInput);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  useEffect(() => {
    const fetchUsers = async () => {
      const storedToken = await localStorageService.getItem("token");
      const name = await localStorageService.getItem("userName");
      const profilePicture =
        await localStorageService.getItem("profilePicture");
      setProfilePicture(profilePicture);
      setUserName(name);
      setToken(storedToken);
      const user = jwtDecode(storedToken);
      setSender(user?.userId);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const userList = await fetchItems(
          `${LOCAL_SERVER_URL}/users?limit=${limit}&page=${page}&search=${search}`
        );
        setUsers(userList);
        console.log(userList);
        // fetchLastMessages(userList.items);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [search, page]);

  // const fetchLastMessages = async (userList) => {
  //   const newLastMessages = {};
  //   for (const user of userList) {
  //     try {
  //       const response = await axios.get(
  //         `${LOCAL_SERVER_URL}/messages/last-message?recipient=${user?._id}&sender=${sender}`
  //       );
  //       newLastMessages[user?._id] = response?.data;
  //     } catch (error) {
  //       console.error(
  //         `Error fetching last message for user ${user?._id}:`,
  //         error
  //       );
  //     }
  //   }
  //   setLastMessages(newLastMessages);
  // };

  function handleLogOut() {
    localStorageService.clear();
    navigate("/login");
  }

  const buttons = [
    { label: "Chat", onClick: () => console.log("Home clicked"), active: true },
    { label: "Group", onClick: () => console.log("Profile clicked") },
    { label: "", onClick: () => {} },
    { label: "Logout", onClick: () => handleLogOut() },
  ];

  return loading ? (
    <div className="align-middle">
      <CircularProgress sx={{ color: "rgba(107,138,253,255)" }} />
    </div>
  ) : (
    <Grid container xl={12} md={12}>
      <Grid container xl={12}>
        <NavBar buttons={buttons} />
      </Grid>
      <Grid xl={1} md={2}></Grid>
      <Grid xl={6} md={8}>
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
          <Grid xl={12} md={12} mb={5}>
            <CustomTextField
              label="Search"
              type="text"
              name="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              required={false}
            />
          </Grid>
          <Box
            sx={{
              maxHeight: displayHeight - displayHeight * 0.1,
              overflowY: "auto",
            }}
          >
            {users?.items.map(
              (user, index) =>
                user?._id != sender && (
                  <Link
                    to={`/chat/${user?._id}/${user?.name}`}
                    key={index}
                    style={{
                      textDecoration: "none",
                      display: "block",
                      color: "black",
                    }}
                  >
                    <Grid
                      container
                      xl={12}
                      p={3}
                      borderRadius={4}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(213, 229, 242, 255)",
                          cursor: "pointer",
                        },
                        transition: "background-color 300ms ease",
                      }}
                    >
                      <Grid xl={1} mr={5}>
                        <Avatar
                          sx={{
                            backgroundColor: "white",
                            borderRadius: "0.5rem",
                          }}
                          className="color-primary fw-600"
                        >
                          {user?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                      </Grid>
                      <Grid xl={9}>
                        <Typography sx={{ textAlign: "left" }}>
                          {user?.name}
                        </Typography>
                        <Typography
                          sx={{
                            textAlign: "left",
                            fontSize: "0.7rem",
                            opacity: "0.7",
                          }}
                        >
                          {user?.email}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Link>
                )
            )}
          </Box>
        </Box>
      </Grid>
      <Grid container xl={5} p={7}>
        <Box
          sx={{
            width: "100%",
            p: 2,
            borderRadius: 7,
            gap: 2,
          }}
        >
          <Grid container xl={12}>
            <Grid
              xl={12}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              mb={1}
            >
              <Avatar
                sx={{
                  backgroundColor: "white",
                  width: 200,
                  height: 200,
                  color: "black",
                  fontSize: "5rem",
                }}
                src={profilePicture}
              ></Avatar>
            </Grid>
            <Grid xl={12}>
              <Typography
                variant="h1"
                sx={{ textAlign: "center", fontSize: "1.5rem" }}
              >
                {userName}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default HomePage;
