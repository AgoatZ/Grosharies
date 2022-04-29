import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Grid } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "../header/Header";
import Footer from "../footer/Footer";

const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#39ab8a",
      light: "#45d1a8",
      dark: "#349e7f",
      contrastText: "#fff",
    },
    secondary: {
      main: "#39abab",
      light: "#45d1d1",
      dark: "#349e9e",
      contrastText: "#fff",
    },
  },
  typography: {
    fontFamily: ["'Quicksand'", "sans-serif"].join(","),
    button: {
      textTransform: "capitalize",
      fontSize: 16,
      letterSpacing: "0.07em",
    },
  },
});

const Layout = (props) => {
  const { loggedIn } = props;
  //User Data Setup

  const [userData, setUser] = useState(() => {
    //TODO: add request to get user's status and data

    const fakeUser = {
      firstName: "Ilan",
      lastName: "Rozenfeld",
      emailAddress: "Ilan@Walla.com",
      phone: "05000000000",
      accountType: "user",
      rank: 0,
      posts: [],
      profileImage: "/assets/ohad.png",
      collectedHistory: [],
    };

    return fakeUser;
  });

  return (
    <ThemeProvider theme={appTheme}>
      <Grid
        container
        direction="column"
        display="grid"
        height="100%"
        gridTemplateRows="auto 1fr auto"
      >
        <Grid item component="header">
          <Header loggedIn={loggedIn} userData={userData} />
        </Grid>
        <Grid item component="main">
          <Outlet context={{ loggedIn, userData }} />
        </Grid>
        <Grid item component="footer">
          <Footer />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Layout;
