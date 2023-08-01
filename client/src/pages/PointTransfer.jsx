import React, { useContext, useState } from 'react';
import { Box, TextField, Button, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';

function PointTransfer() {
  const imageUrl = '../../image/bus-image.png';
  const { user } = useContext(UserContext);
  const [name, setname] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const formik = useFormik({
    initialValues: {
      phone: "",
      point: ""
    },

    validationSchema: yup.object().shape({
      phone: yup.number()
        .integer('Phone number must be a number')
        .test('len', 'Phone number must be exactly 8 digits', (val) => val && val.toString().length === 8)
        .required('Phone number is required'),
      point: yup.number()
        .min(1, 'Points must start from 1')
        .required('Points cannot be empty')
    }),

    onSubmit: (data) => {
      console.log(formik.values.phone);

      setOpenDialog(true); 
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

  const handleOpenDialog = async  () => {
    try {
      await formik.handleSubmit();
      setname(formik.values.phone);
      console.log(formik.values.phone);
      if (formik.isValid) {
        setOpenDialog(true);
      }
    } catch (error) {
      // Handle any errors from form validation
      console.error(error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleTransfer = () => {
   
    const data = {
      phone: formik.values.phone,
      point: parseInt(formik.values.point)
    };
    console.log(data);
    http.put(`/user/transfer/${user.phone}`, data)
      .then((res) => {
        console.log(res.data);
        setOpenDialog(false);
        handleClick();
        formik.resetForm(); 
      })
      .catch(function (err) {
        setOpenDialog(false);
        toast.error(`${err.response.data.message}`);
      });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '50% 50%', width: '100%', backgroundColor: '#f0f0f0' }}>
      <div style={{
        backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'left', height: '90vh', width: '90%',
        borderRadius: '20px',
      }}></div>

      <div style={{ color: 'black', textAlign: 'center' }}>
        <h1>Points Transfer</h1>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth margin="normal" autoComplete="off"
            label="Phone"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
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
          <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleOpenDialog}>
            Transfer
          </Button>

          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%', fontSize: '1.2rem', fontWeight: 'bold' }}>
              Transfer Successful
            </Alert>
          </Snackbar>
        </Box>
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle style={{ textAlign: 'center', color: 'black', fontWeight: 'bold' }}>
          Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to transfer to {name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleTransfer}>
            Transfer
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </div>
  );
}

export default PointTransfer;
