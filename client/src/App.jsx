import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { Container } from "@mui/material";
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
});

const App = () => {

  return (
    <ThemeProvider theme={appTheme}>
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
    </ThemeProvider>
  );
};

const Layout = () => {
  const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);
  return (
    <div>
      <Header />
      <Offset />
      <Outlet />
      <Offset />
      <Footer />
    </div>
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
