import * as React from "react";
import { Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Link, Grid, Box, Typography, Container } from "@mui/material";
import VerifiedUserOutlined from "@mui/icons-material/VerifiedUserRounded";
import validator from "validator";
import axios from "../../utils/axios";
import serverRoutes from "../../utils/server-routes";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Cookies from "universal-cookie";
import jwt from 'jwt-decode' // import depende

const MySwal = withReactContent(Swal);
const cookies = new Cookies();

export default function Login({ loginUser }) {
  const [isValid, setIsValid] = React.useState(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const emailAddress = data.get("emailAddress");
    const password = data.get("password");

    axios
      .post(serverRoutes.Login, {
        emailAddress,
        password,
      })
      .then((res) => {
        MySwal.fire({
          text: "Signed in Successfully",
          icon: "success",
          showConfirmButton: false,
          backdrop: false
        });
        setTimeout(() => {
          cookies.set("jwt_token", res.data.accessToken, { httpOnly: false });
          const userAccessToken = jwt(res.data.accessToken); // decode your token here
          console.log(userAccessToken);
          console.log(res.data);
          loginUser();
        }, 1000);
      })
      .catch((e) => {
        console.log(e);
        MySwal.fire({
          text: "Wrong Username or Password, Please try again",
          icon: "warning",
          backdrop: false
        });
      });
  };

  return (
    <Container component="main" maxWidth="md" sx={{ width: "400px" }}>
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
          <VerifiedUserOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 3 }}
        >
          <Grid item xs={12} sx={{ mb: 2 }}>
            <TextField
              required
              fullWidth
              error={!isValid}
              onChange={(e) => {
                if (!validator.isEmail(e.target.value)) setIsValid(false);
                else setIsValid(true);
              }}
              type="email"
              id="email"
              label="Email Address"
              name="emailAddress"
              autoComplete="email"
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
            />
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container justifyContent="center">
            <Grid item>
              <Link href="/register" variant="body2">
                not have an account yet? Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
