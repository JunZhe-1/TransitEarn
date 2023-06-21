import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Typography, Grid, Card, CardContent, Input, IconButton, Button,
  Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell
} from '@mui/material';
import { MonetizationOn, Settings, Search, Clear, Edit, ProductionQuantityLimits } from '@mui/icons-material';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import dayjs from 'dayjs';
import global from '../global';
import UserContext from '../contexts/UserContext';

function ListProduct() {
  const [productList, setProduct] = useState([]);
  const [search, setSearch] = useState('');
  const imageUrl = '../../image/';


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
                    backgroundImage: `url(${imageUrl+data.image})`, backgroundSize: 'cover',  height: '80px', width: '80px',
                    borderRadius: '5px'}}></div>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper><ToastContainer /> </Box>

  );
}

export default ListProduct;