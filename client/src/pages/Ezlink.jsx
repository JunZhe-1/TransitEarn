import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import UserContext from '../contexts/UserContext';



function Ezlink() {
  const {user} = useContext(UserContext);
  const [ezlinkList, setEzlinkList] = useState([]);
  const [search, setSearch] = useState('');
  var filteredEzlinkList = ezlinkList;
  var userid = null;
  if(user){
    console.log(user.name);
    console.log(user.id);
    userid = user.id;
    }
  filteredEzlinkList = ezlinkList.filter((ezlink) => ezlink.userId === userid);
  
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

  const accessToken = localStorage.getItem('accessToken');


  let userName = null;
  let userId = null;


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
        <Link to="/AddEzlink" style={{ textDecoration: 'none' }}>
          <Button variant="contained">Add</Button>
        </Link>
      </Box>

      <Grid container spacing={2}>
        {Array.isArray(filteredEzlinkList) && filteredEzlinkList.length > 0 ? (
          filteredEzlinkList.map((ezlink, i) => (
            
            <Grid item xs={12} md={6} lg={4} key={ezlink.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', mb: 1 }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      CAN: {ezlink.CAN}
                    </Typography>
                    <Link to={`/ezlink/${ezlink.id}`}>
                      <IconButton color="primary" sx={{ padding: '4px' }}>
                        <Edit />
                      </IconButton>
                    </Link>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                    <AccountCircle sx={{ mr: 1 }} />
                    <Typography>{userName || 'No user'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                    <AccessTime sx={{ mr: 1 }} />
                    <Typography>{dayjs(ezlink.createdAt).format(global.datetimeFormat)}</Typography>
                  </Box>
                  <Typography sx={{ whiteSpace: 'pre-wrap' }}>Credit card No.: {ezlink.cardNo.slice(0, 4)}********{ezlink.cardNo.slice(12)}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1">No Ezlinks found.</Typography>
        )}
      </Grid>
    </Box>
  );
}

export default Ezlink;
