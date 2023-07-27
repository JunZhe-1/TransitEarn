import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import { Box, Typography, TextField, Button, Select, MenuItem, InputLabel, InputAdornment } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [Selectimage, setimage] = useState('');
    const [product, setProduct] = useState({
        productName: "",
        image: "",
        category: "",
        quantity: "",
        prizePoint: ""
    });

    useEffect(() => {
        http.get(`/product/get/${id}`).then((res) => {
            setProduct(res.data);
            setimage(res.data.image);

        });
    }, []);
    const formik = useFormik({
        initialValues: product,
        enableReinitialize: true,
        validationSchema: yup.object().shape({
            productName: yup.string().trim()
                .min(3, 'Product Name must be at least 3 characters')
                .max(100, 'Product Name must be at most 100 characters')
                .required('Product Name is required'),
            image: yup.string().trim()
                .required('image is required'),
            category: yup.string().trim()
                .required('Product category is required'),
            quantity: yup.number().required('Product quantity is required').integer().min(1),
            prizePoint: yup.number().required('Product price is required').integer().min(1),

        }),
        onSubmit: (data) => {
            data.productName = data.productName.trim();
            data.image = Selectimage;
            data.category = data.category.trim();
            data.quantity = parseInt(data.quantity);
            data.prizePoint = parseInt(data.prizePoint);
            http.put(`/product/updateProduct/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/listproduct");
                })
                .catch(function (err) {
                    toast.error(`${err.response.data.message}`);
                });
        }
    });

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteTutorial = () => {
        // http.delete(`/tutorial/${id}`)
        //     .then((res) => {
        //         console.log(res.data);
        //         navigate("/");
        //     });
    }

    return (
        <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <Typography variant="h5" sx={{ my: 2, color: 'black', marginTop: 0 }}>
                Add Product
            </Typography>
            <Box component="form" sx={{ maxWidth: '500px' }}
                onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth margin="normal" autoComplete="off"
                    label="productName"
                    name="productName"
                    value={formik.values.productName}
                    onChange={formik.handleChange}
                    error={formik.touched.productName && Boolean(formik.errors.productName)}
                    helperText={formik.touched.productName && formik.errors.productName}
                />

                <TextField
                    fullWidth margin="normal" autoComplete="off"
                    label="quantity"
                    name="quantity"
                    value={formik.values.quantity}
                    onChange={formik.handleChange}
                    error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                    helperText={formik.touched.quantity && formik.errors.quantity}

                />
                <TextField
                    fullWidth margin="normal" autoComplete="off"
                    label="prizePoint"
                    name="prizePoint"
                    value={formik.values.prizePoint}
                    onChange={formik.handleChange}
                    error={formik.touched.prizePoint && Boolean(formik.errors.prizePoint)}
                    helperText={formik.touched.prizePoint && formik.errors.prizePoint}
                    sx={{ marginBottom: 3 }} />

                <Select
                    sx={{ marginBottom: 2 }}
                    fullWidth margin="dense"
                    label="Category"
                    name="category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    error={formik.touched.category && Boolean(formik.errors.category)}
                >
                    <InputLabel id="category-label">Category</InputLabel>

                    <MenuItem value="option1">Option 1</MenuItem>
                    <MenuItem value="option2">Option 2</MenuItem>
                    <MenuItem value="option3">Option 3</MenuItem>
                </Select>

                <TextField
                    fullWidth
                    margin="dense"
                    autoComplete="off"
                    type="file"
                    label=""
                    name="image"
                    inputProps={{  }}
                    onChange={(event) => {
                        const file = event.target.files[0];
                        formik.setFieldValue('image', file);
                        setimage(file.name);
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {Selectimage && <Typography variant="body2">Previous image: {Selectimage}</Typography>}
                            </InputAdornment>
                        ),
                    }}
                    error={formik.touched.image && Boolean(formik.errors.image)}
                    helperText={formik.touched.image && formik.errors.image}
                />

                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Update
                    </Button>
                    <Button variant="contained" sx={{ ml: 2 }} color="error"
                        onClick={handleOpen}>
                        Delete
                    </Button>
                </Box>
            </Box>

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
            </Dialog>
            
            <ToastContainer />
        </Box>
        );
}

export default EditProduct;