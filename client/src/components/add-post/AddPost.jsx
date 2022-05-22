import * as React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "../../utils/axios";
import serverRoutes from "../../utils/server-routes";
import validator from "validator";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const theme = createTheme();

const alertStyle = {
  color: "red",
};

const MySwal = withReactContent(Swal);

export default function AddPost() {
  const [isHeadlineError, setIsHeadlineError] = React.useState(false);

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

    // if (
    //   !isEmailValid ||
    //   passwordError !== "" ||
    //   firstNameError !== "" ||
    //   lastNameError !== ""
    // ) {
    //   return;
    // }

    // if (!termsError) {
    //   MySwal.fire({
    //     title: <strong>Oops!</strong>,
    //     text: "You haven't agreed to the terms and conditions of the site",
    //     icon: "warning",
    //   });
    //   return;
    // }

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
          title: <strong>Registered Successfully!</strong>,
          icon: "success",
        });
        console.log(res.data);
      })
      .catch((e) => {
        MySwal.fire({
          title: <strong>Something Went Wrong</strong>,
          icon: "error",
        });
        console.log(e);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
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
            Add Post
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  error={!isHeadlineError}
                  onChange={(e) => {
                  }}
                  type="text"
                  id="headline"
                  label="Headline"
                  name="headline"
                  autoComplete="headline"
                />
              </Grid>
              
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add Post
            </Button>
            
          </Box>
        </Box>
      </Container>
    </ThemeProvider >
  );
}
