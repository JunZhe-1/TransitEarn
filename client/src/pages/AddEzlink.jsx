import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Checkbox } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import UserContext from '../contexts/UserContext';

async function checkCANExists(CAN) {
  try {
    let response = await http.get(`/ezlink?CAN=${CAN}`);
    let data = response.data;
    console.log("data", data);
    console.log("balance", data.balance)
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
  const { user } = useContext(UserContext);
  let userId = null;
  userId = user.id
  const [ezlink, setEzlink] = useState({
    service: 'false',
  });

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
        console.log("initialbalancechanged", initialBalance)
        return {
          exists: true,
          balance: balance,
        }
      } else {
        setInitialBalance(10);
        return {
          exists: false,
          balance: 10
        }
      }
    } catch (error) {
      console.error('Error checking CAN:', error);
      setInitialBalance(10);
      return {
        exists: false,
        balance: 10
      }
    }
  }

  const handleServiceCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setEzlink((prevEzlink) => ({
      ...prevEzlink,
      [name]: checked ? 'true' : 'false',
    }));
  };


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
      service: 'false', 
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
        .typeError('Top-up amount must be a number'),

      cvv: yup
        .string().trim().min(3).max(3).required().matches(/^[0-9]+$/, 'Input must contain only digits')
    }),

    onSubmit: async (data) => {
      // Check if the provided cardNo exists in the ezlink table
      try {

        const response = await http.get(`/topup/?search=${data.cardNo}`);
        const cardExists = response.data.length > 0;
        const response2 = await http.get(`/topup/${data.cardNo}`);
        console.log(cardExists)
        if (data.topupamount > response2.data.balance) {
          alert('Their is not enough balance left in the credit card')
          return;
        }
        if (response2.data.cvv != data.cvv) {
          alert('cvv does not match');
          formik.setFieldError('cvv', 'cvv does not match with credit card number ');
          return;
        }
        let newbalance = parseFloat(response2.data.balance) - parseFloat(data.topupamount);
        alert('Your card left with ' + newbalance)
        http.put(`/topup/${data.cardNo}`, { newbalance: parseFloat(newbalance) })
          .then((res) => {
            console.log(res.data);
          })
          .catch((err) => {
            console.error('Error updating balance:', err);
            // Handle error if needed
          });

        if (!cardExists) {
          formik.setFieldError('cardNo', 'Invalid card number. Please enter a valid card number.');
          alert('Invald Credit Card Number')
          return; // Do not proceed with form submission if cardNo is invalid

        }
      } catch (error) {
        console.error('Error checking card number:', error);
        return;
      }

      // Continue with the update as the cardNo is valid
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
        balance: balance + parseFloat(data.topupamount),
        service: ezlink.service,

      };

      http.post("/ezlink", updatedData)
        .then((res) => {
          console.log(res.data);
          navigate('/Ezlink');
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
          label="CarCreit card number"
          name="cardNo"
          value={formik.values.cardNo}
          onChange={formik.handleChange}
          error={formik.touched.cardNo && Boolean(formik.errors.cardNo)}
          helperText={formik.touched.cardNo && formik.errors.cardNo}
        />


        <TextField
          fullWidth margin="normal" autoComplete="off"
          label="cvv"
          name="cvv"
          value={formik.values.cvv}
          onChange={formik.handleChange}
          error={formik.touched.cvv && Boolean(formik.errors.cvv)}
          helperText={formik.touched.cvv && formik.errors.cvv}
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

        <Checkbox
          name="service"
          checked={ezlink.service === 'true'} // Use the 'ezlink' state here
          onChange={handleServiceCheckboxChange}
        />
        Enable auto top-up service (once the balance goes bellow $5, auto top-up. )
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