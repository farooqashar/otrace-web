import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Navigate } from "react-router-dom";

const ConsentOffer = ({ role }) => {
  const [formData, setFormData] = useState({
    operator: "",
    userEmail: "",
    data: "",
    operationsPermitted: "",
    expiration: "",
  });

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
    alert("Consent offered successfully!");
  };

  return (
    <Container>
      <Typography variant="h5">Consent Offer Form</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Operator"
          name="operator"
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
          label="Expiry Timestamp"
          name="expiration"
          onChange={handleChange}
          required
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default ConsentOffer;
