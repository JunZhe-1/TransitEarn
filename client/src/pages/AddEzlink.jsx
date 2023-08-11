import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Checkbox, FormControl, InputLabel, Select, MenuItem, InputAdornment } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCcVisa, faCcMastercard } from '@fortawesome/free-brands-svg-icons';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import UserContext from '../contexts/UserContext';
import cardValidator from 'card-validator';

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
      cardType: 'visa',
      userId: userId,
      service: 'false',
      expMonth: "",
      expYear: "",
    },

    validationSchema: yup.object().shape({
      CAN: yup.string().trim().min(16, "The length should be 16")
        .max(16, "The length should be 16")
        .required('CAN is rquired')
        .matches(/^\S*$/, 'Whitespace is not allowed'),

      cardType: yup.string().required('Card Type is required'),

      cardNo: yup.string().trim().min(16, "The length should be 16")
        .required('CAN is rquired')
        .matches(/^\S*$/, 'Whitespace is not allowed')
        .test('credit-card', 'Invalid credit card number', (value, context) => {
          const selectedCardType = context.parent.cardType; // Assuming you have a cardType field in your form data
          const validation = cardValidator.number(value);

          if (!validation.isValid) {
            return false;
          }

          // Check if the card type matches the selected type
          if (validation.card && validation.card.type !== selectedCardType) {
            return false;
          }

          return true;
        }),

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
        .string().trim().min(3).max(3).required().matches(/^[0-9]+$/, 'Input must contain only digits'),
        expMonth: yup.string()
        .required('Expiration Month is required')
        .matches(/^(0[1-9]|1[0-2])$/, 'Invalid month format (mm)'),
    
      expYear: yup.string()
        .required('Expiration Year is required')
        .matches(/^(23|24|25|26|27|28)$/, 'Invalid year format (yy)'),
    }),

    onSubmit: async (data) => {
      // Check if the provided cardNo exists in the ezlink table
      try {

        const response = await http.get(`/topup/?search=${data.cardNo}`);
        const cardExists = response.data.length > 0;
        const response2 = await http.get(`/topup/${data.cardNo}`);

        console.log(cardExists)
        if (!cardExists) {
          formik.setFieldError('cardNo', 'Invalid card number. Please enter a valid card number.');
          alert('Invald Credit Card Number')
          return; // Do not proceed with form submission if cardNo is invalid

        }
        if (data.topupamount > response2.data.balance + 1000) {
          alert('Their is not enough balance left in the credit card')
          return;
        }
        if (response2.data.cardType != data.cardType) {
          alert('The card with card Number ' + data.cardNo + 'is not a ' + data.cardType + ' card')
          return
        }
        if (response2.data.cvv != data.cvv) {
          alert('cvv does not match');
          formik.setFieldError('cvv', 'cvv does not match with credit card number ');
          return;
        }
        if(response2.data.ExpMonth != data.expMonth+'/'+data.expYear){
          alert('Expiry Month does not match');
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

      } catch (error) {
        console.error('Error checking card number:', error);
        return;
      }

      // Continue with the update as the cardNo is valid
      const result = await checkinitialbalance(data.CAN);
      console.log('Result:', result);
      const exists = result.exists;
      const balance = result.balance;
      const expMonth = data.expMonth.padStart(2, '0');
      const expYear = data.expYear.slice(-2); // Even if some people use 4 character works too
      const ExpMonth = `${expMonth}/${expYear}`;

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
        ExpMonth: ExpMonth,
      };
      console.log(updatedData);

      http.post("/ezlink", updatedData)
        .then((res) => {
          console.log(res.data);
          navigate('/Ezlink');
        });
    }



  });


  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>

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

          <Typography variant="body1">
            <b>We support the following payment types:</b>
          </Typography>
          <Box sx={{ marginLeft: 2 }}>
            <FontAwesomeIcon icon={faCcVisa} style={{ color: 'navy', fontSize: '24px', marginRight: '8px' }} />
            <FontAwesomeIcon icon={faCcMastercard} style={{ color: 'red', fontSize: '24px' }} />
            {/* You can add more icons here for other supported payment types */}
          </Box>

          <FormControl fullWidth margin="normal">
            <InputLabel>Card Type</InputLabel>
            <Select
              label="Card Type"
              name="cardType"
              value={formik.values.cardType}
              onChange={formik.handleChange}
              error={formik.touched.cardType && Boolean(formik.errors.cardType)}
              helperText={formik.touched.cardType && formik.errors.cardType}
              startAdornment={
                <InputAdornment position="start">
                  {formik.values.cardType === 'visa' ? (
                    <FontAwesomeIcon icon={faCcVisa} style={{ color: 'navy' }} />
                  ) : (
                    <FontAwesomeIcon icon={faCcMastercard} style={{ color: 'red' }} />
                  )}
                </InputAdornment>
              }
            >
              <MenuItem value="visa">Visa</MenuItem>
              <MenuItem value="mastercard">Mastercard</MenuItem>
              {/* Add more card types as needed */}
            </Select>
          </FormControl>

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
           <Typography variant="body1">
            Expiry Month
          </Typography>

          <TextField
            fullWidth
            margin="normal"
            autoComplete="off"
            label="MM"
            name="expMonth"
            value={formik.values.expMonth}
            onChange={formik.handleChange}
            error={formik.touched.expMonth && Boolean(formik.errors.expMonth)}
            helperText={formik.touched.expMonth && formik.errors.expMonth}
            style={{ width: '80px', marginRight: '8px' }}
          />

          <TextField
            fullWidth
            margin="normal"
            autoComplete="off"
            label="YY"
            name="expYear"
            value={formik.values.expYear}
            onChange={formik.handleChange}
            error={formik.touched.expYear && Boolean(formik.errors.expYear)}
            helperText={formik.touched.expYear && formik.errors.expYear}
            style={{ width: '60px' }}
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
      <img src="../image/ezlink.png" alt="ezlink card" style={{ width: '50%', marginLeft: '16px', marginTop: '250px' }} />
    </Box>
  );
}
export default AddEzlink;