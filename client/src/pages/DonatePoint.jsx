import React, { useContext, useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Stack, Snackbar, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';

function DonatePoint() {
    const imageUrl = '../../image/donate.png';
    // const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);



    const formik = useFormik({
        initialValues: {
            email: "admin@gmail.com",
            point: ""
        },


        validationSchema: yup.object().shape({
            email: yup.string()
                .required('Gmail is required'),
            point: yup.number()
                .min(1, 'Points must start from 1')
                .required('points cannot be empty')
        }),
        onSubmit: (data) => {
            data.email = data.email.trim();
            data.phone = parseInt(data.phone);
            http.put(`/user/transfer/${user.phone}`, data)
                .then((res) => {
                    console.log(res.data);
                    handleClick();
                    navigate("/point");

                })
                .catch(function (err) {
                    toast.error(`${err.response.data.message}`);
                });

        }
    });

    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };


    return (
        <div style={{ display: 'grid', gridTemplateColumns: '50% 50%', width: '100%', backgroundColor: '#f0f0f0' }}>
            <div style={{
                backgroundImage: `url(${imageUrl})`,backgroundSize: '100% 100%',    backgroundRepeat: 'no-repeat', backgroundPosition: 'left', height: '90vh', width: '90%',
                borderRadius: '20px',
            }}></div>

            <div style={{ color: 'black', textAlign: 'center' }}>
                <h1>Organ Donation</h1>
                <Box component="form"
                    onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth margin="normal" autoComplete="off"
                        label=""
                        name="email"
                        value="Donation"
                        disabled
                    />
                    <TextField
                        fullWidth margin="normal" autoComplete="on"
                        label="Points"
                        name="point"
                        value={formik.values.point}
                        onChange={formik.handleChange}
                        error={formik.touched.point && Boolean(formik.errors.point)}
                        helperText={formik.touched.point && formik.errors.point}
                    />
                    <Button fullWidth variant="contained" sx={{ mt: 2 }}
                        type="submit"   >
                        Donate
                    </Button>

                    {/* <Stack spacing={2} sx={{ width: '100%' }}>
      <Button variant="outlined" onClick={handleClick}>
        Open success snackbar
      </Button> */}
                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="success" sx={{ width: '100%', fontSize: '1.2rem', fontWeight: 'bold' }}>
                            Transfer Successful
                        </Alert>
                    </Snackbar>

                    {/* </Stack> */}
                </Box>
            </div>
            <ToastContainer />
        </div>
    );

}

export default DonatePoint;
