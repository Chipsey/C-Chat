import React from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingScreen;
