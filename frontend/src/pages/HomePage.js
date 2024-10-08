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
  IconButton,
  Typography,
} from "@mui/material";
import CustomTextField from "../components/customTextField";
import { LOCAL_SERVER_URL } from "../config/apiEndpoints";
import NavBar from "../components/navBar";
import EditIcon from "@mui/icons-material/Edit";
import Profile from "../components/profile";
import { updateProfilePicture } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";

const HomePage = () => {
  const displayHeight = window.innerHeight - window.innerHeight * 0.1;
  const [ws, setWs] = useState(null);
  const [encryptionKey, setEncryptionKey] = useState(null);
  const [messages, setMessages] = useState([]);
  const [token, setToken] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [lastMessages, setLastMessages] = useState({});
  const [page, setPage] = useState(1);
  const [sender, setSender] = useState("");
  const [userName, setUserName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [currentProfilePicture, setCurrentProfilePicture] = useState(null);
  const [profilePictureSaved, setProfilePictureSaved] = useState(true);
  const limit = 10;

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      setCurrentProfilePicture(profilePicture);
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
        // console.log(userList);
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

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
        setProfilePictureSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePictureSave = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = dispatch(updateProfilePicture(formData));
      // console.log(JSON.stringify(response));
      setCurrentProfilePicture(response);
      // console.log(currentProfilePicture);

      localStorageService.setItem("profilePicture", response?.fileName);
      setProfilePictureSaved(true);
    } catch (error) {
      console.log(error);
    }
  };

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
    <Grid container xs={12}>
      <Grid container xs={12}>
        <NavBar buttons={buttons} userName={userName} />
      </Grid>
      <Grid xs={0} sm={0} md={1} lg={2} xl={2}></Grid>
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
          <Grid mb={2}>
            <Typography variant="h2" sx={{ fontSize: "2rem" }}>
              LinkSpeak Chat
            </Typography>
            <Typography
              variant="h2"
              sx={{ fontSize: "0.8rem", fontWeight: "300" }}
            >
              Upgrade Your Network with Link Speak Chat
            </Typography>
          </Grid>
          <Grid xs={12} mb={5}>
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
            {users?.data.map(
              (user, index) =>
                user?._id != sender && (
                  <Link
                    to={`/chat/${user?._id}/${user?.first_name} ${user?.last_name}`}
                    key={index}
                    style={{
                      textDecoration: "none",
                      display: "block",
                      color: "black",
                    }}
                  >
                    <Grid
                      container
                      xs={12}
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
                      <Grid xs={1} mr={5}>
                        <Avatar
                          sx={{
                            backgroundColor: "white",
                            borderRadius: "0.5rem",
                            padding: 1,
                          }}
                          className="color-primary fw-600"
                        >
                          {user?.first_name?.charAt(0).toUpperCase()}
                          {user?.last_name?.charAt(0).toUpperCase()}
                        </Avatar>
                      </Grid>
                      <Grid xs={9}>
                        <Typography sx={{ textAlign: "left" }}>
                          {user?.first_name} {user?.last_name}
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
      {/* <Grid container xs={6} pl={20} pr={10} pt={10}>
        <Profile
          isEdit="true"
          profilePictureSaved={profilePictureSaved}
          onProfilePictureChange={handleProfilePictureChange}
          userName={userName}
          profilePicture={profilePicture}
          handleProfilePictureSave={handleProfilePictureSave}
          currentProfilePicture={currentProfilePicture}
        />
      </Grid> */}
    </Grid>
  );
};

export default HomePage;
