import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Collapse,
  Button,
  Grid,
  Box,
  Chip,
  Paper,
  Stack,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

const Violations = ({ user }) => {
  const [violations, setViolations] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchViolations = async () => {
      if (!user) return;

      const [attestationSnapshot, consentSnapshot] = await Promise.all([
        getDocs(
          query(
            collection(db, "attestations"),
            where("party.email", "==", user.email)
          )
        ),
        getDocs(
          query(collection(db, "consent"), where("userEmail", "==", user.email))
        ),
      ]);

      const attestationsData = attestationSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const consentsData = consentSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const dataUsageLogs = attestationsData.filter(
        (att) => att.action.type === "Data Usage"
      );

      let foundViolations = [];

      dataUsageLogs.forEach((usage) => {
        const matchingConsent = consentsData.find(
          (consent) =>
            consent.data === usage.action.information.data &&
            consent.dataController === usage.action.information.dataController
        );

        let violationReasons = [];

        if (!matchingConsent) {
          violationReasons.push("No valid consent found");
        } else {
          if (matchingConsent.status !== "accepted") {
            violationReasons.push(
              "Consent status is " + matchingConsent.status
            );
          } else {
            const usageTimestamp = usage.timestamp.toDate();

            const consentExpiration = new Date(matchingConsent.expiration);
            if (consentExpiration.getTime() < usageTimestamp.getTime()) {
              violationReasons.push("Consent has expired");
            }
            if (
              matchingConsent.operationsPermitted !==
              usage.action.information.operation
            ) {
              violationReasons.push("Operations do not match");
            }
          }
        }

        if (violationReasons.length > 0) {
          foundViolations.push({
            id: usage.id,
            usage,
            matchingConsent,
            violationReasons,
          });
        }
      });

      setViolations(foundViolations);
    };

    fetchViolations();
  }, [user]);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Container maxWidth="md">
      <Box textAlign="center" my={4}>
        <Typography variant="h4" fontWeight="bold" color="error">
          Data Use Violations
        </Typography>
      </Box>

      {violations.length === 0 ? (
        <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
          <Typography variant="h6" color="green">
            No Violations Detected 🎉
          </Typography>
          <Typography variant="body2" color="textSecondary">
            All data usage checks out!
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {violations.map(
            ({ id, usage, matchingConsent, violationReasons }) => (
              <Grid item xs={12} key={id}>
                <Card
                  sx={{
                    boxShadow: 3,
                    borderRadius: 2,
                    p: 2,
                    backgroundColor: "#FFEBEE",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      Violation Detected
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ mt: 1, flexWrap: "wrap" }}
                    >
                      {violationReasons.map((reason, index) => (
                        <Chip
                          key={index}
                          label={reason}
                          color="error"
                          sx={{ fontWeight: "bold" }}
                        />
                      ))}
                    </Stack>
                    <Typography variant="body2" mt={1}>
                      <strong>Data Controller:</strong>{" "}
                      {usage.action.information.dataController}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Data:</strong> {usage.action.information.data}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Operations Performed:</strong>{" "}
                      {usage.action.information.operation}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Data Usage Timestamp:</strong>{" "}
                      {usage.timestamp.toDate().toLocaleString()}
                    </Typography>
                  </CardContent>

                  <Button
                    variant="outlined"
                    startIcon={expanded[id] ? <ExpandLess /> : <ExpandMore />}
                    onClick={() => toggleExpand(id)}
                    sx={{ mx: 2, mb: 2 }}
                  >
                    {expanded[id] ? "Hide Details" : "View Details"}
                  </Button>

                  <Collapse in={expanded[id]} timeout="auto" unmountOnExit>
                    <CardContent
                      sx={{ backgroundColor: "#f5f5f5", borderRadius: 1, p: 2 }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        Details:
                      </Typography>
                      {matchingConsent ? (
                        <>
                          <Typography
                            variant="subtitle2"
                            fontWeight="bold"
                            mt={2}
                          >
                            Consent Details:
                          </Typography>
                          <Typography variant="body2">
                            <strong>Consent Expiration:</strong>{" "}
                            {new Date(
                              matchingConsent.expiration
                            ).toLocaleString()}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Operations Permitted:</strong>{" "}
                            {matchingConsent.operationsPermitted}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Consent Status:</strong>{" "}
                            {matchingConsent.status}
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="body2" color="error" mt={2}>
                          No valid matching consent found for this data usage!
                        </Typography>
                      )}
                    </CardContent>
                  </Collapse>
                </Card>
              </Grid>
            )
          )}
        </Grid>
      )}
    </Container>
  );
};

export default Violations;
