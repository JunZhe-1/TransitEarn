import React, { useEffect, useState, useContext, navigate } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Grid, Card, CardContent, Input, IconButton, Button,
    Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Snackbar, Alert
    , Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, styled, tableCellClasses, TablePagination
} from '@mui/material';
import { BarChart } from '@mui/x-charts';

import { ToastContainer, toast } from 'react-toastify';
import { AccountCircle, AccessTime, Search, Settings, Clear, Visibility, Edit, Delete, Block } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';

function DonationData() {
    const navigate = useNavigate();
    const [chartdata, setchart] = useState([]);
    const [rankingdata, setranking] = useState([]);
    const [point, setpoint] = useState('');
    const [page, setPage] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);




    useEffect(() => {
        getchartdata();
    }, []);

    const getchartdata = () => {
        http.get('/point/adminget/chart').then((res) => {
            setchart(res.data["month"]);
            setranking(res.data["ranking"]);
            setpoint(res.data['point']);

        })
            .catch(function (err) {
                toast.error(`${err.response.data.message}`);
            });;
    };

    const Year = new Date().getFullYear();

    // console.log(Object.keys(chartdata));
    // console.log(Object.values(chartdata));



    const formattedData = Object.keys(chartdata).map((month) => ({ //month will represent the key
        month: month,
        value: chartdata[month],
    }));

    if (formattedData.length === 0) {
        return <div>No data available</div>; // Render a message if there is no data
    }
    // console.log(rankingdata);



    const handleOpen = () => {
        setOpen(true);

    };

    const handleClose = () => {
        setOpen(false);
    };

    const redeem_process = () => {
        http.put(`/point/redeemed/${Year}`)
        .then((res) => {
          
        handleClick1();
    
          handleClose();
          getchartdata();
         

        })
        .catch(function (err) {
            handleClose1();
          toast.error(`${err.response.data.message}`);
        });

    };



    const handleClick1 = () => {
        setOpen1(true);
    };

    const handleClose1 = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen1(false);
    };





    const columns = [
        { id: 'no', label: 'No', minWidth: 10 },
        { id: 'code', label: 'Name', minWidth: 100 },
        { id: 'name', label: 'contact number', minWidth: 150 },
        {
            id: 'population',
            label: 'Total Point',
            minWidth: 150,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },


    ];

    function createData(no, name, code, population) {

        return { no, name, code, population };
    }
    let num = 1;
    const rows = rankingdata.map((item) => {
        const senderID = item.senderID;
        const senderData = item.senderData;

        return createData(num++, senderID, Object.keys(senderData), Object.values(senderData));
    });




    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };



    return (


        <Box display="flex" flexWrap="wrap" justifyContent="space-between">
            {/* First Row */}
            <Box width="45%" mb={2}>
                <Box
                    width={750}
                    height={450}>
                    <h1 style={{ fontSize: '25px', color: 'black', textAlign: 'center', marginBottom: '-80px' }}>Organ Donation in {Year}</h1>
                    <BarChart
                        xAxis={[
                            {
                                id: 'barCategories',
                                data: formattedData.map((data) => data.month), // formattedData have two part which are month and value(i name it as value)
                                scaleType: 'band',
                            },
                        ]}
                        series={[
                            {
                                data: formattedData.map((data) => data.value),
                            },
                        ]}
                        title="Donation Data Chart" // Add the title here

                    >
                    </BarChart>
                </Box>
            </Box>

            <Box width="45%" mb={2}>
                <Box style={{border:'black 1px solid'}}>
                    <div style={{ color: 'black', fontWeight: 'bold', fontSize: '18px' }}>
                        <h1 style={{ fontSize: '25px', color: 'black', textAlign: 'center' }}>point in {Year}</h1><br />
                        <p style={{ color: '#EE4B2B' }}>Redeemed: {point['redeemed']} point</p>
                        <p style={{ color: '#EE4B2B' }}>Refund points: {point['refund']} Point</p>
                        <p style={{ color: '#50C878' }}>Non-Redeemed: {point['non_redeemed']} Point</p><br />
                        <p>In Total: {point['total']} point</p>
                        <Button color="primary" fullWidth variant="contained" sx={{ mt: 2 }}
                            onClick={handleOpen}>Claim

                        </Button>
                    </div>

                </Box>



            </Box>

            {/* Second Row */}
            <Box width="45%" mb={2}>

                <Box
                    width={750}
                    height={400}>
                    <h1 style={{ fontSize: '25px', color: 'black', textAlign: 'center', marginBottom: '-80px' }}>{Year}</h1>
                    <BarChart
                        xAxis={[
                            {
                                id: 'barCategories',
                                data: formattedData.map((data) => data.month), // Convert the keys to a comma-separated string
                                scaleType: 'band',
                            },
                        ]}
                        series={[
                            {
                                data: formattedData.map((data) => data.value),
                            },
                        ]}
                        title="Donation Data Chart" // Add the title here

                    >
                    </BarChart>
                </Box>



            </Box>
            <Box width="45%"  mb={2} style={{}}>
                <Paper fullWidth sx={{ width: '100%' ,height:'auto',border:'1px black solid', marginLeft:'70px'}}>
                    <TableContainer >
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" colSpan={4}>
                                        Organ Donation
                                    </TableCell>

                                </TableRow>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ top: 57, minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody >
                                {rows
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                                {columns.map((column) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell key={column.id} align={column.align}>
                                                            {column.format && typeof value === 'number'
                                                                ? column.format(value)
                                                                : value}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />

                </Paper>
            </Box>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Redeemed Points
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to Redeem all the points??
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="inherit"
                        onClick={redeem_process}>
                        Redeem
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={open1} autoHideDuration={6000} onClose={handleClose1}>
                <Alert onClose={handleClose1} severity="success" sx={{ width: '100%', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    Redeemed Successful
                </Alert>
            </Snackbar>
            <ToastContainer />

        </Box>





    );
}


export default DonationData;