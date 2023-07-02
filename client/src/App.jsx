import './App.css';
import { useState, useEffect } from 'react';
import * as React from 'react';

import { Container, AppBar, Toolbar, Typography, Box, Button, Fade, MenuItem, Menu } from '@mui/material';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import PointTransfer from './pages/PointTransfer';
import AdminPoint from './pages/AdminPointTransfer';
import EditProduct from './pages/EditProduct';
import PointEdit from './pages/EditPoint';
import Userpoint from './pages/UserPoint';
import http from './http';
import UserContext from '../contexts/UserContext';
import AddProduct from './pages/AddProduct'
import ListProduct from './pages/ListProduct';
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

  //
  //
  //

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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
              <Link to="/addproduct" ><Typography>Add product</Typography></Link>
              <Link to="/listproduct" ><Typography>list product</Typography></Link>


              <Box sx={{ flexGrow: 1 }}></Box>
              {user && (
                <>
                  <div >
                    <Button
                      id="fade-button"
                      aria-controls={open ? 'fade-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                      onClick={handleClick}
                      sx={{ color: 'white' }}
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
                          backgroundColor: '#0096FF	',
                        },
                      }}
                    >
                      <MenuItem onClick={handleClose} ><Link to="/point" ><Typography sx={{ color: 'white' }}>point</Typography></Link></MenuItem>
                      <MenuItem onClick={handleClose}><Link to="/userpoint" ><Typography sx={{ color: 'white' }}>history</Typography></Link></MenuItem>

                    </Menu>
                  </div>

                  <Typography>{user.name.toUpperCase()}</Typography>



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
            <Route path={"/userpoint"} element={<Userpoint />} />
            <Route path={"/pointedit/:id"} element={<PointEdit />} />
            <Route path={"/productedit/:id"} element={<EditProduct />} />
            <Route path={"/addproduct"} element={<AddProduct />} />
            <Route path={"/listproduct"} element={<ListProduct />} />
          </Routes>
        </Container>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
