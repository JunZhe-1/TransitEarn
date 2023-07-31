import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Typography, Grid, Card, CardContent, Input, IconButton, Button,
  Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Snackbar, Alert
  , Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, styled, tableCellClasses, TablePagination
} from '@mui/material';
import { } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import  GLBViewer  from './jiaksai'; // Replace with the correct path to your GLBViewer component


import http from '../http';
import UserContext from '../contexts/UserContext';



function ProductHomePage() {


  const [productList, setProductList] = useState([]);

  const { user } = useContext(UserContext);

  const [open, setOpen] = useState(false);



  const [show3DViewer, setShow3DViewer] = useState(false); // Correctly define and initialize the show3DViewer state



  

  useEffect(() => {
    // Fetch the product list from the server
    http.get('/product').then((res) => {
      setProductList(res.data);
    }).catch((error) => {
      console.log(error);
    });
  }, []);

  const handleRedeem = (ProductId, UserId) => {
    // Perform the redeem API call to the server
    // Update the product quantity after redemption

    const data = {
      productid:ProductId,
      userid:UserId
    }
    http.post(`/product/redeem/`, data)
      .then((res) => {
        console.log(res.data);
        // Update the product quantity in the product list
        const updatedProductList = productList.map(product => {
          if (product.id === ProductId) {
            return { ...product, quantity: product.quantity - 1 };
          }
          return product;
        });
        setProductList(updatedProductList);
      })
      .catch(function (err) {
        toast.error(`${err.response.data.message}`);
      });
  };




  const handleShow3DModel = (data) => {
    setOpen(true);
    setShow3DViewer(data);
  };

  // Function to handle the dialog close
  const handleClose = () => {
    setOpen(false);
  };

  
  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Product Home Page
        <Box>
      

    </Box>
      </Typography>

      <Grid container spacing={2}>
        {productList.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{product.productName}</Typography>
                <div style={{
                  backgroundImage: `url(${import.meta.env.VITE_FILE_BASE_URL}${product.image})`,
                  backgroundSize: 'cover',
                  height: '150px',
                  width: '100%',
                  marginBottom: '1rem',
                }}></div>
                <Typography variant="body1">
                  Category: {product.category}
                </Typography>
                <Typography variant="body1">
                  Quantity: {product.quantity}
                </Typography>
                <Typography variant="body1">
                  Price: {product.prizePoint}
                </Typography>
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={product.quantity === 0}
                    onClick={() => handleRedeem(product.id,user.id)}
                  >
                    Redeem
                  </Button>
                  {product.ARpic ? (
  <Button variant="contained" color="primary" onClick={() => handleShow3DModel(product.ARpic)}>
    Show 3D Model
  </Button>
) : null}

                </Box>
              </CardContent>
            </Card>setOpen
          </Grid>
        ))}
      </Grid>
      <ToastContainer />
      
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogContent>
          <GLBViewer productId={show3DViewer} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default ProductHomePage;
