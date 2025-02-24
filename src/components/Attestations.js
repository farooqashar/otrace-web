import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Navigate } from "react-router-dom";

const Attestations = ({ role }) => {
  const [attestations, setAttestations] = useState([]);

  useEffect(() => {
    const fetchAttestations = async () => {
      const querySnapshot = await getDocs(collection(db, "attestations"));
      setAttestations(querySnapshot.docs.map((doc) => doc.data()));
    };
    fetchAttestations();
  }, []);

  if (role !== "consumer") return <Navigate to="/login" />;

  return (
    <Container>
      <Typography variant="h5">Attestations</Typography>
      <List>
        {attestations.map(({ operator, action, timestamp }, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`Operator: ${operator}, Action: ${action}, Time: ${timestamp}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Attestations;
