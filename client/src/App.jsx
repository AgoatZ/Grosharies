import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid, Container } from "@mui/material";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from './components/home/Home';
import Post from './components/post/Post';
import About from "./components/about/About";

const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#39ab8a',
      light: '#45d1a8',
      dark: '#349e7f',
      contrastText: '#fff'
    },
    secondary: {
      main: '#39abab',
      light: '#45d1d1',
      dark: '#349e9e',
      contrastText: '#fff'
    },
  },
  typography: {
    fontFamily: ["'Quicksand'", 'sans-serif'].join(','),
    button: { textTransform: "capitalize", fontSize: 16, letterSpacing: '0.07em' },
  },
});

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<Home />} />
          <Route path="post/:id" element={<Post />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const Layout = () => {
  return (
    <ThemeProvider theme={appTheme}>
      <Grid
        component='layout'
        container
        direction="column"
        display='grid'
        height='100%'
        gridTemplateRows='auto 1fr auto'
      >
        <Grid item component='header'><Header /></Grid>
        <Grid item component='main'><Outlet /></Grid>
        <Grid item component='footer'><Footer /></Grid>
      </Grid>
    </ThemeProvider>
  );
};

const NoMatch = () => {
  return (
    <Container>
      <h2>Nothing to see here!</h2>
      <p><Link to="/">Go to the home page</Link></p>
    </Container>
  );
}

export default App;
