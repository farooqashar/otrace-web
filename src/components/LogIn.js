import React, { useState } from "react";
import { Container, Typography, TextField, Button } from "@mui/material";
import { logIn } from "../firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await logIn(email, password);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Typography variant="h5">Login</Typography>
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
      <Button variant="contained" onClick={handleLogin}>
        Login
      </Button>
    </Container>
  );
};

export default Login;
