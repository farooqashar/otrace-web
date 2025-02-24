import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  IconButton,
  Link,
} from "@mui/material";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import { logOut, useAuth } from "../firebase/auth";

const NavBar = () => {
  const navigate = useNavigate();
  const { user, role } = useAuth();

  return (
    <AppBar position="static" sx={{ marginBottom: 2 }}>
      <Toolbar>
        {/* Logo */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="logo"
          component={Link}
          to="/"
        >
          <LocationSearchingIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          OTrace
        </Typography>

        {/* Always visible */}
        <Button color="inherit" onClick={() => navigate("/")}>
          Home
        </Button>
        <Button color="inherit" onClick={() => navigate("/about")}>
          About
        </Button>

        {/* Consumer-only pages */}
        {role === "consumer" && (
          <>
            <Button color="inherit" onClick={() => navigate("/introduction")}>
              Introduction
            </Button>
            <Button color="inherit" onClick={() => navigate("/consent-manage")}>
              Manage Consents
            </Button>
            <Button color="inherit" onClick={() => navigate("/attestations")}>
              Attestations
            </Button>
          </>
        )}

        {/* Data Provider & Data Recipient pages */}
        {(role === "data provider" || role === "data recipient") && (
          <>
            <Button color="inherit" onClick={() => navigate("/consent-offer")}>
              Consent Offer
            </Button>
            <Button color="inherit" onClick={() => navigate("/data-use")}>
              Data Use
            </Button>
          </>
        )}

        {/* Auth-based navigation */}
        {user ? (
          <>
            <Button
              color="inherit"
              onClick={() => {
                logOut();
                navigate("/");
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={() => navigate("/signup")}>
              Signup
            </Button>
            <Button color="inherit" onClick={() => navigate("/login")}>
              Login
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
