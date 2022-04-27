import React from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Container } from "@mui/material";
//FontAwesome Icons Setup
import { library as iconsLibrary} from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
//Routs Components
import Home from './components/home/Home';
import Post from './components/post/Post';
import About from "./components/about/About";
import Groceries from './components/groceries/Groceries';
import Events from './components/events/Events';
import Profile from './components/profile/Profile';
import Account from './components/account/Account';
import Layout from './components/layout/Layout';
import Login from './components/login/Login';

iconsLibrary.add(fas,far);

const App = () => {
  //All Routs Componentes are nested under Layout->Outlet
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<Home />} />
          <Route path="post/:id" element={<Post />} />
          <Route path="groceries" element={<Groceries />} />
          <Route path="events" element={<Events />} />
          <Route path="profile" element={<Profile />} />
          <Route path="account" element={<Account />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login/>} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </BrowserRouter>
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
