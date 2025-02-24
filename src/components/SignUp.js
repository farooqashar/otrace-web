import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Button,
  Box,
  Alert,
  Snackbar,
} from "@mui/material";
import { signUp } from "../firebase/auth";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const navigate = useNavigate();

  const firebaseSignUpErrorMessages = {
    "auth/weak-password": "Your password must be at least 6 characters long.",
    "auth/email-already-in-use":
      "This email is already registered. Please use a different one.",
    "auth/invalid-email":
      "The email address is not valid. Please check the format.",
    "auth/missing-email": "Please provide an email address.",
    "auth/operation-not-allowed":
      "The sign-up operation is not allowed. Please try again later.",
    "auth/invalid-credential":
      "The credentials provided are invalid. Please check and try again.",
    "auth/missing-phone-number": "Please provide a valid phone number.",
  };

  const handleSignup = async () => {
    setError("");
    setSuccessMessage("");
    try {
      await signUp(email, password, role);
      setSuccessMessage("Account created successfully!");
      setOpenSnackbar(true);
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      const userFriendlyMessage =
        firebaseSignUpErrorMessages[err.code] ||
        "An unexpected error occurred. Please try again.";
      setError(userFriendlyMessage);
    }
  };

  return (
    <Container maxWidth="sm">
      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      )}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="80vh"
        sx={{ textAlign: "center" }}
      >
        <Typography variant="h4" gutterBottom>
          Create an Account
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
        <TextField
          select
          label="Select Role"
          fullWidth
          margin="normal"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <MenuItem value="consumer">Consumer</MenuItem>
          <MenuItem value="data provider">Data Provider</MenuItem>
          <MenuItem value="data recipient">Data Recipient</MenuItem>
        </TextField>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSignup}
        >
          Sign Up
        </Button>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account?
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ mt: 1 }}
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
      </Box>
      {/* Snackbar for success and error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={successMessage ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {successMessage || error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SignUp;
