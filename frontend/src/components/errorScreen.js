import React from "react";
import { Container, Typography, Button } from "@mui/material";

const handleReload = () => {
  window.location.reload();
};

const ErrorScreen = ({ error }) => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        padding: { xs: 0, sm: 0, md: 0 },
        marginTop: { xs: 4, sm: 4, md: 4 },
      }}
    >
      <Typography
        sx={{
          fontSize: {
            xs: "0.875rem",
            sm: "1rem",
            md: "1.125rem",
          },
        }}
        className="color-white z2"
      >
        Failed to fetch items: {error}
      </Typography>
      <Button
        variant="contained"
        color="error"
        onClick={handleReload}
        sx={{ marginTop: 2 }}
      >
        Retry
      </Button>
    </Container>
  );
};

export default ErrorScreen;
