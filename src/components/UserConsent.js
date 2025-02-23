import React from "react";
import { Navigate } from "react-router-dom";

const UserConsent = ({ role }) => {
  if (role !== "consumer") return <Navigate to="/login" />;

  return <h1>Consent Management For Consumers- Control consent requests</h1>;
};

export default UserConsent;
