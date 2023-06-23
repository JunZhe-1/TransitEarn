import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Box, Typography, TextField, Button, Select, MenuItem, IconButton } from '@mui/material';
import { MonetizationOn, Settings, Delete, ToggleOn, ToggleOff, Search, Clear, Edit, ProductionQuantityLimits } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';

function AddProduct() {
    const navigate = useNavigate();
    const [Selectimage, setimage] = useState('');

    const [toggle, setToggle] = useState('');

    const handleToggle = () => {
        setToggle(changetoggle => !changetoggle);
        console.log(toggle);
    };


    const formik = useFormik({
        initialValues: {
            productName: "",
            image: "",
            category: "option1",
            quantity: "",
            prizePoint: "",
            status: "True"

        },
        validationSchema: yup.object().shape({
            // need to change the name
            // KeeHern
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
            status: yup.string().required("cannot let it empty")

        }),
        onSubmit: (data) => {
            data.productName = data.productName.trim();
            data.image = Selectimage;
            data.category = data.category.trim();
            data.quantity = parseInt(data.quantity);
            data.prizePoint = parseInt(data.prizePoint);
            
            http.post("/product/register", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/");
                })
                .catch(function (err) {
                    toast.error(`${err.response.data.message}`);
                });
        }
    });

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
                    value={formik.values.imagquantitye}
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
                    onChange={(event) => {
                        const file = event.target.files[0];
                        formik.setFieldValue('image', file);
                        setimage(file.name);
                    }}
                    error={formik.touched.image && Boolean(formik.errors.image)}
                    helperText={formik.touched.image && formik.errors.image}
                />
               

                <Button fullWidth variant="contained" sx={{ mt: 2, }} type="submit">
                    Add
                </Button>
            </Box>
            <ToastContainer />
        </Box>
    );
}

export default AddProduct;