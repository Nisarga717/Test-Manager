import React from "react";
import { AppBar, Toolbar, Button, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { Brightness4, Brightness7 } from "@mui/icons-material";

const Navbar = ({ darkMode, setDarkMode }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/test-cases">
          Test Cases
        </Button>
        <Button color="inherit" component={Link} to="/test-suites">
          Test Suites
        </Button>

        {/* Dark Mode Toggle Button */}
        <IconButton 
          color="inherit" 
          onClick={() => setDarkMode(!darkMode)} 
          sx={{ marginLeft: "auto" }}
        >
          {darkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
