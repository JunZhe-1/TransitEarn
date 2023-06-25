import React from 'react';
import { useEffect, useState, useContext  } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import UserContext from '../contexts/UserContext';

async function checkCANExists(CAN) {
    try {
      let response = await http.get(`/ezlink?CAN=${CAN}`);
      let data = response.data;
      console.log("data",data);
      console.log("balance",data.balance)
      if (data.length > 0 && data[0].balance != null) {
        return {
          exists: true,
          balance: data[0].balance,
        };
      } else {
        return {
          exists: false,
          balance: 10,
        };
      }
    } catch (error) {
      console.error('Error checking CAN:', error);
      return {
        exists: false,
        balance: 10
      };
    }
  }
  

function AddEzlink() {
    const {user} = useContext(UserContext);
    let userId = null;
    if(user != null){
    userId =user.id
    
    const [initialBalance, setInitialBalance] = useState(0);

    async function checkinitialbalance(CAN) {
        try {
          const result = await checkCANExists(CAN);
          console.log('Result:', result);
          const exists = result.exists;
          const balance = result.balance;
          console.log('Exists:', exists);
          console.log('Balance:', balance);
      
          if (exists) {
            setInitialBalance(balance); 
            console.log("initialbalancechanged",initialBalance)
            return{
              exists: true,
              balance: balance,              
            }
          } else {
            setInitialBalance(10); 
            return{
              exists: false,
              balance: 10
            }
          }
        } catch (error) {
          console.error('Error checking CAN:', error);
          setInitialBalance(10); 
          return{
            exists: false,
            balance: 10
          }
        }
      }
      
      


      useEffect(() => {
        console.log("Initial Balance:", initialBalance);
      }, [initialBalance]);

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            CAN: "",
            cardNo: "",
            topupamount: "",
            balance: initialBalance,
            userId: userId,
        },

        validationSchema: yup.object().shape({
            CAN: yup.string().trim().min(16, "The length should be 16")
                .max(16, "The length should be 16")
                .required('CAN is rquired')
                .matches(/^\S*$/, 'Whitespace is not allowed'),

            cardNo: yup.string().trim().min(16, "The length should be 16")
                .max(16, "The length should be 16")
                .required('CAN is rquired')
                .matches(/^\S*$/, 'Whitespace is not allowed'),

            topupamount: yup
                .number()
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
          const result = await checkinitialbalance(data.CAN);
          console.log('Result:', result);
          const exists = result.exists;
          const balance = result.balance;
        
          if (exists) {
            setInitialBalance(balance);
          } else {
            setInitialBalance(10);
          }
        
          console.log("Balance:", balance); // Log the updated value from `balance`
        
          const updatedData = {
            ...data,
            balance: balance + parseFloat(data.topupamount), // Update the balance
          };
        
          http.post("/ezlink", updatedData)
            .then((res) => {
              console.log(res.data);
            });
            navigate("/Ezlink");
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
                    label="CarCreit card number"
                    name="cardNo"
                    value={formik.values.cardNo}
                    onChange={formik.handleChange}
                    error={formik.touched.cardNo && Boolean(formik.errors.cardNo)}
                    helperText={formik.touched.cardNo && formik.errors.cardNo}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    autoComplete="off"
                    label="Top-up Amount"
                    name="topupamount"
                    value={formik.values.topupamount}
                    onChange={formik.handleChange}
                    error={formik.touched.topupamount && Boolean(formik.errors.topupamount)}
                    helperText={formik.touched.topupamount && formik.errors.topupamount}
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
    else{
      return(
        <Typography variant="h5" sx={{ my: 2 }}>
        You have not logged in!
    </Typography>
      );
    }
}
export default AddEzlink;