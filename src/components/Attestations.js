import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  MenuItem,
  Collapse,
  Grid,
  Box,
} from "@mui/material";
import { Navigate } from "react-router-dom";

const Attestations = ({ role, user }) => {
  const [attestations, setAttestations] = useState([]);
  const [filteredAttestations, setFilteredAttestations] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [actionType, setActionType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchAttestations = async () => {
      if (!user) return;

      const q = query(
        collection(db, "attestations"),
        where("party.email", "==", user.email)
      );
      const querySnapshot = await getDocs(q);
      const attestationsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAttestations(attestationsData);
      setFilteredAttestations(attestationsData);
    };

    fetchAttestations();
  }, [user]);

  if (role !== "consumer") return <Navigate to="/login" />;

  const filterAttestations = () => {
    let filtered = [...attestations];

    if (actionType && actionType !== "All") {
      filtered = filtered.filter((log) => log.action.type === actionType);
    }

    if (startDate) {
      filtered = filtered.filter(
        (log) => log.timestamp.toDate() >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (log) => log.timestamp.toDate() <= new Date(endDate)
      );
    }

    setFilteredAttestations(filtered);
  };

  // For the collapsible section
  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Container maxWidth="md">
      <Box textAlign="center" my={4}>
        <Typography variant="h4" fontWeight="bold">
          Attestations
        </Typography>
      </Box>

      {/* Filters */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          select
          label="Action Type"
          fullWidth
          value={actionType}
          onChange={(e) => setActionType(e.target.value)}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Data Usage">Data Usage</MenuItem>
          <MenuItem value="Consent Offer">Consent Offer</MenuItem>
          <MenuItem value="Consent rejected">Consent rejected</MenuItem>
          <MenuItem value="Introduction">Introduction</MenuItem>
        </TextField>

        <TextField
          type="date"
          label="Start Date"
          InputLabelProps={{ shrink: true }}
          fullWidth
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <TextField
          type="date"
          label="End Date"
          InputLabelProps={{ shrink: true }}
          fullWidth
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <Button variant="contained" onClick={filterAttestations}>
          Apply Filters
        </Button>
      </Box>

      {/* Attestations List */}
      <Grid container spacing={3}>
        {filteredAttestations.map(({ id, action, party, timestamp }) => (
          <Grid item xs={12} sm={6} key={id}>
            <Card sx={{ boxShadow: 3, borderRadius: 2, p: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {action.type}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Timestamp:</strong>{" "}
                  {timestamp.toDate().toLocaleString()}
                </Typography>
              </CardContent>

              <CardActions sx={{ justifyContent: "space-between" }}>
                <Button variant="outlined" onClick={() => toggleExpand(id)}>
                  {expanded[id] ? "Hide Details" : "More Info"}
                </Button>
              </CardActions>

              {/* Collapsible JSON Info */}
              <Collapse in={expanded[id]} timeout="auto" unmountOnExit>
                <CardContent
                  sx={{ backgroundColor: "#f5f5f5", borderRadius: 1 }}
                >
                  <Typography variant="body2">
                    <strong>Details:</strong>
                  </Typography>
                  <pre style={{ fontSize: "12px", overflowX: "auto" }}>
                    {JSON.stringify(action.information, null, 2)}
                  </pre>
                </CardContent>
              </Collapse>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Attestations;
