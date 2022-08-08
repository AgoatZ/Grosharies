import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import axios from "./utils/axios";
import { UserDummy } from "./utils/dummies";
import { createNotificationSocket, createSocket } from './utils/socket';
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
import Leaderboard from "./components/leaderboard/Leaderboard";
import Profile from "./components/profile/Profile";
import MyOrders from "./components/myOrders/MyOrders";
import MyPosts from "./components/myPosts/MyPosts";
import Layout from "./components/layout/Layout";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import GroceryDetails from "./components/groceries/GroceryDetails";

iconsLibrary.add(fas, far);

export const AppContext = createContext();

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(UserDummy);
  const [userNotifications, setUserNotifications] = useState([]);

  useEffect(() => {
    axios.get("auth/isLoggedIn").then(() => { userSetup(); })
      .catch(e => { console.log("Error getting isLoggedIn"); setLoggedIn(false); });
    // eslint-disable-next-line
  }, []);

  //User's info from API        
  const userSetup = () => {
    axios.get('/users/profile/current').then(res => {
      let userData = res.data.user;
      setLoggedIn(true);
      setUserData(userData);
      setUserNotifications(userData.notifications.reverse());
      socketSetup(userData);
      sessionStorage.setItem('userId', userData._id);
    }).catch(e => { console.log("Error getting user data"); });
  };

  //Socket Setup
  const socketSetup = (userData) => {
    createSocket(userData._id).connect();
    createNotificationSocket(userData._id).connect()
      .on('New Notification', (notification) => {
        userData.notifications.unshift(notification);
        setUserNotifications([...userData.notifications]);    //Array wont render fix - the spread operator creates a copy on a new memory reference
      });
  }

  const loginUser = () => {
    setLoggedIn(true);
    axios.get('/users/profile/current').then(res => {
      setUserData(res.data.user)
    });
    window.location.replace("/");
  };

  const logoutUser = () => {
    setLoggedIn(false);
    window.location.replace("/");
  };

  //All Routes Componentes are nested under Layout->Outlet
  return (
    <AppContext.Provider value={{ loggedIn, userData, userNotifications, logoutUser, setUserData, }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="post/:id" element={<Post />} />
            <Route path="groceries" element={<Groceries />} />
            <Route path="events" element={<Events />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="groceries/:name" element={<GroceryDetails />} />
            <Route path="profile" element={<Profile />} />
            <Route path="my-posts" element={<MyPosts />} />
            <Route path="my-orders" element={<MyOrders />} />
            <Route path="about" element={<About />} />
            <Route path="login" element={<Login loginUser={loginUser} />} />
            <Route path="register" element={<Register loginUser={loginUser} />} />
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
};

const NoMatch = () => {
  return (
    <Container>
      <Typography variant="h2">Nothing to see here!</Typography>
      <Typography variant="p"><Link to="/">Go to the home page</Link></Typography>
    </Container>
  );
};

export default App;
