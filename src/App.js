import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase/firebase";
import Signup from "./components/SignUp";
import Login from "./components/LogIn";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import { Container } from "@mui/material";
import NavBar from "./components/NavBar";

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <NavBar user={user} />
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard role={role} /> : <Navigate to="/login" />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
