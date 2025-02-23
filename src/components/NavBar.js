import React from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { logOut } from '../firebase/auth'

const NavBar = ( {user } ) => {

    const navigate = useNavigate();
    return (
        <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>OTrace</Typography>
          <Button color="inherit" onClick={() => navigate("/")}>Home</Button>
          {user ? (
            <>
              <Button color="inherit" onClick={() => navigate("/dashboard")}>Dashboard</Button>
              <Button color="inherit" onClick={() => { logOut(); navigate("/"); }}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/signup")}>Signup</Button>
              <Button color="inherit" onClick={() => navigate("/login")}>Login</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    )

}

export default NavBar;
