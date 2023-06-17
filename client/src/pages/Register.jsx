import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            point: 10,
            phone: ""

        },
        validationSchema: yup.object().shape({
            name: yup.string().trim()
                .matches(/^[a-z ,.'-]+$/i, 'Invalid name')
                .min(3, 'Name must be at least 3 characters')
                .max(50, 'Name must be at most 50 characters')
                .required('Name is required'),
            email: yup.string().trim()
                .email('Enter a valid email')
                .max(50, 'Email must be at most 50 characters')
                .required('Email is required'),
            password: yup.string().trim()
                .min(8, 'Password must be at least 8 characters')
                .max(50, 'Password must be at most 50 characters')
                .required('Password is required'),
            confirmPassword: yup.string().trim()
                .required('Confirm password is required')
                .oneOf([yup.ref('password'), null], 'Passwords must match'),
            phone: yup.number()
                .required()
                .integer()
                .test('len', 'Phone number must be exactly 8 digits', (val) => val && val.toString().length == 8),

        }),
        onSubmit: (data) => {
            data.name = data.name.trim();
            data.email = data.email.trim().toLowerCase();
            data.password = data.password.trim();
            data.point = parseInt(data.point, 10);
            data.phone = parseInt(data.phone);
            http.post("/user/register", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/login");
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
            <Typography variant="h5" sx={{ my: 2 }}>
                Register
            </Typography>
            <Box component="form" sx={{ maxWidth: '500px' }}
                onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth margin="normal" autoComplete="off"
                    label="Name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                />
                <TextField
                    fullWidth margin="normal" autoComplete="off"
                    label="Email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                    fullWidth margin="normal" autoComplete="off"
                    label="Password"
                    name="password" type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                />
                <TextField
                    fullWidth margin="normal" autoComplete="off"
                    label="Confirm Password"
                    name="confirmPassword" type="password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                />
                <TextField
                    fullWidth margin="normal" autoComplete="off"
                    label="Phone Number"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                />
                <Button fullWidth variant="contained" sx={{ mt: 2 }}
                    type="submit">
                    Register
                </Button>
            </Box>

            <ToastContainer />
        </Box>
    );
}

export default Register;