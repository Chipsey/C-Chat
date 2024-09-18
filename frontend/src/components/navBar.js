import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

const NavBar = ({ buttons, userName }) => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ bgcolor: "rgba(32,0,41,0)", color: "rgba(18, 24, 40, 255)" }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 0.5 }} p={4}>
          <Typography
            variant="h4"
            align="left"
            sx={{ flexGrow: 1, fontSize: "1rem" }}
          >
            {userName && `Hello again, ${userName}`}
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 0.5 }} p={4}>
          <Typography
            variant="h1"
            align="left"
            sx={{ flexGrow: 1, fontSize: "1.5rem" }}
          >
            LinkSpeak
          </Typography>
        </Box>
        {buttons.map((btn, index) => (
          <Button
            key={index}
            color="inherit"
            onClick={btn.onClick}
            sx={{
              ml: 1,
              bgcolor: btn?.active ? "rgba(213, 229, 242,255)" : "inherit",
            }}
          >
            {btn.label}
          </Button>
        ))}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
