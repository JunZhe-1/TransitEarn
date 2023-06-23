import React, { useEffect, useState, useContext, navigate } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, Card, CardContent, Input, IconButton, Button,
  Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell
  , Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { AccountCircle, AccessTime, Search, Settings, Clear, Visibility, Edit, Delete, Block } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';

function AdminPoint() {
  const navigate = useNavigate();
  const [pointList, setpointrecord] = useState([]);
  const [search, setSearch] = useState('');
  const [selectrefundid, setrefund] = useState('');


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
    if (search.trim() !== '') {

      http.get(`/point/search?search=${search}`).then((res) => {
        setpointrecord(res.data);
      });
    }

  };


  const refundProcess = () => {
    if (selectrefundid) {
      http.put(`/point/refund/${selectrefundid}`)
        .then((res) => {
          searchsender(res.data);
          getpointrecord();
          handleClose(false);
          navigate("/adminpoint");


        })
        .catch(function (err) {
          toast.error(`${err.response.data.message}`);
        });
    }

  };

  const [open, setOpen] = useState(false);

  const handleOpen = (id) => {
    setOpen(true);
    setrefund(id);
  };

  const handleClose = () => {
    setrefund(null);
    setOpen(false);
  };

  const [open1, setOpen1] = useState(false);
  const [senderinfo, setsenderinfo] = useState('');
  const handleOpen1 = (id) => {
    http.get(`/user/getId/${id}`).then((res) => {
      setsenderinfo(res.data);
      setOpen1(true);

    })
      .catch(function (err) {
        toast.error(`${err.response.data.message}`);
      });;

  };

  const handleClose1 = () => {
    setOpen1(false);
  };


  const deletePointrecord = (id) => {
    http.delete(`/point/remove/${id}`)
      .then((res) => {
        console.log(res.data);
        setOpen(false);
        getpointrecord();
      });
  }


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
                <TableCell>Refund</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {pointList.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>{data.senderName}<IconButton color="primary" onClick={() => handleOpen1(data.sender)}><Visibility /></IconButton></TableCell>
                  <TableCell>{data.sender}</TableCell>
                  <TableCell>{data.recipientName}</TableCell>
                  <TableCell>{data.recipient}</TableCell>
                  <TableCell>{data.transferpoint}</TableCell>
                  <TableCell>{dayjs(data.transferpointdate).format(global.datetimeFormat)}</TableCell>
                  <TableCell>
                    {data.Status === 'yes' ? (
                      <IconButton color="primary"
                        onClick={() => handleOpen(data.id)}>
                        <Clear />
                      </IconButton>) : <IconButton color="primary"><Block /></IconButton>}
                  </TableCell>

                  <TableCell>
                    {data.Status === 'yes' ? (
                      <Link to={`/pointedit/${data.id}`} >
                        <IconButton color="primary" >
                          <Settings />
                        </IconButton>
                      </Link>) : <Link to={`/pointedit/${data.id}`} ><IconButton color="primary"><Visibility /></IconButton></Link>}
                  </TableCell>


                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Refund Point
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to Refund this transaction?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit"
            onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error"
            onClick={refundProcess}>
            Refund
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={open1} onClose={handleClose1}>
        <Box>
          <DialogTitle style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '25px' }}>
            Sender Information
          </DialogTitle>
          <DialogContent sx={{ padding:'100px' }}>

            <Table sx={{ border: '1px solid black',width: '100%', height: '500px'}}>
            <TableBody>
              <TableRow >
                <TableCell rowSpan={3} sx={{borderBottom:'1px solid black'}}><AccountCircle sx={{ fontSize: '100px', paddingRight: '16px' }} /></TableCell>
                <TableCell  sx={{borderBottom:'none'}}>Lucas</TableCell>
               
              
              </TableRow>
              <TableRow>
                <TableCell sx={{borderBottom:'none'}}>Lucas@gmail</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{borderBottom:'1px solid black'}}>100 point</TableCell>
              </TableRow>
              <TableRow>
                <TableCell >100 point</TableCell>
              </TableRow>
            </TableBody>
                  

              {/* <TableRow>
                  <Box sx={{ borderBottom: '1px solid black', width: '100%', display: 'flex', alignItems: 'center' }}>
                    <AccountCircle sx={{ fontSize: '100px', paddingRight: '16px' }} />
                    <TableCell>
                      <TableRow>
                        <TableCell><Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>{senderinfo.name}</Typography></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{senderinfo.email}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{senderinfo.point}</TableCell>
                      </TableRow>
                    </TableCell>
                  </Box>
                </TableRow>

                <TableRow>
                  <Box sx={{ width: '100%', display: 'flex', textAlign: 'center' }}>
                    <TableCell>
                      <TableRow >
                        <TableCell >
                          <b sx={{ fontWeight: 'bold' }}>Phone:</b>{senderinfo.phone}
                        </TableCell>
                      </TableRow >
                      <TableRow >
                        <TableCell ><b sx={{ fontWeight: 'bold' }}>Email:</b>{senderinfo.email}</TableCell>
                      </TableRow>
                    </TableCell>
                  </Box>
                </TableRow> */}
            </Table>

          </DialogContent>
          <DialogActions style={{ justifyContent: 'center' }}>
            <Button variant="contained" color="inherit" onClick={handleClose1}>
              Close
            </Button>


          </DialogActions></Box>
      </Dialog>
      <ToastContainer /> </Box>

  );
}

export default AdminPoint;