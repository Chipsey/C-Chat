import React from "react";
import { Box } from "@mui/material";

const Background = ({ children, backgroundImage }) => {
  return (
    <Box
      sx={{
        height: "100vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: { xs: 2, sm: 3, md: 4 },
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "blur(15px)",
          opacity: 0.5,
          zIndex: -1,
        }}
      ></div>
      <div className="home_back_gradient fade-slide-up"></div>
      {children}
    </Box>
  );
};

export default Background;
