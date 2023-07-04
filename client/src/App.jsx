import React, { useState, useEffect } from "react";
import "./App.css";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BuildIcon from "@mui/icons-material/Build";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Accounts from "./pages/Accounts";
import EditAccount from "./pages/EditAccount";
import EditAdmin from "./pages/EditAdmin";
import http from "./http";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";
import UserContext from "../contexts/UserContext";

// Create a custom MUI theme
let theme = createTheme();
theme = responsiveFontSizes(theme);

// Override MUI styles for AppBar and buttons
theme = createTheme(theme, {
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "white",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
          borderRadius: "0px 0px 15px 15px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          "&.save": {
            backgroundColor: "purple",
            textTransform: "none",
            letterSpacing: 2,
            "&:hover": {
              backgroundColor: "black",
            },
          },
          "&.delete": {
            textTransform: "none",
            letterSpacing: 2,
          },
          "&.appbarbutton": {
            backgroundColor: "transparent",
            color: "purple",
            "&:hover": {
              backgroundColor: "transparent",
              color: "black",
            },
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "purple",
          fontWeight: 500,
          margin: 10,
          textTransform: "none",
          "&.heading": {
            fontWeight: "bold",
          },
          "&.transitearn": {
            fontWeight: "bold",
            "& .purple": {
              color: "purple",
            },
            "& .orange": {
              color: "orange",
            },
          },
        },
      },
    },
  },
});

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      // Todo: get user data from server
      http.get("/user/auth").then((res) => {
        setUser(res.data.user);
        setIsAdmin(res.data.user.email === "admin@gmail.com");
      });
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  return (
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={{ user, setUser }}>
        <Router>
          <AppBar position="static" className="AppBar">
            <Container>
              <Toolbar disableGutters={true}>
                <Link to="/">
                  <Typography
                    variant="h6"
                    component="div"
                    className="transitearn"
                  >
                    <span className="purple">Transit</span>
                    <span className="orange">Earn</span>
                  </Typography>
                </Link>
                <Box sx={{ flexGrow: 1 }}></Box>
                {user && (
                  <>
                    <Typography>{user.name}</Typography>
                    <Link to={`/editaccount/${user.id}`}>
                      <Button className="appbarbutton" variant="contained" disableElevation size="small">
                        <AccountCircleIcon></AccountCircleIcon>
                      </Button>
                    </Link>
                    {isAdmin && (
                      <Link to="/accounts">
                        <Button
                          variant="contained"
                          disableElevation
                          size="small"
                          className="appbarbutton"
                        >
                          <BuildIcon></BuildIcon>
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="contained"
                      disableElevation
                      size="small"
                      onClick={logout}
                      className="appbarbutton"
                    >
                      <LogoutIcon></LogoutIcon>
                    </Button>
                  </>
                )}
                {!user && (
                  <>
                    <Link to="/register" className="login">
                      <Typography>Register</Typography>
                    </Link>
                    <Link to="/login" className="login">
                      <Typography>Login</Typography>
                    </Link>
                  </>
                )}
              </Toolbar>
            </Container>
          </AppBar>

          <Container>
            <Routes>
              <Route path={"/accounts"} element={<Accounts />} />
              <Route path={"/editaccount/:id"} element={<EditAccount />} />
              <Route path={"/editadmin/:id"} element={<EditAdmin />} />
              <Route path={"/register"} element={<Register />} />
              <Route path={"/login"} element={<Login />} />
            </Routes>
          </Container>
        </Router>
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App;
