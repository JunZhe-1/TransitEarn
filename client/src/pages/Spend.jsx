import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import UserContext from '../contexts/UserContext';

function Spend() {
    const { user } = useContext(UserContext);
    let userId = null;
    userId = user.id;

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            CAN: "",
            cardNo: "",
            topupamount: 0,
            balance: 0,
            userId: userId,
            service: 'false',
        },

        validationSchema: yup.object().shape({
            CAN: yup.string().trim().min(16, "The length should be 16")
                .max(16, "The length should be 16")
                .required('CAN is rquired')
                .matches(/^\S*$/, 'Whitespace is not allowed'),

            topupamount: yup.number()
                .required('Top-up amount is required')
                .positive('Top-up amount must be positive')
                .test('is-decimal', 'Top-up amount must have 2 decimal places or be an integer', (value) => {
                    if (value) {
                        const decimalCount = value.toString().split('.')[1]?.length || 0;

                        if (decimalCount === 1) {
                            // Add trailing zero for 1 decimal place data
                            const modifiedValue = parseFloat(value.toFixed(2));
                            return modifiedValue === value; // Check if the modification succeeded
                        }

                        if (decimalCount === 0) {
                            // Add two trailing zeros for integer data
                            const modifiedValue = parseFloat(value.toFixed(2));
                            return modifiedValue === value; // Check if the modification succeeded
                        }

                        return decimalCount === 2;
                    }
                    return true;
                })
                .typeError('Top-up amount must be a number')


        }),
        onSubmit: async (data) => {
            let point = data.topupamount;
            try {
                console.log(data.CAN);
                const response = await http.get(`/ezlink/?CAN=${data.CAN}`);
                const latest = response.data[0];
                data.cardNo = latest.cardNo;
                data.balance = latest.balance - data.topupamount;
                data.service = latest.service;
                data.userId = userId;
                
                data.topupamount = 0-data.topupamount;

            } catch (error) {
                console.error('Error checking CAN:', error);
                return;
            }

            const updatedData = {
                ...data,
            };
            console.log('User ID:', user.id);
            console.log('Add Point:', parseInt(point));
            http.put(`/user/Spending/${user.id}`,{addpoint:parseInt(point)})      
            .then((res) => {
                console.log(res.data);
              })      .catch((err) => {
                console.error('Error updating point:', err);
                // Handle error if needed
              });
            http.post("/ezlink", updatedData)
                .then((res) => {
                    console.log(res.data);
                    navigate('/ezlink')
                })

        }


    })
    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Demo taking transport
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
                    label="Spent Amount"
                    name="topupamount"
                    value={formik.values.topupamount}
                    onChange={formik.handleChange}
                    error={formik.touched.topupamount && Boolean(formik.errors.topupamount)}
                    helperText={formik.touched.topupamount && formik.errors.topupamount}
                />
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Confirm
                    </Button>
                </Box>
            </Box>
        </Box>






    )
}

export default Spend;