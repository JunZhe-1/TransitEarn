import React, { useState, useEffect } from "react";
import "./App.css";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Fade, MenuItem, Menu
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BuildIcon from "@mui/icons-material/Build";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Accounts from "./pages/Accounts";
import EditAccount from "./pages/EditAccount";
import EditAdmin from "./pages/EditAdmin";
import Ezlink from './pages/Ezlink';
import AddEzlink from './pages/AddEzlink';
import UseExistEzlink from './pages/UseExistsEzlink';
import EzlinkAdmin from './pages/EzlinkAdmin';
import ProductHomePage from './pages/ProductHomePage';
import PointTransfer from './pages/PointTransfer';
import AdminPoint from './pages/AdminPointTransfer';
import EditProduct from './pages/EditProduct';
import PointEdit from './pages/EditPoint';
import Userpoint from './pages/UserPoint';
import AddProduct from './pages/AddProduct'
import ListProduct from './pages/ListProduct';
import HomePage from './pages/HomePage';
import DonatePoint from './pages/DonatePoint';
import DonationData from './pages/DonationData';
import AdminProduct from './pages/AdminProduct';
import UserProduct from './pages/UserProduct';
import http from "./http";
import UserContext from './contexts/UserContext';
import SettingsIcon from '@mui/icons-material/Settings';

