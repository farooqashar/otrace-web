import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Navigate } from "react-router-dom";
import { validateEmail } from "../utils/util";

const ConsentOffer = ({ role }) => {
  const [formData, setFormData] = useState({
    dataController: "",
    userEmail: "",
    data: "",
    operationsPermitted: "",
    expiration: "",
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [emailError, setEmailError] = useState("");

  if (role !== "data provider" && role !== "data recipient")
    return <Navigate to="/login" />;

  const handleChange = (e) => {
    if (e.target.name === "userEmail") {
      // Email Validation
      if (!validateEmail(e.target.value)) {
        setEmailError("Invalid email format");
        return;
      }
      setEmailError("");
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "consent"), {
      ...formData,
      status: "offered",
      timestamp: serverTimestamp(),
    });

    await addDoc(collection(db, "attestations"), {
      action: {
        type: "Consent Offer",
        information: { ...formData, status: "offered" },
      },
      party: { email: formData.userEmail },
      timestamp: serverTimestamp(),
    });
    setSnackbarMessage(
      "Consent has been offered and an attestation record has been successfully created!"
    );
    setOpenSnackbar(true);
  };

  return (
    <Container>
      <Typography variant="h5">Offering Consent</Typography>
      <Typography variant="h7">
        Fill out the following form to request consent from the consumer
        regarding their data.
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Data Controller"
          name="dataController"
          onChange={handleChange}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="User Email"
          name="userEmail"
          onChange={handleChange}
          required
          margin="normal"
          error={!!emailError}
          helperText={emailError}
        />
        <TextField
          fullWidth
          label="Data"
          name="data"
          onChange={handleChange}
          required
          margin="normal"
        />
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel shrink>Operations Permitted</InputLabel>
          <Select
            name="operationsPermitted"
            value={formData.operationsPermitted}
            onChange={handleChange}
            required
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select an option
            </MenuItem>
            <MenuItem value="read-only">Read Only</MenuItem>
            <MenuItem value="write-only">Write Only</MenuItem>
            <MenuItem value="read-write">Read and Write</MenuItem>
            <MenuItem value="transform">Transform</MenuItem>
            <MenuItem value="aggregate">Aggregate</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Expiration Time"
          name="expiration"
          type="datetime-local"
          InputLabelProps={{ shrink: true }}
          onChange={handleChange}
          required
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
      {/* Snackbar Confirmation of Success */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ConsentOffer;
