// import React from 'react'
// import HomePage from './pages/HomePage'

// const App = () => {
//   return (
//     <div>
//       <HomePage />
//     </div>
//   )
// }

// export default App

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import { api } from "./api/api";

import HomePage from "./pages/HomePage";
import StudentList from "./pages/StudentsList";

const pages = ["Event Data", "Student List"];
const components = [<HomePage />, <StudentList />];

function App() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [ptr, setPtr] = React.useState(0);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = (index) => {
    console.log(index);
    setAnchorElNav(null);
    setPtr(index)
  };

  return (
    <div>
      <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdminPanelSettingsIcon
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            ADMIN
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page, index) => (
                <MenuItem key={page} onClick={() => {handleCloseNavMenu(index)}}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdminPanelSettingsIcon
            sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            ADMIN
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page, index) => (
              <Button
                key={page}
                onClick={() => {handleCloseNavMenu(index)}}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Button
            variant="contained"
            color="success"
            onClick={() => {
              var eventName = prompt(
                "Enter a uniquename for Event without spaces"
              );
              api
                .post("admin/createEvent", {
                    uniqueName: eventName
                })
                .then((result) => {
                  window.location.reload();
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            Add Events
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
    <div>
      {components[ptr]}
    </div>
    </div>
  );
}
export default App;
