import * as React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Link, Grid, Box, Typography, Container } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import axios from "../../utils/axios";
import serverRoutes from "../../utils/server-routes";
import validator from "validator";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Cookies from "universal-cookie";

const alertStyle = {
  color: "red",
};

const MySwal = withReactContent(Swal);
const cookies = new Cookies();

export default function Register({ loginUser }) {
  const [isEmailValid, setIsEmailValid] = React.useState(true);
  const [passwordError, setPasswordError] = React.useState("");
  const [firstNameError, setFirstNameError] = React.useState("");
  const [lastNameError, setLastNameError] = React.useState("");
  const [termsError, setTermsError] = React.useState(false);

  const handleSubmit = (event) => {
    const data = new FormData(event.currentTarget);

    const emailAddress = data.get("email");
    const firstName = data.get("firstName");
    const lastName = data.get("lastName");
    const phone = data.get("phone");
    const password = data.get("password");

    event.preventDefault();

    if (
      emailAddress === "" ||
      firstName === "" ||
      lastName === "" ||
      phone === "" ||
      password === ""
    ) {
      MySwal.fire({
        title: <strong>Something went wrong</strong>,
        text: "Some of the fields are empty",
        icon: "error",
      });
      return;
    }

    if (
      !isEmailValid ||
      passwordError !== "" ||
      firstNameError !== "" ||
      lastNameError !== ""
    ) {
      return;
    }

    if (!termsError) {
      MySwal.fire({
        title: <strong>Oops!</strong>,
        text: "You haven't agreed to the terms and conditions of the site",
        icon: "warning",
      });
      return;
    }

    //Perform registration
    axios
      .post(serverRoutes.Register, {
        emailAddress,
        firstName,
        lastName,
        phone,
        password,
      })
      .then((res) => {
        MySwal.fire({
          title: "Registered Successfully!",
          icon: "success",
          showConfirmButton: false,
          backdrop: false
        });
      })
      .then(() => {
        //Perform login
        axios.post(serverRoutes.Login, {
          emailAddress,
          password,
        })
          .then((res) => {
            setTimeout(() => {
              cookies.set("jwt_token", res.data.accessToken, { httpOnly: false });
              loginUser();
            }, 1000);
          });
      }).catch((e) => {
        MySwal.fire({
          title: <strong>Something Went Wrong</strong>,
          icon: "error",
        });
        console.log(e);
      });
  };

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                error={firstNameError !== ""}
                autoComplete="given-name"
                type="text"
                name="firstName"
                inputProps={{ maxLength: 12 }}
                required
                fullWidth
                id="firstName"
                label="First Name"
                onBlur={(e) => {
                  if (e.target.value.length < 2) {
                    setFirstNameError(
                      "First name must be at least 2 characters"
                    );
                  } else {
                    setFirstNameError("");
                  }
                }}
              />
              {firstNameError ? (
                <label style={alertStyle}>{firstNameError}</label>
              ) : null}
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                error={lastNameError !== ""}
                required
                fullWidth
                type="text"
                inputProps={{ maxLength: 12 }}
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                onBlur={(e) => {
                  if (e.target.value.length < 2) {
                    setLastNameError(
                      "Last name must be at least 2 characters"
                    );
                  } else {
                    setLastNameError("");
                  }
                }}
              />
              {lastNameError ? (
                <label style={alertStyle}>{lastNameError}</label>
              ) : null}
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                error={!isEmailValid}
                onChange={(e) => {
                  if (!validator.isEmail(e.target.value))
                    setIsEmailValid(false);
                  else setIsEmailValid(true);
                }}
                type="email"
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <PhoneInput
                inputProps={{
                  name: "phone",
                  required: true,
                  autoFocus: true,
                }}
                country={"il"}
                inputStyle={{ width: "100%", height: "56px" }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                error={passwordError !== ""}
                onBlur={(e) => {
                  let isPasswordValid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(
                    e.target.value
                  );
                  if (!isPasswordValid) {
                    setPasswordError(
                      "Password must be at least 8 characters and contain characters and numbers"
                    );
                  } else {
                    setPasswordError("");
                  }
                }}
              />
              {passwordError ? (
                <label style={alertStyle}>{passwordError}</label>
              ) : null}
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTermsError(true);
                      } else {
                        setTermsError(false);
                      }
                    }}
                    value="allowExtraEmails"
                    color="primary"
                  />
                }
                label="I agree to the terms and conditions."
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="center" >
            <Grid item >
              <Link href="/login" variant="body2" >
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
