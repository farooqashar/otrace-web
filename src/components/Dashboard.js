import React from "react";
import { Container, Typography } from "@mui/material";

const Dashboard = ({ role }) => {
  return (
    <Container>
      <Typography variant="h4">Dashboard</Typography>
      <Typography variant="body1">Welcome, {role}!</Typography>
    </Container>
  );
}

export default Dashboard;
