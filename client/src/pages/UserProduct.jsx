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
import UserContext from '../../contexts/UserContext';



function UserProduct() {

    const [productlist, setproduct] = useState([]);
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
        http.get(`/product/getuser/${user.id}`).then((res) => {
            setproduct(res.data);
          
            

        })
            .catch(function (err) {
                toast.error(`${err.response.data.message}`);
            });
    };

    const searchsender = () => {
        if (search.trim() !== '') {
            http.get(`/product/usersearch/search?search=${search}&userId=${user.id}`).then((res) => {
                setproduct(res.data);
            });
        }
    };

    



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
        




        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow style={{ backgroundColor: "#ff0000" }}>
                            <TableCell>No</TableCell>
                            <TableCell>User Name</TableCell>
                            <TableCell>User Phone</TableCell>
                            <TableCell>Product Name</TableCell>
                            {/* <TableCell>Product Cat meow</TableCell> */}
                            <TableCell>Product Points</TableCell>
                            <TableCell>Redeemed Date</TableCell>

                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {productlist.map((data, index) => (
                            <TableRow key={index}>
                                <TableCell>{data.id}</TableCell>
                                <TableCell>{data.username}</TableCell>
                                <TableCell>{data.userphone}</TableCell>
                                <TableCell>{data.productname}</TableCell>
                                {/* <TableCell>{data.productCat}</TableCell> */}
                                <TableCell>{data.usedpoint}</TableCell>
                                <TableCell>{dayjs(data.redeemdate).format(global.datetimeFormat)}</TableCell>

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

export default UserProduct;