import React from "react";
import { Avatar, Box, Grid, IconButton, Typography } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import { LOCAL_FILE_URL } from "../config/apiEndpoints";

const Profile = ({
  profilePictureSaved,
  isEdit = false,
  profilePicture,
  userName,
  onProfilePictureChange,
  handleProfilePictureSave,
  currentProfilePicture,
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "70vh",
        p: 5,
        borderRadius: 7,
        boxShadow: 4,
        gap: 2,
      }}
    >
      <Typography variant="h2" sx={{ fontSize: "1.5rem" }}>
        User Profile
      </Typography>
      <Grid container xl={12} mt={3}>
        <Grid
          xl={6}
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
          mb={-0.5}
        >
          <Avatar
            sx={{
              backgroundColor: "white",
              width: 200,
              height: 200,
              color: "black",
              fontSize: "5rem",
            }}
            src={profilePicture ?? `${LOCAL_FILE_URL}/${currentProfilePicture}`}
          ></Avatar>
        </Grid>
        {isEdit && profilePictureSaved && (
          <Grid
            xl={12}
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
            }}
          >
            <IconButton
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                color: "white",
                width: "1.5rem",
                height: "1.5rem",
              }}
              onClick={() => document.getElementById("upload-input").click()}
            >
              <EditIcon sx={{ width: "1rem", height: "1rem" }} />
            </IconButton>
            <input
              id="upload-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={onProfilePictureChange}
            />
          </Grid>
        )}
        {isEdit && !profilePictureSaved && (
          <Grid
            xl={12}
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
            }}
            gap={1}
          >
            <IconButton
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                color: "white",
                width: "1.5rem",
                height: "1.5rem",
              }}
              onClick={() => document.getElementById("upload-input").click()}
            >
              <EditIcon sx={{ width: "1rem", height: "1rem" }} />
            </IconButton>
            <input
              id="upload-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={onProfilePictureChange}
            />
            <IconButton
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                color: "white",
                width: "1.5rem",
                height: "1.5rem",
              }}
              onClick={handleProfilePictureSave}
            >
              <CheckIcon sx={{ width: "1rem", height: "1rem" }} />
            </IconButton>
          </Grid>
        )}
        <Grid xl={12} mt={2}>
          <Typography
            variant="h2"
            sx={{
              fontSize: "2rem",
            }}
          >
            {userName}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
