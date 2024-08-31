import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, register } from "../features/auth/authSlice";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import localStorageService from "../utils/localStorage";
import CustomTextField from "../components/customTextField";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, setLogin] = useState(false);
  const { user, loading, error } = useSelector((state) => state.auth);

  const [credentials, setCredentials] = useState({
    name: "",
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
    dispatch(register(credentials));
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
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box mb={3}>
            <CustomTextField
              label="User Name"
              type="text"
              name="name"
              value={credentials.name}
              onChange={handleChange}
              required={true}
            />
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
            color="success"
            fullWidth
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
          <Link
            to="/login"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography
              align="center"
              mt={1}
              sx={{ fontSize: "0.7rem", color: "green" }}
            >
              Already a member?
            </Typography>
          </Link>
        </form>
      </Box>
    </Container>
  );
};

export default RegisterPage;
