import React, { useContext, useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import http from '../http';
import UserContext from '../contexts/UserContext';
import GLBViewer from './jiaksai'; 

function ProductHomePage() {
  const [productList, setProductList] = useState([]);
  const { user } = useContext(UserContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [show3DViewer, setShow3DViewer] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Fetch the product list from the server
    http.get('/product').then((res) => {
      setProductList(res.data);
    }).catch((error) => {
      console.log(error);
    });
  }, []);

  const handleRedeem = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleTransfer = () => {
    const data = {
      productid: selectedProduct.id,
      userid: user.id
    };

    http.post(`/product/redeem/`, data)
      .then((res) => {
        console.log(res.data);
        // Update the product quantity in the product list
        const updatedProductList = productList.map(product => {
          if (product.id === selectedProduct.id) {
            return { ...product, quantity: product.quantity - 1 };
          }
          return product;
        });
        setProductList(updatedProductList);
        handleCloseDialog();
      })
      .catch(function (err) {
        toast.error(`${err.response.data.message}`);
      });
  };

  const handleShow3DModel = (product) => {
    setSelectedProduct(product);
    setShow3DViewer(true);
    
  };

  const handleClose3DModel = () => {
    setShow3DViewer(false);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Product Home Page
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
                    onClick={() => handleRedeem(product)}
                  >
                    Redeem
                  </Button>
                  {product.ARpic ? (
                    <Button variant="contained" color="primary" onClick={() => handleShow3DModel(product)}>
                      Show 3D Model
                    </Button>
                  ) : null}

                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle style={{ textAlign: 'center', color: 'black', fontWeight: 'bold' }}>
          Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to redeem {selectedProduct?.productName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleTransfer}>
            Redeem
          </Button>
        </DialogActions>
      </Dialog>

      {show3DViewer && (
        <Dialog open={show3DViewer} onClose={handleClose3DModel} maxWidth="md" >
          <DialogContent>
            <Box display="flex" justifyContent="flex-end">
              <Button variant="contained" color="primary" onClick={handleClose3DModel}>
                Close
              </Button>
            </Box>
            <div style={{ width: '90%', height: '100%' }}>
        <GLBViewer productId={selectedProduct.ARpic} />
      </div>          </DialogContent>
        </Dialog>
      )}

      <ToastContainer />
    </Box>
  );
}

export default ProductHomePage;
