import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Typography, Grid, Card, CardContent, IconButton, Button
} from '@mui/material';
import { } from '@mui/icons-material';
import http from '../http';


function ProductHomePage() {
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    // Fetch the product list from the server
    http.get('/product').then((res) => {
      setProductList(res.data);
    }).catch((error) => {
      console.log(error);
    });
  }, []);

  const handleRedeem = (productId) => {
    // Perform the redeem API call to the server
    // Update the product quantity after redemption
    http.post(`/product/redeem/${productId}`)
      .then((res) => {
        console.log(res.data);
        // Update the product quantity in the product list
        const updatedProductList = productList.map(product => {
          if (product.id === productId) {
            return { ...product, quantity: product.quantity - 1 };
          }
          return product;
        });
        setProductList(updatedProductList);
      })
      .catch((error) => {
        console.log(error);
      });
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
                    onClick={() => handleRedeem(product.id)}
                  >
                    Redeem
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ProductHomePage;
