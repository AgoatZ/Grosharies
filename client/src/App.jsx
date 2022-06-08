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
import { io } from 'socket.io-client';

iconsLibrary.add(fas, far);

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    axios
      .get("auth/isLoggedIn").then(() => setUser())
      .catch(() => setLoggedIn(false));
  }, []);

  //#TODO SET UP A CLIENT WEBSOCKET
  useEffect(() => {
    let socket;
    if (process.env.NODE_ENV === "development") {
      socket = io('ws://localhost:5000', { autoConnect: false }); //Different Ports in Development
    } else if (process.env.NODE_ENV === "production") {
      socket = io({ autoConnect: false }); //Same Origin in Production
    }
    let usernameAlreadySelected;
    //#TODO SEND USER ID IF A USER LOGS/IS LOGGED IN
    const onUsernameSelection = (username) => {
      usernameAlreadySelected = true;
      socket.auth = { username };
      socket.connect();
    };
    //#TODO CHECK IF SESSION EXISTS IN LOCAL STORAGE ALREADY
    const created = () => {
      const sessionID = localStorage.getItem("sessionID");
      if (sessionID) {
        usernameAlreadySelected = true;
        socket.auth = { sessionID };
        socket.connect();
      } else {
        socket.connect();
      }
    };
    created();
    socket.on('connnection', () => {
      console.log('connected to server');
    });
    //socket.connect();
    //#TODO HANDLE PEND POST REQUEST NOTIFICATION
    socket.on('pend post notification', (notification) => {
      console.log(notification);
    });

    //#TODO HANLE TIMER NOTIFICATION
    //var el;
    socket.on('time', function (timeString) {
      //el = document.getElementById('server-time')
      //el.innerHTML = 'Server time: ' + timeString;
      console.log('Server time: ' + timeString);
    });

    //#TODO HANDLE DISCONNECTION
    socket.on('disconnect', () => {
      console.log('Socket disconnecting');
    });
  
  }, []);
  
  //User's info from API
  const setUser = () => {
    //TODO: Get user's notifications from API somehow
    const notifications = [
      { postId: "628d1d8759e1381f2401548c", title: "n1", text: "This is notification n1 content" },
      { postId: "628d1d8759e1381f240154a2", title: "n2", text: "This is notification n2 content" },
      { postId: "628d1d8759e1381f240154b8", title: "n3", text: "This is notification n3 content" },
      { postId: "628d1d8759e1381f240154ce", title: "n4", text: "This is notification n4 content" },
      { postId: "628d1d8759e1381f240154e4", title: "n5", text: "This is notification n5 content" },
      { postId: "628d1d8759e1381f240154fa", title: "n6", text: "This is notification n6 content" },
    ]

    axios.get('/users/profile/current').then(res => {
      let userData = res.data.user;
      userData.notifications = notifications;

      setLoggedIn(true);
      setUserData(userData);
    });
  };

  const loginUser = () => {
    setLoggedIn(true);
    axios.get('/users/profile/current').then(res => setUserData(res.data.user));
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
        <Route path="/" element={<Layout loggedIn={loggedIn} userData={userData} logoutUser={logoutUser} />}>
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
          <Route path="login" element={<Login loginUser={loginUser} />} />
          <Route path="register" element={<Register loginUser={loginUser} />} />
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
