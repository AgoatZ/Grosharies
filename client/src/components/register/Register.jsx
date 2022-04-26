
import * as React from 'react';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "../../utils/axios";
import serverRoutes from '../../utils/server-routes';
import validator from 'validator';



const theme = createTheme();

export default function Register() {
  const [isEmailValid, setIsValid] = React.useState(true);
  const [isPasswordValid, setPassword] = React.useState(true);

  const handleSubmit = (event) => {
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    axios.post(serverRoutes.Register, {
      emailAddress: data.get('email'),
      firstName: data.get('firstName'),
      lastName: data.get('lastName'),
      phone: data.get('phone'),
      password: data.get('password'),
    }).then((res) => {
      console.log(res.data)
    }).catch((e) => console.log(e))

  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  type="text"
                  name="firstName"
                  inputProps={{ maxLength: 12 }}
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="text"
                  inputProps={{ maxLength: 12 }}
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  error={!isEmailValid}
                  onChange={(e) => {
                    if (!validator.isEmail(e.target.value))
                      setIsValid(false)
                    else
                      setIsValid(true)
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
                    name: 'phone',
                    required: true,
                    autoFocus: true
                  }}
                  country={'il'}
                  inputStyle={{ width: "100%", height: "56px" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={!isPasswordValid}
                  required
                  fullWidth
                  onBlur={(e) => {
                    console.log(e.target.value);
                    // min 8 chars with at least one number and one letter
                    let isPasswordValid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(e.target.value);
                    setPassword(isPasswordValid);
                  }}
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
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
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}