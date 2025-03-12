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
  Avatar,
  Paper,
  Divider,
  Tooltip,
} from "@mui/material";
import { Navigate } from "react-router-dom";
import { CheckCircle, Cancel, Info } from "@mui/icons-material";

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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight="bold">
            Manage Your Data Consents
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Review and manage requests from data controllers to use your data.
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {consents.map(
            ({ id, data, operationsPermitted, status, dataController }) => (
              <Grid item xs={12} sm={6} md={4} key={id}>
                <Card
                  sx={{
                    boxShadow: 4,
                    borderRadius: 3,
                    p: 2,
                    backgroundColor:
                      status === "accepted"
                        ? "#E8F5E9"
                        : status === "rejected"
                        ? "#FFEBEE"
                        : "#FFFDE7",
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                        {dataController.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {dataController}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Data Controller
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body1">
                      <strong>Data Requested:</strong> {data}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Purpose:</strong> {operationsPermitted}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        display: "flex",
                        alignItems: "center",
                        color:
                          status === "accepted"
                            ? "green"
                            : status === "offered"
                            ? "orange"
                            : "red",
                      }}
                    >
                      <Info sx={{ fontSize: 16, mr: 1 }} />
                      <strong>Status:</strong> {status}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "space-between" }}>
                    <Tooltip title="Approve data sharing consent">
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircle />}
                        onClick={() =>
                          updateConsent(
                            id,
                            "accepted",
                            data,
                            operationsPermitted
                          )
                        }
                        disabled={status === "accepted"}
                      >
                        Accept
                      </Button>
                    </Tooltip>
                    <Tooltip title="Deny data sharing consent">
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<Cancel />}
                        onClick={() =>
                          updateConsent(
                            id,
                            "rejected",
                            data,
                            operationsPermitted
                          )
                        }
                        disabled={status === "rejected"}
                      >
                        Reject
                      </Button>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            )
          )}
        </Grid>
      </Paper>
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
