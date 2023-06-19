import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';

function AddEzlink() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            CAN: "",
            CardNo: ""
        },

        validationSchema: yup.object().shape({
            CAN: yup.string().trim().min(16, "The length should be 16")
                .max(16, "The length should be 16")
                .required('CAN is rquired')
                .matches(/^\S*$/, 'Whitespace is not allowed'),

            CardNo: yup.string().trim().min(16, "The length should be 16")
                .max(16, "The length should be 16")
                .required('CAN is rquired')
                .matches(/^\S*$/, 'Whitespace is not allowed'),

        }),

        onSubmit: (data) => {
            data.CAN = data.CAN.trim();
            data.CardNo = data.CardNo.trim();
            http.post("/ezlink", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/Ezlink");
                });
        }
    });



    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Top up Ezlink card
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth margin="normal" autoComplete="off"
                    label="CAN"
                    name="CAN"
                    value={formik.values.CAN}
                    onChange={formik.handleChange}
                    error={formik.touched.CAN && Boolean(formik.errors.CAN)}
                    helperText={formik.touched.CAN && formik.errors.CAN}
                />

                <TextField
                    fullWidth margin="normal" autoComplete="off"
                    label="CarCreit card numberdNo"
                    name="CardNo"
                    value={formik.values.CardNo}
                    onChange={formik.handleChange}
                    error={formik.touched.CardNo && Boolean(formik.errors.CardNo)}
                    helperText={formik.touched.CardNo && formik.errors.CardNo}
                />
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Add
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
export default AddEzlink;