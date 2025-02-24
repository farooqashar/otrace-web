import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Navigate } from "react-router-dom";

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

  if (role !== "data provider" && role !== "data recipient")
    return <Navigate to="/login" />;

  const handleChange = (e) => {
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
        />
        <TextField
          fullWidth
          label="Data"
          name="data"
          onChange={handleChange}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Operations Permitted"
          name="operationsPermitted"
          onChange={handleChange}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Expiration Time"
          name="expiration"
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
