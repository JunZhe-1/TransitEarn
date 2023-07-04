import React, { useEffect, useState, useContext } from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import {
  Box, Typography, Grid, Card, CardContent, Input, IconButton, Button,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell
} from '@mui/material';
import { MonetizationOn, Settings, Delete, ToggleOn, ToggleOff, Search, Clear, Edit, ProductionQuantityLimits } from '@mui/icons-material';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import dayjs from 'dayjs';
import global from '../global';
import UserContext from '../contexts/UserContext';

function ListProduct() {
  const [productList, setProduct] = useState([]);
  const [search, setSearch] = useState('');
  const [id, setid] = useState('');
  const imageUrl = '../../image/';
  const navigate = useNavigate();


  // const [toggle, setToggle] = useState(false);

  // const handleToggle = () => {
  //   setToggle(prevToggle => !prevToggle);
  // };


  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const getTutorials = () => {
    http.get('/product').then((res) => {
      setProduct(res.data);
    });
  };

  const searchTutorials = () => {
    http.get(`/product/search?search=${search}`).then((res) => {
      setProduct(res.data);
    });
  };

  useEffect(() => {
    getTutorials();
  }, []);

  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      searchTutorials();
    }
  };

  const onClickSearch = () => {
    searchTutorials();
  }

  const onClickClear = () => {
    setSearch('');
    getTutorials();
  };
  const [open, setOpen] = useState(false);

  const handleOpen = (data) => {
    setid(data)
    setOpen(true);
  };

  const handleClose = () => {
    setid(null);
    setOpen(false);
  };

  const deleteTutorial = () => {
    http.delete(`/product/delete/${id}`)
        .then((res) => {
            console.log(res.data);
            handleClose(false);
            getTutorials();
            navigate("/listproduct");
        });
  }
  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Tutorials
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Input value={search} placeholder="Search"
          onChange={onSearchChange}
          onKeyDown={onSearchKeyDown} />
        <IconButton color="primary" onClick={onClickSearch}>
          <Search />
        </IconButton>
        <IconButton color="primary" onClick={onClickClear}>
          <Clear />
        </IconButton>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Points</TableCell>

              </TableRow>
            </TableHead>

            <TableBody>
              {productList.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>{data.productName}</TableCell>
                  <TableCell>
                    <div style={{
                      backgroundImage: `url(${imageUrl + data.image})`, backgroundSize: 'cover', height: '80px', width: '80px',
                      borderRadius: '5px'
                    }}></div>
                  </TableCell>
                  <TableCell>{data.category}</TableCell>
                  <TableCell>{data.quantity}</TableCell>
                  <TableCell>{data.prizePoint}</TableCell>

                  <TableCell>
                    <Link to={`/productedit/${data.id}`} style={{ textDecoration: 'none' }}>
                      <IconButton color="primary">
                        <Settings />
                      </IconButton>
                    </Link>

                    <IconButton color="primary" onClick={() => handleOpen(data.id)}>
                      <Delete  />
                    </IconButton>

                    {/* <IconButton color="primary" onClick={handleToggle}>
  {toggle ? <ToggleOn /> : <ToggleOff />}
</IconButton> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Delete Tutorial
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this tutorial?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit"
            onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error"
            onClick={deleteTutorial}>
            Delete
          </Button>
        </DialogActions>
      </Dialog><ToastContainer /> </Box>


  );
}

export default ListProduct;