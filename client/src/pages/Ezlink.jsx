import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import UserContext from '../contexts/UserContext';

function Ezlink() {
  const { user } = useContext(UserContext);
  const [ezlinkList, setEzlinkList] = useState([]);
  const [search, setSearch] = useState('');
  const [dataFetched, setDataFetched] = useState(false);
  var filteredEzlinkList = ezlinkList;
  var userid = null;
  if (user) {
    // console.log(user.name);
     
  // console.log(user.id);
    userid = user.id;
    
  }

  filteredEzlinkList = ezlinkList.filter((ezlink) => ezlink.userId === userid);
  const uniqueEzlinkList = [];
  filteredEzlinkList.forEach((ezlink) => {
    const canExists = uniqueEzlinkList.some((item) => item.CAN === ezlink.CAN);
    if (!canExists) {
      uniqueEzlinkList.push(ezlink);
    }
  });
  let topuplist = uniqueEzlinkList.filter((ezlink) => ezlink.balance < 5 && ezlink.service === 'true')
  const autotopup = async(topuplist) =>{
 for(let i = 0; i < topuplist.length; i++){
  let cardNo = topuplist[i].cardNo;
  let balance = topuplist[i].balance;
  let CAN = topuplist[i].CAN;
  
  let updatedData = {
    cardNo: cardNo,
    topupamount: 5,
    balance: balance + 5,
    service: 'true',
    userId: userid,
    CAN : CAN,
  };
  try {
    http.post("/ezlink", updatedData)
    const response2 = await http.get(`/topup/${cardNo}`);
    if (5 > response2.data.balance) {
      alert('Your ezlink card '+ topuplist[i].CAN +' has not enough balance, and your credit card '+ cardNo.slice(0, 4)+'********'+cardNo.slice(12)+' has not enough balance to topup too.')
      return;
    }
    let newbalance = parseFloat(response2.data.balance) - 5;
    http.put(`/topup/${cardNo}`, { newbalance: parseFloat(newbalance) })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.error('Error updating balance:', err);
        // Handle error if needed
      });
  } catch (error) {
    console.error('Error checking card number:', error);
    return;
  }

 }

  };
  


  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };


  const getEzlink = async () => {
    try {
      const res = await http.get('/ezlink');
      setEzlinkList(res.data);
      setDataFetched(true); 
    } catch (error) {
      
    }
  };

  const searchEzlink = () => {
    http.get(`/ezlink/?search=${search}`).then((res) => {
      const sortedData = res.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setEzlinkList(sortedData);
    });
  };
 
  useEffect(() => {
    if (!dataFetched) {
      // Call getEzlink only if data fetching is not done yet
      getEzlink();
    }
    
      const filteredEzlinkList = ezlinkList.filter((ezlink) => ezlink.userId === userid);
      const uniqueEzlinkList = [];
      filteredEzlinkList.forEach((ezlink) => {
        const canExists = uniqueEzlinkList.some((item) => item.CAN === ezlink.CAN);
        if (!canExists) {
          uniqueEzlinkList.push(ezlink);
        }
      });
  
      const topuplist = uniqueEzlinkList.filter((ezlink) => ezlink.balance < 5 && ezlink.service === 'true');
      autotopup(topuplist); 


  }, [ezlinkList,dataFetched]);
  


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



  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Ezlink
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
      {user && (
        <Link to="/AddEzlink" style={{ textDecoration: 'none', display: 'left' }}>
          <Button
            variant="contained"
            style={{
              width: '275px',
              paddingTop: '50px',
              paddingBottom: '50px',
              marginBottom: '50px',
            }}
          >
            Add new card
          </Button>
        </Link>
      )}
      <Typography variant="body1" style={{ float: 'right', marginRight: '300px', fontSize: '2em' }}>Top-up History</Typography>
      <br />

      <br />

      <Grid container spacing={2}>


        <Grid item xs={12} md={5} lg={4}>
          <Grid container spacing={2}>
            {Array.isArray(uniqueEzlinkList) && uniqueEzlinkList.length > 0 ? (
              uniqueEzlinkList.map((ezlink, i) => (
                <Link to={`/useezlink/${ezlink.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }} key={ezlink.id}>
                  <Grid item xs={12} md={6} lg={4}>
                    <Card style={{ width: '300px', marginRight: '40px', marginBottom: '50px', display: 'block', marginLeft: '18px', float: 'left' }}>
                      <CardContent style={{ display: 'block' }}>
                        <Box sx={{ display: 'block', mb: 1 }}>
                          <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            CAN: {ezlink.CAN}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                          <AccountCircle sx={{ mr: 1 }} />
                          <Typography>{ezlink.id || 'No user'}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                          <AccessTime sx={{ mr: 1 }} />
                          <Typography>{dayjs(ezlink.createdAt).format(global.datetimeFormat)}</Typography>
                        </Box>
                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                          Credit card No.: {ezlink.cardNo.slice(0, 4)}********{ezlink.cardNo.slice(12)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Link>
              ))
            ) : (
              <Typography variant="body1">No Ezlinks found.</Typography>
            )}
          </Grid>
        </Grid>

        <Grid item xs={12} md={4} lg={8} style={{ width: '1000px' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label='sticky table' style={{ border: 'solid' }}>
              <TableHead>
                <TableRow>
                  <TableCell align="center">ID</TableCell>
                  <TableCell align="center">CAN</TableCell>
                  <TableCell align="center">Credit Card No.</TableCell>
                  <TableCell align="center">Balance ($)</TableCell>
                  <TableCell align="center">Top-up amount ($)</TableCell>
                  <TableCell align="center">Top-up Time</TableCell>
                  <TableCell align="center">Auto service (ON)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(filteredEzlinkList) && filteredEzlinkList.length > 0 ? (
                  filteredEzlinkList.map((ezlink, i) => (
                    <TableRow key={ezlink.id}>
                      <TableCell align="center">{ezlink.id}</TableCell>
                      <TableCell align="center">{ezlink.CAN}</TableCell>
                      <TableCell align="center">{ezlink.cardNo.slice(0, 4)}********{ezlink.cardNo.slice(12)}</TableCell>
                      <TableCell align="center">{ezlink.balance.toFixed(2)}</TableCell>
                      <TableCell align="center">{ezlink.topupamount.toFixed(2)}</TableCell>
                      <TableCell align="center">{new Date(ezlink.createdAt).toString().split('T')[0]}</TableCell>
                      <TableCell align="center">{ezlink.service}</TableCell>
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


    </Box>
  );
}

export default Ezlink;