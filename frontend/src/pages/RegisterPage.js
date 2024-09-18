import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../features/auth/authSlice";
import {
  Container,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Avatar,
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
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirm: "",
    birthday: "",
    github_username: "",
    profilePicture: "",
  });

  const [passwordError, setPasswordError] = useState(null);

  const [githubData, setGithubData] = useState(null);
  const [githubError, setGithubError] = useState(null);

  useEffect(() => {
    let token = localStorageService.getItem("token");
    if (token) {
      navigate("/");
    }
    setLogin(false);
  }, [login, user, navigate]);

  const handleChange = (e) => {
    setPasswordError(null);
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  useEffect(() => {
    if (credentials.github_username.trim()) {
      fetchGitHubData(credentials.github_username);
    }
  }, [credentials.github_username]);

  const fetchGitHubData = async (username) => {
    if (username.trim() === "") {
      setGithubData(null);
      setGithubError(null);
      return;
    }
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) {
        throw new Error("GitHub user not found");
      }
      const data = await response.json();
      setGithubData(data);
      setCredentials((prev) => ({
        ...prev,
        profilePicture: data?.avatar_url,
      }));
      setGithubError(null);
    } catch (error) {
      setCredentials((prev) => ({
        ...prev,
        profilePicture:
          "https://facts.net/wp-content/uploads/2023/10/20-intriguing-facts-about-stuart-minion-1697513491.jpg",
      }));
      setGithubError(error.message);
      setGithubData(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if passwords match
    if (credentials.password !== credentials.password_confirm) {
      setPasswordError("Passwords do not match");
      return;
    }

    // Remove password_confirm before sending to the backend
    const { password_confirm, ...finalCredentials } = credentials;

    dispatch(register(finalCredentials));
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
          width: "100%",
          maxWidth: 400,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box mb={3}>
            <Grid container xs={12}>
              <Grid xs={6} pr={0.5}>
                <CustomTextField
                  label="First Name"
                  type="text"
                  name="first_name"
                  value={credentials.first_name}
                  onChange={handleChange}
                  required={true}
                />
              </Grid>
              <Grid xs={6} pl={0.5}>
                <CustomTextField
                  label="Last Name"
                  type="text"
                  name="last_name"
                  value={credentials.last_name}
                  onChange={handleChange}
                  required={true}
                />
              </Grid>
            </Grid>
            <CustomTextField
              label="Email"
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required={true}
            />
            <CustomTextField
              label="Password"
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required={true}
            />
            <CustomTextField
              label="Confirm Password"
              type="password"
              name="password_confirm"
              value={credentials.password_confirm}
              onChange={handleChange}
              required={true}
            />
            <CustomTextField
              label="Birthday"
              type="date"
              name="birthday"
              value={credentials.birthday}
              onChange={handleChange}
              required={true}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Grid container xs={12} display={"flex"} alignItems={"center"}>
              <Grid xs={2}>
                <Avatar src={githubData?.avatar_url || ""} />
              </Grid>
              <Grid xs={10}>
                <CustomTextField
                  label="Github Username"
                  type="text"
                  name="github_username"
                  value={credentials.github_username}
                  onChange={handleChange}
                  required={false}
                />
              </Grid>
            </Grid>

            {/* Display password error if passwords do not match */}
            {passwordError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {passwordError}
              </Alert>
            )}
          </Box>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </Box>
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
