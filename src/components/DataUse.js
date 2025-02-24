import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Navigate } from "react-router-dom";

const DataUse = ({ role }) => {
  if (role !== "data provider" && role !== "data recipient") return <Navigate to="/login" />;

  const [formData, setFormData] = useState({ operator: "", data: "", user: "", operation: "", basis: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "attestations"), {...formData, action: "DataUse", timestamp: serverTimestamp()});
    alert("Data use recorded!");
  };

  return (
    <Container>
      <Typography variant="h5">Data Use Form</Typography>
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Operator" name="operator" onChange={handleChange} required margin="normal" />
        <TextField fullWidth label="Data" name="data" onChange={handleChange} required margin="normal" />
        <TextField fullWidth label="User (Data Subject)" name="user" onChange={handleChange} required margin="normal" />
        <TextField fullWidth label="Operation" name="operation" onChange={handleChange} required margin="normal" />
        <TextField fullWidth label="Basis" name="basis" onChange={handleChange} required margin="normal" />
        <Button type="submit" variant="contained" color="primary">Submit</Button>
      </form>
    </Container>
  );
};

export default DataUse;
