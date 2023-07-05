import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import * as yup from 'yup';
import UserContext from '../contexts/UserContext';
import { dark } from '@mui/material/styles/createPalette';
let num = 0;
function PointEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectdeleteID, setdeleteId] = useState('');
    const [open, setOpen] = useState(false);



    const [info, setInfo] = useState({
        id: "",
        senderName: "",
        sender: "",
        recipientName: "",
        recipient: "",
        transferpoint: "",
        transferpointdate: "",
        Status: ""
    });

    const [tutorial, setTutorial] = useState({
        id: "",
        senderName: "",
        sender: "",
        recipientName: "",
        recipient: "",
        transferpoint: "",
        transferpointdate: "",
        Status: ""
    });

    useEffect(() => {
        http.get(`/point/adminget/${id}`).then((res) => {
            setTutorial(res.data);
        });
    }, []);



    const formik = useFormik({
        initialValues: tutorial,
        enableReinitialize: true,
        validationSchema: yup.object().shape({
            transferpoint: yup.number()
                .required()
                .integer()
                .min(1)

        }),
        onSubmit: (data) => {
            handleOpen1();
            setInfo(data);

        }
    });

    //handle submit data



    const handleOpen = (id) => {
        setOpen(true);
        setdeleteId(id);
    };

    const handleClose = () => {
        setdeleteId(null);
        setOpen(false);
    };


    const [open1, setOpen1] = useState(false);

    const double_confirm = () => {
        console.log(info);
        if (!isNaN(formik.values.transferpoint)) {
            http.put(`/point/edit/${id}`, info)
                .then((res) => {
                    console.log(res.data);
                    num = 0;
                    navigate("/adminpoint");
                })

                .catch(function (err) {

                    toast.error(`${err.response.data.message}`);
                    setOpen(false);
                });
        }

    };


    const handleOpen1 = () => {
        setOpen1(true);


    };


    const handleClose1 = () => {
        setOpen1(false);
        num--;
    };

    const deletePointrecord = (id) => {
        http.delete(`/point/remove/${id}`)
            .then((res) => {
                setOpen(false);
                navigate("/adminpoint")
            }).catch(function (err) {
                toast.error(`${err.response.data.message}`);
            });
    }
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
                        readOnly: true,
                        style: { color: 'grey' }, // this only allow a user to read the data only
                    }}
                />
                <TextField
                    fullWidth margin="normal" autoComplete="off"
                    label="Sender No"
                    name="sender"
                    value={formik.values.sender}

                    InputProps={{
                        style: { color: 'grey' },
                        readOnly: true, // this only allow a user to read the data only
                    }}
                />
                <TextField
                    fullWidth margin="normal" autoComplete="off"
                    label="Recipient Name"
                    name="recipientName"
                    value={formik.values.recipientName}
                    InputProps={{
                        style: { color: 'grey' },
                        readOnly: true, // this only allow a user to read the data only
                    }}
                />
                <TextField
                    fullWidth margin="normal" autoComplete="off"
                    label="Recipient NO"
                    name="recipient"
                    value={formik.values.recipient}
                    InputProps={{
                        style: { color: 'grey' },
                        readOnly: true, // this only allow a user to read the data only
                    }}
                />
                {tutorial.Status === 'yes' ? (
                    <TextField
                        fullWidth margin="normal" autoComplete="off"
                        label="Point"
                        name="transferpoint"
                        value={formik.values.transferpoint}
                        onChange={formik.handleChange}
                        error={formik.touched.transferpoint && Boolean(formik.errors.transferpoint)}
                        helperText={formik.touched.transferpoint && formik.errors.transferpoint}
                    />) :
                    <TextField
                        fullWidth margin="normal" autoComplete="off"
                        label="Point"
                        name="transferpoint"
                        value={formik.values.transferpoint}
                        InputProps={{
                            style: { color: 'grey' },
                            readOnly: true, // this only allow a user to read the data only
                        }} />
                }
                {tutorial.Status === 'yes' ? (
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" type="submit" onSubmit={formik.handleSubmit}>
                            Update
                        </Button>
                        <Button variant="contained" sx={{ ml: 2 }} color="error"
                            onClick={() => handleOpen(tutorial.id)}>
                            Delete
                        </Button>
                    </Box>) : <Button variant="contained" sx={{ ml: 2 }} color="error"
                        onClick={() => handleOpen(tutorial.id)}>
                    Delete
                </Button>}
            </Box>


            <Dialog open={open1} onClose={handleClose1}>
                <DialogTitle>
                    Confirmation Form
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Sender Name: {formik.values.senderName}   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        Recipient Name: {formik.values.recipientName}<br />

                        Sender No: {formik.values.sender} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        Recipient: {formik.values.recipient}<br />
                        Point: {formik.values.transferpoint}<br />
                        Are you sure you want to change the record?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={handleClose1}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={double_confirm}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>



            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete Tutorial
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this Record?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={() => deletePointrecord(selectdeleteID)}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </Box>
    );
}

export default PointEdit;