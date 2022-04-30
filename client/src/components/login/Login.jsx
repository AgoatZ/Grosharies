import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import VerifiedUserOutlined from "@mui/icons-material/VerifiedUserRounded";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import validator from "validator";
import axios from "../../utils/axios";
import serverRoutes from "../../utils/server-routes";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const theme = createTheme();
const MySwal = withReactContent(Swal);

export default function Login(props) {
  const [isValid, setIsValid] = React.useState(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("emailAddress"),
      password: data.get("password"),
      serverRoutes,
    });

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
          showConfirmButton: false
        });
        setTimeout(() => {
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

  return (
    <ThemeProvider theme={theme}>
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
              <Grid item >
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
