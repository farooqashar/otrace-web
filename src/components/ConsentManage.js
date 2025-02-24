import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  addDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Container,
  Grid,
  Box,
  Alert,
  Snackbar,
} from "@mui/material";
import { Navigate } from "react-router-dom";

const ConsentManage = ({ role, user }) => {
  const [consents, setConsents] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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

  const updateConsent = async (id, status, data, operationsPermitted) => {
    await updateDoc(doc(db, "consent", id), { status });
    setConsents(consents.map((c) => (c.id === id ? { ...c, status } : c)));
    await addDoc(collection(db, "attestations"), {
      action: {
        type: `Consent ${status}`,
        information: {
          data: data,
          operationsPermitted: operationsPermitted,
          status: status,
        },
      },
      party: { email: user.email },
      timestamp: serverTimestamp(),
    });
    setSnackbarMessage(
      `Consent has been ${status} and an attestation record has been successfully created!`
    );
    setOpenSnackbar(true);
  };

  return (
    <Container maxWidth="md">
      <Box textAlign="center" my={4}>
        <Typography variant="h4" fontWeight="bold">
          Manage Consents
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {consents.map(({ id, data, operationsPermitted, status }) => (
          <Grid item xs={12} sm={6} key={id}>
            <Card
              sx={{
                boxShadow: 3,
                borderRadius: 2,
                p: 2,
                backgroundColor:
                  status === "accepted"
                    ? "#e0f2f1"
                    : status === "rejected"
                    ? "#FFD6D7"
                    : "#fff3e0",
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  Data: {data}
                </Typography>
                <Typography variant="body1">
                  <strong>Operations:</strong> {operationsPermitted}
                </Typography>
                <Typography
                  variant="body2"
                  color={
                    status === "accepted"
                      ? "green"
                      : status === "offered"
                      ? "orange"
                      : "red"
                  }
                >
                  <strong>Status:</strong> {status}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "space-between" }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() =>
                    updateConsent(id, "accepted", data, operationsPermitted)
                  }
                  disabled={status === "accepted"}
                >
                  Accept
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() =>
                    updateConsent(id, "rejected", data, operationsPermitted)
                  }
                  disabled={status === "rejected"}
                >
                  Reject
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
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

export default ConsentManage;
