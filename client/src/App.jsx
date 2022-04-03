import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from './components/home/Home';
import Post from './components/post/Post';

const appTheme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#39ab8a',
    },
    secondary: {
      main: '#39abab',
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
            <Route path="post" element={<Post />} />
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
      <Footer />
    </div>
  );
};

const NoMatch = () =>{
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

export default App;
