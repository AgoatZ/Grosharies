import * as React from "react";
import { Link, Grid, Box, Typography, Container, TextField, CssBaseline, Avatar, Button } from "@mui/material";
import VerifiedUserOutlined from "@mui/icons-material/VerifiedUserRounded";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import validator from "validator";
import axios from "../../utils/axios";
import serverRoutes from "../../utils/server-routes";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Cookies from "universal-cookie";
import { GoogleLogin } from 'react-google-login';

const theme = createTheme();
const MySwal = withReactContent(Swal);
const cookies = new Cookies();

export default function Login(props) {
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
        });
        setTimeout(() => {
          cookies.set("jwt_token", res.data.accessToken, { httpOnly: false });
          props.LoginUser();
        }, 1000);
      })
      .catch((e) => {
        console.log(e);
        MySwal.fire({
          text: "Wrong Username or Password, Please try again",
          icon: "warning",
        });
      });
  };

  // const responseGoogle = (response) => {
  //   console.log(response);
  //   axios
  //     .get(serverRoutes.Google)
  //     .then((res) => {
  //       MySwal.fire({
  //         text: "Signed in Successfully",
  //         icon: "success",
  //         showConfirmButton: false,
  //       });
  //       setTimeout(() => {
  //         cookies.set("jwt_token", res.data.accessToken, { httpOnly: false });
  //         // props.LoginUser();
  //         window.location.replace('/');
  //       }, 1000);
  //     })
  //     .catch((e) => {
  //       console.log('error: ' + e);
  //     });
  // }

  const onSuccess = (res) => {
    console.log('[Login Success] res: ', res);
    console.log('[Login Success] currentUser: ', res.profileObj);
    setTimeout(() => {
      cookies.set("jwt_token", res.tokenId, { httpOnly: false });
      // props.LoginUser();
    }, 1000);
  };

  const onFailure = (res) => {
    console.log('[Login Failure] res: ', res);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md" sx={{ width: "400px" }}>
        <CssBaseline />

        <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography component="h1" variant="h3">
            Sign In
          </Typography>

          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>

            <Box sx={{ margin: '30px auto' }}>
              <GoogleLogin
                clientId='371023795781-dm935fqefbjar2dvpt5fb5tq229qdjrl.apps.googleusercontent.com'
                buttonText='Continue With Google'
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
              />
            </Box>

            <Typography variant="h5" sx={{ margin: '20px 43%' }}>
              Or
            </Typography>

            <Avatar sx={{ m: '20px auto', bgcolor: "secondary.main" }}>
              <VerifiedUserOutlined />
            </Avatar>
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
    </ThemeProvider>
  );
}
