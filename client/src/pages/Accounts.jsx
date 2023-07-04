import React, { useEffect, useState } from "react";
import http from "../http";
import { Button, InputAdornment, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import global from "../global";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  tableCellClasses,
} from "@mui/material";

function Accounts() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const SearchBar = styled(TextField)`
    margin-bottom: 16px;
  `;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    http
      .get("/user")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteUser = (userId) => {
    http
      .delete(`/user/${userId}`)
      .then((res) => {
        console.log(res.data);
        fetchUsers(); // Refresh the users after deleting
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const filterUsers = (users) => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleUsers = filterUsers(users).slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "purple",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const handleSearch = () => {
    fetchUsers();
  };
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);


  const handleDeleteUser = (userId) => {
    deleteUser(userId);
    setOpenDialog(false);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };


  return (
    <div>
      <h1>Accounts</h1>
      <SearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button className="appbarbutton" onClick={handleSearch}>
                <SearchIcon />
              </Button>
            </InputAdornment>
          ),
        }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Phone Number</StyledTableCell>
              <StyledTableCell>Points</StyledTableCell>
              <StyledTableCell>Created At</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleUsers.map((user, index) => (
              <StyledTableRow
                key={user.id}
                className={
                  index % 2 === 0
                    ? "accounts-table-row-even"
                    : "accounts-table-row-odd"
                }
              >
                <StyledTableCell>{user.id}</StyledTableCell>
                <StyledTableCell>{user.name}</StyledTableCell>
                <StyledTableCell>{user.email}</StyledTableCell>
                <StyledTableCell>{user.phoneNumber}</StyledTableCell>
                <StyledTableCell>{user.points}</StyledTableCell>
                <StyledTableCell>
                  {dayjs(user.createdAt).format(global.datetimeFormat)}
                </StyledTableCell>
                <StyledTableCell>
                  <Link to={`/editadmin/${user.id}`}>
                    <Button className="appbarbutton">
                      <EditIcon />
                    </Button>
                  </Link>
                  {user.email !== "admin@gmail.com" && (
                    <Button
                      className="appbarbutton"
                      onClick={() => handleOpenDialog(user)}
                    >
                      <DeleteIcon />
                    </Button>
                  )}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filterUsers(users).length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the user with ID:{" "}
            {selectedUser && selectedUser.id}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => handleDeleteUser(selectedUser.id)}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Accounts;
