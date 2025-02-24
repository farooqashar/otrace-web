import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  List,
  ListItem,
  ListItemText,
  Button,
  Container,
  Typography,
} from "@mui/material";
import { Navigate } from "react-router-dom";

const ConsentManage = ({ role, user }) => {
  const [consents, setConsents] = useState([]);

  useEffect(() => {
    const fetchConsents = async () => {
      const q = query(
        collection(db, "consent"),
        where("userEmail", "==", user.email)
      );
      const querySnapshot = await getDocs(q);
      setConsents(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };
    fetchConsents();
  }, [user]);

  if (role !== "consumer") return <Navigate to="/login" />;

  const updateConsent = async (id, status) => {
    await updateDoc(doc(db, "consent", id), { status });
    alert(`Consent ${status}`);
    setConsents(consents.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  return (
    <Container>
      <Typography variant="h5">Manage Consents</Typography>
      <List>
        {consents.map(({ id, data, operationsPermitted, status }) => (
          <ListItem key={id}>
            <ListItemText
              primary={`Data: ${data}, Operations Permitted: ${operationsPermitted}, Status: ${status}`}
            />
            <Button
              onClick={() => updateConsent(id, "accepted")}
              color="success"
            >
              Accept
            </Button>
            <Button onClick={() => updateConsent(id, "rejected")} color="error">
              Reject
            </Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default ConsentManage;
