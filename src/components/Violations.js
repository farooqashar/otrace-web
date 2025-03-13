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
} from "@mui/material";

const Violations = ({ user }) => {
  const [violations, setViolations] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchViolations = async () => {
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

      // Filter "Data Usage" attestations and their corresponding "Consent" attestation
      const dataUsageLogs = attestationsData.filter(
        (att) => att.action.type === "Data Usage"
      );
      const consentLogs = attestationsData.filter(
        (att) => att.action.type === "Consent accepted"
      );

      let foundViolations = [];

      dataUsageLogs.forEach((usage) => {
        const matchingConsent = consentLogs.find(
          (consent) =>
            (consent.action.information.dataController ===
              usage.action.information.dataController) &
            (consent.action.information.data === usage.action.information.data)
        );

        // If no matching consent or mismatched properties, it's a violation
        // TO-DO: Add a check for expiration violation with timestamp of matched consent and data usage attestation
        // To-DO: Make sure consent status is accepted and nothing else like offered, revoked, rejected, etc.
        // To-DO: Keep track of what the actual violation was: consent wasn't found at all, consent has expired, consent operations do not match, etc.
        if (
          !matchingConsent ||
          matchingConsent.action.information.operationsPermitted !==
            usage.action.information.operation
        ) {
          foundViolations.push({
            id: usage.id,
            usage,
            matchingConsent,
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

      <Grid container spacing={3}>
        {violations.map(({ id, usage, matchingConsent }) => (
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
                <Typography variant="body2" color="textSecondary">
                  <strong>Data Controller:</strong>{" "}
                  {usage.action.information.dataController}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Data:</strong> {usage.action.information.data}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Operations Performed:</strong>{" "}
                  {usage.action.information.operation}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Operations Permitted:</strong>{" "}
                  {matchingConsent
                    ? matchingConsent.action.information.operationsPermitted
                    : "No Matching Consent Found!"}
                </Typography>
              </CardContent>

              <Button variant="outlined" onClick={() => toggleExpand(id)}>
                {expanded[id] ? "Hide Details" : "View Details"}
              </Button>

              <Collapse in={expanded[id]} timeout="auto" unmountOnExit>
                <CardContent
                  sx={{ backgroundColor: "#f5f5f5", borderRadius: 1, p: 2 }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Details:
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Timestamp:</strong>{" "}
                    {usage.timestamp.toDate().toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Usage Purpose:</strong>{" "}
                    {usage.action.information.operation}
                  </Typography>
                  {matchingConsent ? (
                    <>
                      <Typography variant="subtitle2" fontWeight="bold" mt={2}>
                        Consent Details:
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Data Controller:</strong>{" "}
                        {matchingConsent.action.information.dataController}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Data:</strong>{" "}
                        {matchingConsent.action.information.data}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Operations Permitted:</strong>{" "}
                        {matchingConsent.action.information.operationsPermitted}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body2" color="error" mt={2}>
                      No matching consent found for this data usage!
                    </Typography>
                  )}
                </CardContent>
              </Collapse>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Violations;
