import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { signUp } from "../firebase/auth";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSignup = async () => {
    try {
      await signUp(email, password, role);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Typography variant="h5">Signup</Typography>
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
        label="Role"
        fullWidth
        margin="normal"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <MenuItem value="consumer">Consumer</MenuItem>
        <MenuItem value="data provider">Data Provider</MenuItem>
        <MenuItem value="data recipient">Data Recipient</MenuItem>
      </TextField>
      <Button variant="contained" onClick={handleSignup}>
        Signup
      </Button>
    </Container>
  );
};

export default SignUp;
