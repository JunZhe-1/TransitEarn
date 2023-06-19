import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
    Box, Typography, Grid, Card, CardContent, Input, IconButton, Button,
    Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import UserContext from '../../contexts/UserContext';


function UserPoint() {

    const [tutorialList, setpointrecord] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);
    console.log(user);



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
        http.get('/point/get').then((res) => {
            setpointrecord(res.data);

        })
            .catch(function (err) {
                toast.error(`${err.response.data.message}`);
            });;
    };

    const searchsender = () => {
        http.get(`/point/search?search=${search}`).then((res) => {
            setpointrecord(res.data);
        });

    };


    const refund = (value) => {
        http.put(`/point/refund/${value}`)
            .then((res) => {
                searchsender(res.data);
            })
            .catch(function (err) {
                toast.error(`${err.response.data.message}`);
            });

    };



    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Tutorials
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
                            <TableRow>
                                <TableCell>Sender Name</TableCell>
                                <TableCell>Sender No</TableCell>
                                <TableCell>Recipient Name</TableCell>
                                <TableCell>Recipient No</TableCell>
                                <TableCell>Points</TableCell>
                                <TableCell>Transfer Date</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {tutorialList.map((data, index) => (
                                <TableRow key={index}>
                                    <TableCell>{data.senderName}</TableCell>
                                    <TableCell>{data.sender}</TableCell>
                                    <TableCell>{data.recipientName}</TableCell>
                                    <TableCell>{data.recipient}</TableCell>
                                    <TableCell>{data.transferpoint}</TableCell>
                                    <TableCell>{dayjs(data.transferpointdate).format(global.datetimeFormat)}</TableCell>
                                    <TableCell>
                                        {data.Status === 'yes' ? (
                                            <IconButton color="primary"
                                                onClick={() => refund(data.id)}>
                                                <Clear />
                                            </IconButton>) : null}
                                        {/* // <Link to={`/pointedit/${data.id}`} style={{ textDecoration: 'none' }}>
                    //   <IconButton color="primary" sx={{ padding: '4px' }}>
                    //     <Edit />
                        
                    //   </IconButton>
                    // </Link>):null} */}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper><ToastContainer /> </Box>

    );
}

export default UserPoint;