import React, { useState, useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";
import http from "../http";
import { Box, Typography, TextField, Button } from "@mui/material";
import {Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditAccount() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    points: 0,
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
      phoneNumber: yup
        .string()
        .trim()
        .matches(
          /[6|8|9]\d{7}|\+65[6|8|9]\d{7}|\+65\s[6|8|9]\d{7}/g,
          "Invalid phone number"
        )
        .required("Phone number is required"),
      password: yup
        .string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .max(50, "Password must be at most 50 characters")
        .required("Password is required"),
      confirmPassword: yup
        .string()
        .trim()
        .required("Confirm password is required")
        .oneOf([yup.ref("password"), null], "Passwords must match"),
    }),
    onSubmit: (data) => {
      data.name = data.name.trim();
      data.email = data.email.trim().toLowerCase();
      data.phoneNumber = data.phoneNumber.trim();
      data.password = data.password.trim();
      http
        .put(`/user/${id}`, data)
        .then((res) => {
          console.log(res.data);
          navigate("/");
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
    http.delete(`/user/${id}`).then((res) => {
      console.log(res.data);
      localStorage.clear();
      setUser(null);
      navigate("/");
      window.location.reload();
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
          name="phoneNumber"
          value={formik.values.phoneNumber}
          onChange={formik.handleChange}
          error={
            formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
          }
          helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
        />
        <TextField
          fullWidth
          margin="normal"
          autoComplete="off"
          label="Password"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <TextField
          fullWidth
          margin="normal"
          autoComplete="off"
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          error={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword)
          }
          helperText={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
        />
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" type="submit" className="save">
            Save
          </Button>
          {user.email !== "admin@gmail.com" && (
            <Button
              variant="contained"
              sx={{ ml: 2 }}
              color="error"
              className="Delete"
              onClick={handleOpen}
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
          <Button variant="contained" color="inherit" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={deleteUser}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Box>
  );
}

export default EditAccount;
