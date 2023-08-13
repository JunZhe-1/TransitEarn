import React, { useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { Box, Typography, Grid,Input, IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import {  Search, Clear } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';



function EzlinkAdmin() {
    const [ezlinkList, setEzlinkList] = useState([]);
    const [search, setSearch] = useState('');
    const [buttonIndex, setButtonIndex] = useState(null);
    const [deleteid, setdeleteid] = useState('');
    const [refundamount,setrefundamount] = useState(0);
    const navigate = useNavigate();

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getEzlink = () => {
        http.get('/ezlink').then((res) => {
            setEzlinkList(res.data);
        });
    };

    const searchEzlink = () => {
        http.get(`/ezlink/?search=${search}`).then((res) => {
            setEzlinkList(res.data);
        });
    };

    useEffect(() => {
        getEzlink();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            searchEzlink();
        }
    };

    const onClickSearch = () => {
        searchEzlink();
    };

    const onClickClear = () => {
        setSearch('');
        getEzlink();
    };

    const handleButtonMouseEnter = (index) => {
        setButtonIndex(index);
    };

    const handleButtonMouseLeave = () => {
        setButtonIndex(null);
    };

    const [popup, setPopup] = useState(false);

    const openPopup = (id,topupamount) => {
        setdeleteid(id);
        setrefundamount(topupamount)
        setPopup(true);
    };

    const closePopup = () => {
        setPopup(false);
    };
    const deleteEzlink = async() => {
        try{
            const response = await http.get(`/ezlink/${deleteid}`);
            let cardNo = response.data.cardNo;
            let can = response.data.CAN;
            let search = await http.get(`/ezlink/?CAN=${can}`);
            let balance1 = search.data[0].balance;
            let id = search.data[0].id;
            console.log(balance1)
            const response2 = await http.get(`/topup/${cardNo}`);
            let balanceincard = response2.data.balance;
            http.put(`/topup/${cardNo}`,{newbalance: parseFloat(balanceincard+refundamount)})
            http.put(`/ezlink/${id}`,{newbalance : balance1 - refundamount})

        }catch(err){
            console.error('Error updating balance:', err);
            // Handle error if needed
            return;
        }
        http.delete(`/ezlink/${deleteid}`)
            .then((res) => {
                console.log(res.data);
                getEzlink();
                setPopup(false);

            });
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Ezlink Admin
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search" onChange={onSearchChange} onKeyDown={onSearchKeyDown} />
                <IconButton color="primary" onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary" onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={10} md={10} lg={12} style={{ width: '1000px' }} >
                    <TableContainer sx={{maxHeight : 440}}>
                        <Table stickyHeader aria-label='sticky table' style={{ border: 'solid' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Transaction ID</TableCell>
                                    <TableCell align="center">User ID</TableCell>
                                    <TableCell align="center">CAN</TableCell>
                                    <TableCell align="center">Credit Card No.</TableCell>
                                    <TableCell align="center">Balance ($)</TableCell>
                                    <TableCell align="center">Top-up amount ($)</TableCell>
                                    <TableCell align="center">Top-up Time</TableCell>
                                    <TableCell align='center'>Refund & Delete</TableCell>
                                    

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.isArray(ezlinkList) && ezlinkList.length > 0 ? (
                                    ezlinkList .filter(ezlink => ezlink.topupamount > 0).map((ezlink, index) => (
                                        <TableRow key={ezlink.id}>
                                            <TableCell>{ezlink.id}</TableCell>
                                            <TableCell>{ezlink.userId}</TableCell>
                                            <TableCell>{ezlink.CAN}</TableCell>
                                            <TableCell>************{ezlink.cardNo.slice(12)}</TableCell>
                                            <TableCell>{ezlink.balance.toFixed(2)}</TableCell>
                                            <TableCell>{ezlink.topupamount.toFixed(2)}</TableCell>
                                            <TableCell>{new Date(ezlink.createdAt).toString().split('T')[0]}</TableCell>
                                            <TableCell>
                                                
                                                    <Button
                                                        variant="contained"
                                                        style={{
                                                            width: '20px',
                                                            backgroundColor: buttonIndex === index ? '#AF2020' : 'red',
                                                            borderRadius:'10px',
                                                        }}
                                                        onMouseEnter={() => handleButtonMouseEnter(index)}
                                                        onMouseLeave={handleButtonMouseLeave}
                                                        onClick={() => openPopup(ezlink.id,ezlink.topupamount)}
                                                    >
                                                        Delete
                                                    </Button>
                                               
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell align="center" colSpan={5}>
                                            No table data
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
            <Dialog open={popup} onClose={closePopup}>
                <DialogTitle>
                    Delete Tutorial
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this top up histiory and give a refund?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={closePopup}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={deleteEzlink}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    )
}
export default EzlinkAdmin;