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



function UserPoint() {

    const [pointrecordlist, setPointrecord] = useState([]);
    const [oripointrecordlist, setOriPointrecord] = useState([]);
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
        console.log(user);
        http.get(`/point/get/${user.phone}`).then((res) => {
            setOriPointrecord(res.data);
            setPointrecord(res.data);
            setbutton('all');

        })
            .catch(function (err) {
                toast.error(`${err.response.data.message}`);
            });
    };

    const searchsender = () => {
        if (search.trim() !== '') {
            http.get(`/point/search?search=${search}&userId=${user.phone}&username=${user.name}`).then((res) => {
                setPointrecord(res.data);
            });
        }
    };

    const OnClickAll = () => {
        setbutton("all");
        setPointrecord(oripointrecordlist);
    }

    const OnClickSent = () => {
        setbutton("sent");
        setPointrecord(oripointrecordlist);
        const filter_sent = oripointrecordlist.filter((data) => data.sender == user.phone);
        setPointrecord(filter_sent);
    }

    const OnClickReceive = () => {
        setbutton("receive");
        setPointrecord(oripointrecordlist);
        const filter_sent = oripointrecordlist.filter((data) => data.recipient == user.phone);
        setPointrecord(filter_sent);
    }




    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2, color: 'black', fontWeight: 'bold' }}>
                Point History
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
                    Sent
                </Button>
                <Button variant="contained" style={{
                    marginRight: '10px',
                    ...(button === 'receive' ? { color: '#7DF9FF', backgroundColor: '#088F8F' } : { color: '#7393B3', backgroundColor: '#7DF9FF' })
                }}
                    onClick={OnClickReceive}>
                    Received
                </Button>
            </Box>




            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow style={{ backgroundColor: "#ff0000" }}>
                                <TableCell>Sender Name</TableCell>
                                <TableCell>Sender No</TableCell>
                                <TableCell>Recipient Name</TableCell>
                                <TableCell>Recipient No</TableCell>
                                <TableCell>Points</TableCell>
                                <TableCell>Transfer Date</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {pointrecordlist
                                .sort((a, b) => new Date(b.transferpointdate) - new Date(a.transferpointdate)) // Sort by transferpointdate in descending order (latest to earliest)
                                .map((data, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{data.senderName}</TableCell>
                                        <TableCell>{data.sender}</TableCell>
                                        <TableCell>{data.recipientName}</TableCell>
                                        <TableCell>{data.recipient}</TableCell>


                                        {data.sender == user.phone ? <TableCell sx={{ color: '#ff6666', fontWeight: 'bold' }}>{data.transferpoint}</TableCell> : <TableCell sx={{ color: '#00cc66', fontWeight: 'bold' }}>{data.transferpoint}</TableCell>}

                                        <TableCell>{dayjs(data.transferpointdate).format(global.datetimeFormat)}</TableCell>
                                        {/* <TableCell>
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

export default UserPoint;