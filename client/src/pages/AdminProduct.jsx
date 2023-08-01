import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
    Box, Typography, Grid, Card, CardContent, Input, IconButton, Button,
    Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { AccountCircle, AccessTime, Search, Clear, Edit, ArrowDownward, ArrowUpward, Co2Sharp } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import UserContext from '../contexts/UserContext';



function AdminProduct() {

    const [productlist, setproductlist] = useState([]);
    const [oriproductrecordlist, setoriproduct] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);
    const [button, setbutton] = useState('');





    useEffect(() => {
        getpointrecord();
    }, []);



    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };
    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchsender();
        }
    };


    const onClickSearch = () => {
        searchsender();
    }

    const onClickClear = () => {
        setSearch('');
        getpointrecord();
    };


    const getpointrecord = () => {
        http.get(`/product/adminget`).then((res) => {
            setoriproduct(res.data);
            setproductlist(res.data);
            setbutton('all');

        })
            .catch(function (err) {
                toast.error(`${err.response.data.message}`);
            });
    };

    const searchsender = () => {
        if (search.trim() !== '') {
            http.get(`/product/usersearch/search?search=${search}&userId=${"empty"}`).then((res) => {
                setproductlist(res.data);
            });
        }
    };

    const OnClickAll = () => {
        setbutton("all");
        setproductlist(oriproductrecordlist);
    }

    const OnClickSent = () => {
        setbutton("sent");
        setproductlist(oriproductrecordlist);
        const Year = new Date().getFullYear();
        const Month = new Date().getMonth();
        const days = new Date().getDay();
        const filter_sent = oriproductrecordlist.filter((data) => {
            const redeemDate = new Date(data.redeemdate);
            return redeemDate.getFullYear() === Year && Month === redeemDate.getMonth() && days === redeemDate.getDay();


        });
        console.log(filter_sent);
        setproductlist(filter_sent);
    }

    // const OnClickReceive = () => {
    //     setbutton("receive");
    //     setPointrecord(oripointrecordlist);
    //     const filter_sent = oripointrecordlist.filter((data) => data.recipient == user.phone);
    //     setPointrecord(filter_sent);
    // }




    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2, color: 'black', fontWeight: 'bold' }}>
                Redemption Management
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown} />
                <IconButton color="primary" onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary" onClick={onClickClear}>
                    <Clear />
                </IconButton>
            </Box>
            <Box sx={{ display: 'inline-block', alignItems: 'center', mb: 2 }}>
                <Button
                    variant="contained"
                    style={{
                        marginRight: '10px',
                        ...(button === 'all' ? { color: '#7DF9FF', backgroundColor: '#088F8F' } : { color: '#7393B3', backgroundColor: '#7DF9FF' })
                    }}
                    onClick={OnClickAll}
                >
                    All
                </Button>
                <Button variant="contained" style={{
                    marginRight: '10px',
                    ...(button === 'sent' ? { color: '#7DF9FF', backgroundColor: '#088F8F' } : { color: '#7393B3', backgroundColor: '#7DF9FF' })
                }}
                    onClick={OnClickSent}>
                    Today
                </Button>

            </Box>




            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow style={{ backgroundColor: "#ff0000" }}>
                              
                                    <TableCell><b>No</b></TableCell>
                                    <TableCell><b>User Name</b></TableCell>
                                    <TableCell><b>User Phone</b></TableCell>
                                    <TableCell><b>Product Name</b></TableCell>
                                    {/* <TableCell><b>Product Cat meow</b></TableCell> */}
                                    <TableCell><b>Product Points</b></TableCell>
                                    <TableCell><b>Redeemed Date</b></TableCell>
                                    <TableCell><b>Address</b></TableCell>
                               

                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {productlist
                                .sort((a, b) => new Date(b.redeemdate) - new Date(a.redeemdate)) // Sort by transferpointdate in descending order (latest to earliest)
                                .map((data, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{data.id}</TableCell>
                                        <TableCell>{data.username}</TableCell>
                                        <TableCell>{data.userphone}</TableCell>
                                        <TableCell>{data.productname}</TableCell>
                                        {/* <TableCell>{data.productCat}</TableCell> */}
                                        <TableCell>{data.usedpoint}</TableCell>
                                        <TableCell>{dayjs(data.redeemdate).format(global.datetimeFormat)}</TableCell>
                                        <TableCell>{data.address}</TableCell>

                                        {/* {data.sender === user.phone ? <TableCell sx={{ color: '#ff6666', fontWeight: 'bold' }}>{data.transferpoint}</TableCell> : <TableCell sx={{ color: '#00cc66', fontWeight: 'bold' }}>{data.transferpoint}</TableCell>}

                                    <TableCell>{dayjs(data.transferpointdate).format(global.datetimeFormat)}</TableCell>
                                    <TableCell>
                                        {data.Status === 'yes' ? (
                                            <IconButton color="primary">
                                                -
                                            </IconButton>) : null}

                                    </TableCell> */}
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper><ToastContainer /> </Box>

    );
}

export default AdminProduct;