import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Container } from "@mui/material";
import axios from "./utils/axios";
//FontAwesome Icons Setup
import { library as iconsLibrary } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
//Routs Components
import Home from "./components/home/Home";
import Post from "./components/post/Post";
import About from "./components/about/About";
import Groceries from "./components/groceries/Groceries";
import Events from "./components/events/Events";
import Profile from "./components/profile/Profile";
import MyOrders from "./components/myOrders/MyOrders";
import MyPosts from "./components/myPosts/MyPosts";
import Layout from "./components/layout/Layout";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import GroceryDetails from "./components/groceries/GroceryDetails";
import MyOrderDetails from "./components/myOrders/MyOrderDetails";

iconsLibrary.add(fas, far);

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    axios
      .get("auth/isLoggedIn").then(() => setLoggedIn(true))
      .catch(() => setLoggedIn(false));
  },
    []);

  const LoginUser = () => {
    setLoggedIn(true);
    window.location.replace("/");
  };

  const logoutUser = () => {
    setLoggedIn(false);
    window.location.replace("/");
  };

  //All Routes Componentes are nested under Layout->Outlet
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout loggedIn={loggedIn} logoutUser={logoutUser} />}>
          <Route index element={<Home />} />
          <Route path="post/:id" element={<Post />} />
          <Route path="groceries" element={<Groceries />} />
          <Route path="events" element={<Events />} />
          <Route path="groceries/:name" element={<GroceryDetails />} />
          <Route path="profile" element={<Profile />} />
          <Route path="my-posts" element={<MyPosts />} />
          <Route path="my-orders" element={<MyOrders />} />
          <Route path="my-order-details" element={<MyOrderDetails />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login LoginUser={LoginUser} />} />
          <Route path="register" element={<Register />} />
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
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </Container>
  );
};

export default App;
