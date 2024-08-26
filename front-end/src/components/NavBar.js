// This is the navbar of the application

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { theme } from "../utils";
export const NavBar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        style={{ backgroundColor: theme.palette.primary.main }}
      >
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit" component="div">
            Cat App
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
