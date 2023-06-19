import './App.css';
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import PointTransfer from './pages/PointTransfer';
import AdminPoint from './pages/AdminPointTransfer';
import PointEdit from './pages/EditPoint';
import Userpoint from './pages/UserPoint';
import http from './http';
import UserContext from '../contexts/UserContext';

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
          <Container maxWidth="xl">
            <Toolbar disableGutters={true}>
              <Link to="/">
                <Typography variant="h6" component="div">
                  Learning
                </Typography>
              </Link>
              <Link to="/login" ><Typography>Login</Typography></Link>
              <Link to="/adminpoint" ><Typography>Admin Point</Typography></Link>
              <Box sx={{ flexGrow: 1 }}></Box>
              {user && (
                <>
                  <Typography>{user.name}</Typography>
                  <Typography>{user.point}</Typography>
                  <Link to="/point" ><Typography>point</Typography></Link>
                  <Link to="/userpoint" ><Typography>history</Typography></Link>

                  <Button onClick={logout} sx={{ color: 'white' }}>Logout</Button>
                </>
              )
              }
              {!user && (
                <>
                  <Link to="/register" ><Typography>Register</Typography></Link>
                  <Link to="/login" ><Typography>Login</Typography></Link>
                </>
              )}
            </Toolbar>
          </Container>
        </AppBar>

        <Container maxWidth="xl" >
          <Routes>
            <Route path={"/"} element={<Login />} />
            <Route path={"/register"} element={<Register />} />
            <Route path={"/login"} element={<Login />} />
            <Route path={"/point"} element={<PointTransfer />} />
            <Route path={"/adminpoint"} element={<AdminPoint />} />
            <Route path={"/userpoint"} element={<Userpoint/>} />

            <Route path={"/pointedit/:id"} element={<PointEdit/>} />
          </Routes>
        </Container>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
