import './App.css';
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Ezlink from './pages/Ezlink';
import AddEzlink from './pages/AddEzlink';
import http from './http';
import UserContext from './contexts/UserContext';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      // Todo: get user data from server
      http.get('/user/auth').then((res) => {
        setUser(res.data.user);
      });

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

        <Container>
          <Routes>
            <Route path={"/"} element={<Ezlink accessToken={localStorage.getItem("accessToken")} />} />
            <Route path={"/register"} element={<Register />} />
            <Route path={"/login"} element={<Login />} />
            <Route path={"/ezlink"} element={<Ezlink accessToken={localStorage.getItem("accessToken")} />} />
            <Route path={"/addezlink"} element={<AddEzlink />} />
          </Routes>
        </Container>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
