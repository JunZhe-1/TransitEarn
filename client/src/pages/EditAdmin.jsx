import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import http from "../http";
import { Box, Typography, TextField, Button } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditAdmin() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    point: 0,
  });

  useEffect(() => {
    http
      .get(`/user/${id}`)
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const formik = useFormik({
    initialValues: user,
    enableReinitialize: true,
    validationSchema: yup.object({
      name: yup
        .string()
        .trim()
        .matches(/^[a-z ,.'-]+$/i, "Invalid name")
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name must be at most 50 characters")
        .required("Name is required"),
      email: yup
        .string()
        .trim()
        .email("Enter a valid email")
        .max(50, "Email must be at most 50 characters")
        .required("Email is required"),
      phone: yup
        .string()
        .trim()
        .matches(
          /[6|8|9]\d{7}|\+65[6|8|9]\d{7}|\+65\s[6|8|9]\d{7}/g,
          "Invalid phone number"
        )
        .required("Phone number is required"),
      point: yup
        .number()
        .max(99999999, "Points cant exceed 99999999")
        .required("Points is required"),
    }),
    onSubmit: (data) => {
      data.name = data.name.trim();
      data.email = data.email.trim().toLowerCase();
      data.phone = data.phone.trim();
      http
        .put(`/user/${id}`, data)
        .then((res) => {
          console.log(res.data);
          navigate("/accounts");
        })
        .catch(function (err) {
          toast.error(`${err.response.data.message}`);
        });
    },
  });

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteUser = () => {
    http
      .delete(`/user/${id}`)
      .then((res) => {
        console.log(res.data);
        localStorage.removeItem("token");
        setUser(null);
        navigate("/accounts");
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" className="heading" sx={{ my: 2 }}>
        Account Settings
      </Typography>
      <Box
        component="form"
        sx={{ maxWidth: "500px" }}
        onSubmit={formik.handleSubmit}
      >
        <TextField
          fullWidth
          margin="normal"
          autoComplete="off"
          label="Name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <TextField
          fullWidth
          margin="normal"
          autoComplete="off"
          label="Email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          fullWidth
          margin="normal"
          autoComplete="off"
          label="Phone Number"
          name="phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
          error={
            formik.touched.phone && Boolean(formik.errors.phone)
          }
          helperText={formik.touched.phone && formik.errors.phone}
        />
        <TextField
          fullWidth
          margin="normal"
          autoComplete="off"
          label="Points"
          name="points"
          value={formik.values.point}
          onChange={formik.handleChange}
          error={formik.touched.point && Boolean(formik.errors.point)}
          helperText={formik.touched.point && formik.errors.point}
        />
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" type="submit" color="primary" className="save">
            Save
          </Button>
          {user.email !== "admin@gmail.com" && (
            <Button
              variant="contained"
              sx={{ ml: 2 }}
              color="error"
              onClick={handleOpen}
              className="delete"
            >
              Delete Account
            </Button>
          )}
        </Box>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="error" onClick={deleteUser}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Box>
  );
}

export default EditAdmin;