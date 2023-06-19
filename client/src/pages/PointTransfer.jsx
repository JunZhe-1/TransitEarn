import React, { useContext, useState, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../../contexts/UserContext';

// import { user } from '../../../server/routes/user';

function PointTransfer() {
  const imageUrl = '../../image/bus-image.png';
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
 
 




  const formik = useFormik({
    initialValues: {
    phone: "",
    point: ""
  },


    validationSchema: yup.object().shape({
      phone: yup.number()
        .integer('Phone number must be a number')
        .test('len', 'Phone number must be exactly 8 digits', (val) => val && val.toString().length == 8)
        .required('Phone number is required'),
      point: yup.number()
        .min(1, 'Points must start from 1')
        .required('points cannot be empty')
    }),
  onSubmit: (data) => {
    
        data.point = parseInt(data.point);
        data.phone = parseInt(data.phone);
        http.put(`/user/transfer/${user.phone}`, data)
          .then((res) => {
            console.log(res.data);
            navigate("/");
            
          })
          .catch(function (err) {
            toast.error(`${err.response.data.message}`);
        });
      
    }
  });

  // const [open, setOpen] = useState(false);

  // const handleOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '50% 50%', width: '100%',  backgroundColor: '#f0f0f0' }}>
      <div style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'left',  height: '90vh', width: '90%',
       borderRadius: '20px',
   }}></div>

      <div style={{ color: 'black', textAlign: 'center'}}>
        <h1>Points Transfer</h1>
        <Box component="form"
          onSubmit={formik.handleSubmit}>
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
          />   <Button fullWidth variant="contained" sx={{ mt: 2 }}
            type="submit">
            Login
          </Button>
        </Box>
      </div>
      <ToastContainer />
    </div>
  );

}

export default PointTransfer;
