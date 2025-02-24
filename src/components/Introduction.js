import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Navigate } from "react-router-dom";

const Introduction = ({ role }) => {

  const [formData, setFormData] = useState({ consumer: "", operator: "", service: "" });

  if (role !== "consumer") return <Navigate to="/login" />;


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "attestations"), {...formData, action: "Introduction", timestamp: serverTimestamp()});
    alert("Submitted successfully!");
  };

  return (
    <Container>
      <Typography variant="h5">Introduction Form</Typography>
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Consumer" name="consumer" onChange={handleChange} required margin="normal" />
        <TextField fullWidth label="Operator" name="operator" onChange={handleChange} required margin="normal" />
        <TextField fullWidth label="Service" name="service" onChange={handleChange} required margin="normal" />
        <Button type="submit" variant="contained" color="primary">Submit</Button>
      </form>
    </Container>
  );
};

export default Introduction;
