import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import localStorageService from "../utils/localStorage";
import CustomTextField from "../components/customTextField";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, setLogin] = useState(false);
  const { user, loading, error } = useSelector((state) => state.auth);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    let token = localStorageService.getItem("token");
    if (token) {
      navigate("/");
    }
    setLogin(false);
  }, [login, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(credentials));
    setLogin(true);
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          p: 3,
          borderRadius: 5,
          boxShadow: 3,
          bgcolor: "background.paper",
          width: "100%",
          maxWidth: 400,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box mb={3}>
            <CustomTextField
              label="email"
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required={true}
            />
            <CustomTextField
              label="password"
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required={true}
            />
          </Box>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;
