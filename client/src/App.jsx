import './App.css';
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button, IconButton } from '@mui/material';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Ezlink from './pages/Ezlink';
import AddEzlink from './pages/AddEzlink';
import http from './http';
import UserContext from './contexts/UserContext';
<<<<<<< Updated upstream
=======
import UseExistEzlink from './pages/UseExistsEzlink';
import EzlinkAdmin from './pages/EzlinkAdmin';
import { AccountCircle, Home } from '@mui/icons-material';
import SettingsIcon from '@mui/icons-material/Settings';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DirectionsBusFilledIcon from '@mui/icons-material/DirectionsBusFilled';
>>>>>>> Stashed changes

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      // Todo: get user data from server
      http.get('/user/auth').then((res) => {
        setUser(res.data.user);
      });
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <AppBar position="static" className="AppBar">
          <Container>
            <Toolbar disableGutters={true}>
<<<<<<< Updated upstream
              <Link to="/">
                <Typography variant="h6" component="div">
                  Learning
                </Typography>
              </Link>
              <Box sx={{ flexGrow: 1 }}></Box>
              {user && (
                <>
                  <Link to="/ezlink" ><Typography>Ezlink</Typography></Link>
                  <Typography>{user.name}</Typography>
                  <Typography>
                    <Button onClick={logout}>Logout</Button></Typography>
                </>
              )}
              {!user && (
                <>
                  <Link to="/register" ><Typography>Register</Typography></Link>
                  <Link to="/login" ><Typography>Login</Typography></Link>
                </>
              )}
            </Toolbar>
          </Container>
        </AppBar>

=======

              <Link to='/'>
                <IconButton color="inherit"  >
                  <DirectionsBusFilledIcon style={{ fontSize: '1.5em' }} />
                </IconButton>
              </Link>
              <Link to="/">
                <Typography style={{ fontWeight: 'bold', fontSize: '1.5em', color: 'CBC3E3', display: 'inline', marginRight: '20px' }} >
                  Transit <Typography style={{ color: 'orange', display: 'inline', fontSize: '1em', fontWeight: 'bold' }}>Earn
                  </Typography>
                </Typography>
              </Link>
              <Link to="/ezlinkadmin">
                <IconButton color="inherit">
                  <SettingsIcon />
                </IconButton>
              </Link>

              <Box sx={{ flexGrow: 1 }}></Box>
              {user && (
                <>
                  <Link to="/ezlink" >
                    <IconButton color="inherit">
                      <CreditCardIcon />
                    </IconButton>
                  </Link>
                  <Typography style={{ marginRight: '20px' }}>{user.name}</Typography>
                  <IconButton color="inherit" onClick={logout}>
                    <LogoutIcon />
                  </IconButton>
                </>
              )}
              {!user && (
                <>
                  <Link to="/register">
                    <IconButton color="inherit">
                      <AccountCircle />
                    </IconButton>
                  </Link>
                  <Link to="/login">
                    <IconButton color="inherit">
                      <LoginIcon />
                    </IconButton>
                  </Link>
                </>
              )}
            </Toolbar>
          </Container>
        </AppBar>

>>>>>>> Stashed changes
        <Container>
          <Routes>
            <Route path={"/"} element={<Ezlink accessToken={localStorage.getItem("accessToken")} />} />
            <Route path={"/register"} element={<Register />} />
            <Route path={"/login"} element={<Login />} />
            <Route path={"/ezlink"} element={<Ezlink accessToken={localStorage.getItem("accessToken")} />} />
            <Route path={"/addezlink"} element={<AddEzlink />} />
<<<<<<< Updated upstream
=======
            <Route path={"/useezlink/:id"} element={<UseExistEzlink />} />
            <Route path={"/ezlinkadmin"} element={<EzlinkAdmin />} />
>>>>>>> Stashed changes
          </Routes>
        </Container>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
