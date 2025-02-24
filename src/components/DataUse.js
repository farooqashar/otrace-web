import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Navigate } from "react-router-dom";

const DataUse = ({ role }) => {
  const [formData, setFormData] = useState({
    dataController: "",
    data: "",
    userEmail: "",
    operation: "",
    basis: "",
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
    await addDoc(collection(db, "attestations"), {
      action: {
        type: "Data Usage",
        information: { ...formData },
      },
      party: { email: formData.userEmail },
      timestamp: serverTimestamp(),
    });
    setSnackbarMessage(
      "Attestation record of data usage has been successfully created!"
    );
    setOpenSnackbar(true);
  };

  return (
    <Container>
      <Typography variant="h5">Using Consumer Data</Typography>
      <Typography variant="h7">
        Fill out the following form to record a usage of consumer's data.
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
          label="Data"
          name="data"
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
          label="Operation"
          name="operation"
          onChange={handleChange}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Basis"
          name="basis"
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

export default DataUse;
