import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";
import { logIn } from "../firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const firebaseLoginErrorMessages = {
    "auth/invalid-email": "The email address is not valid.",
    "auth/user-not-found": "No user found with this email address.",
    "auth/wrong-password": "The password entered is incorrect.",
    "auth/invalid-credential":
      "The credentials provided are invalid. Please check and try again.",
  };
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await logIn(email, password);
      setError("");
      navigate("/");
    } catch (err) {
      const userFriendlyMessage =
        firebaseLoginErrorMessages[err.code] ||
        "An unexpected error occurred. Please try again.";
      setError(userFriendlyMessage);
    }
  };

  return (
    <Container maxWidth="sm">
      {error && <Alert severity="error">{error}</Alert>}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="80vh"
      >
        <Typography variant="h4" gutterBottom>
          Login to OTrace
        </Typography>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account?
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ mt: 1 }}
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