import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";


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
            backgroundColor: "#8C1AFF",
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
            color: "#8C1AFF",
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
          color: "#8C1AFF",
          fontWeight: 500,
          margin: 10,
          textTransform: "none",
          "&.heading": {
            fontWeight: "bold",
          },
          "&.transitearn": {
            fontWeight: "bold",
            "& .purple": {
              color: "#8C1AFF",
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
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };



  const [anchorEl1, setAnchorEl1] = React.useState(null);
  const open1 = Boolean(anchorEl1);
  const handleClick1 = (event) => {
    setAnchorEl1(event.currentTarget);
  };
  const handleClose1 = () => {
    setAnchorEl1(null);
  };

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
                    <img src="/Logo.svg" alt="Logo" className='logo' />
                    <span className="purple">Transit</span>
                    <span className="orange">Earn</span>
                  </Typography>
                </Link>
                <Box sx={{ flexGrow: 1 }}></Box>
                {user && (
                  <>
                    {!isAdmin && (
                      <div >
                        <Link to={`/ezlink`}>
                          <Button
                            className="appbarbutton"
                            variant="contained"
                            disableElevation
                            size="small"
                          >
                            <CreditCardIcon></CreditCardIcon>
                          </Button>
                        </Link>,
                        <Button
                          onClick={handleClose} ><Link to="/productpage" ><Typography sx={{ color: '#8C1AFF' }}>Products</Typography></Link>

                        </Button>
                        <Button
                          id="fade-button"
                          aria-controls={open ? 'fade-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? 'true' : undefined}
                          onClick={handleClick}
                          sx={{ color: '#8C1AFF' }}
                        >
                          point management
                        </Button>
                        <Menu
                          id="fade-menu"
                          MenuListProps={{
                            'aria-labelledby': 'fade-button',
                          }}
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleClose}
                          TransitionComponent={Fade}
                          PaperProps={{
                            sx: {
                              backgroundColor: '#8C1AFF',
                            },
                          }}
                        >

                          <MenuItem onClick={handleClose} ><Link to="/point" ><Typography sx={{ color: 'white' }}>Point Transfer</Typography></Link></MenuItem>
                          <MenuItem onClick={handleClose}><Link to="/userpoint" ><Typography sx={{ color: 'white' }}>Point History</Typography></Link></MenuItem>
                          <MenuItem onClick={handleClose}><Link to="/donate" ><Typography sx={{ color: 'white' }}>Donation</Typography></Link></MenuItem>
                          <MenuItem onClick={handleClose}><Link to="/userproduct" ><Typography sx={{ color: 'white' }}>Product Redemption</Typography></Link></MenuItem>

                        </Menu>
                      </div>


                    )}



                    {isAdmin && (
                      <div >
                        <Link to="/accounts">
                          <Button
                            variant="contained"
                            disableElevation
                            size="small"
                            className="appbarbutton"
                          >
                            <BuildIcon></BuildIcon>
                          </Button>
                        </Link>,

                        <Link to="/ezlinkadmin">
                          <Button
                            variant="contained"
                            disableElevation
                            size="small"
                            className="appbarbutton"
                          >
                            <SettingsIcon></SettingsIcon>
                          </Button>
                        </Link>,
                        <Button
                          id="fade-button"
                          aria-controls={open ? 'fade-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? 'true' : undefined}
                          onClick={handleClick}
                          sx={{ color: '#8C1AFF' }}
                        >
                          MANAGEMENT
                        </Button>
                        <Menu
                          id="fade-menu"
                          MenuListProps={{
                            'aria-labelledby': 'fade-button',
                          }}
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleClose}
                          TransitionComponent={Fade}
                          PaperProps={{
                            sx: {
                              backgroundColor: '#8C1AFF;    ',
                            },
                          }}
                        >
                          <MenuItem onClick={handleClose} ><Link to="/adminpoint" ><Typography sx={{ color: 'white' }} >Point Transaction</Typography></Link></MenuItem>
                          <MenuItem onClick={handleClose}><Link to="/listproduct" ><Typography sx={{ color: 'white' }} >products</Typography></Link></MenuItem>
                          <MenuItem onClick={handleClose}><Link to="/addproduct" ><Typography sx={{ color: 'white' }} >Add product</Typography></Link></MenuItem>
                          <MenuItem onClick={handleClose}><Link to="/donatedata" ><Typography sx={{ color: 'white' }} >Donation</Typography></Link></MenuItem>
                          <MenuItem onClick={handleClose}><Link to="/adminproduct" ><Typography sx={{ color: 'white' }} >redemption Management</Typography></Link></MenuItem>

                        </Menu>
                      </div>

                    )}
                    <Typography>{user.name}</Typography>
                    <Link to={`/editaccount/${user.id}`}>
                      <Button
                        className="appbarbutton"
                        variant="contained"
                        disableElevation
                        size="small"
                      >
                        <AccountCircleIcon></AccountCircleIcon>
                      </Button>
                    </Link>



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
              <Route path={"/"} element={<HomePage />} />
              <Route path={"/accounts"} element={<Accounts />} />
              <Route path={"/editaccount/:id"} element={<EditAccount />} />
              <Route path={"/editadmin/:id"} element={<EditAdmin />} />
              <Route path={"/register"} element={<Register />} />
              <Route path={"/login"} element={<Login />} />
              <Route path={"/ezlink"} element={<Ezlink accessToken={localStorage.getItem("accessToken")} />} />
              <Route path={"/addezlink"} element={<AddEzlink />} />
              <Route path={"/useezlink/:id"} element={<UseExistEzlink />} />
              <Route path={"/ezlinkadmin"} element={<EzlinkAdmin />} />
              <Route path={"/point"} element={<PointTransfer />} />
              <Route path={"/adminpoint"} element={<AdminPoint />} />
              <Route path={"/userpoint"} element={<Userpoint />} />
              <Route path={"/pointedit/:id"} element={<PointEdit />} />
              <Route path={"/productedit/:id"} element={<EditProduct />} />
              <Route path={"/addproduct"} element={<AddProduct />} />
              <Route path={"/listproduct"} element={<ListProduct />} />
              <Route path={"/homepage"} element={<HomePage />} />
              <Route path={"/donate"} element={<DonatePoint />} />
              <Route path={"/donatedata"} element={<DonationData />} />
              <Route path={"/productpage"} element={<ProductHomePage />} />
              <Route path={'/adminproduct'} element={<AdminProduct />} />
              <Route path={"/userproduct"} element={<UserProduct />} />
            </Routes>
          </Container>
        </Router>
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App;