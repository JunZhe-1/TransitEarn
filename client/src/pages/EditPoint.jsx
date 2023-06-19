import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import UserContext from '../contexts/UserContext';
function PointEdit() {
    const { id } = useParams();
    console.log(id);
    const navigate = useNavigate();



    const [tutorial, setTutorial] = useState({
        senderName: "",
        sender: "",
        recipientName: "",
        recipient: "",
        transferpoint: "",
        transferpointdate: "",
        Status: ""
    });

    useEffect(() => {
        http.get(`/point/get/${id}`).then((res) => {
            setTutorial(res.data);
        });
    }, []);
    const formik = useFormik({
        initialValues: tutorial,
        enableReinitialize: true,
    });
    //handle submit data

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box>
        <Typography variant="h5" sx={{ my: 2 }}>
            Edit Point Transaction
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit}>
            <TextField
                fullWidth margin="normal" autoComplete="off"
                label="Sender Name"
                name="senderName"
                value={formik.values.senderName}
                
                InputProps={{
                    readOnly: true, // this only allow a user to read the data only
                  }}
            />
           <TextField
                fullWidth margin="normal" autoComplete="off"
                label="Sender No"
                name="sender"
                value={formik.values.sender}
                
                InputProps={{
                    readOnly: true, // this only allow a user to read the data only
                  }}
            />
            <TextField
                fullWidth margin="normal" autoComplete="off"
                label="Recipient Name"
                name="recipientName"
                value={formik.values.recipientName}
                InputProps={{
                    readOnly: true, // this only allow a user to read the data only
                  }}
            />
            <TextField
                fullWidth margin="normal" autoComplete="off"
                label="Recipient NO"
                name="recipient"
                value={formik.values.recipient}
                
                InputProps={{
                    readOnly: true, // this only allow a user to read the data only
                  }}
            />
            <Box sx={{ mt: 2 }}>
                <Button variant="contained" type="submit">
                    Update
                </Button>
                <Button variant="contained" sx={{ ml: 2 }} color="error"
                    onClick={handleOpen}>
                    Delete
                </Button>
            </Box>
        </Box>

        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                Delete Tutorial
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete this tutorial?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="inherit"
                    onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="contained" color="error">
                    {/* onClick={deleteTutorial} > */}
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    </Box>
    );
}

export default PointEdit;