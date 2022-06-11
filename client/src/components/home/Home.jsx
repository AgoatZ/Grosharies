import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../App";
import { useNavigate } from "react-router-dom";
import {
  Stack,
  Box,
  Tabs,
  Tab,
  Typography,
  Divider,
  Switch,
} from "@mui/material";
import axios from "../../utils/axios";
import Posts from "../posts/Posts";
import AddPost from "../add-post/AddPost";

const tabs = ["Near By", "Recently Added", "Add post"];

const Home = () => {
  const { loggedIn } = useContext(AppContext);
  const [activeTabNumber, setActiveTabNumber] = useState(0);
  const handleTabChange = (event, newTabNumber) =>
    setActiveTabNumber(newTabNumber);
  const [suggestedPosts, setSuggestedPosts] = useState([]);
  const [nearbyPosts, setNearbyPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [showAsMap, setShowAsMap] = useState(false);

  useEffect(() => loadPosts(), []);

  const loadPosts = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        console.log("Latitude is :", position.coords.latitude);
        console.log("Longitude is :", position.coords.longitude);
        //TODO: add route to exept the user location to server
        axios
          .post("/posts/nearby", {
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          })
          .then((res) => {
            setNearbyPosts(res.data.posts);
          });
      });
    }
    axios
      .get("posts/suggested/current")
      .then((res) => setSuggestedPosts(res.data.posts))
      .catch((e) => console.log("Error getting suggested posts"));
    //TODO: Posts nearby and Posts recently added

    axios.get("/posts/").then((res) => {
      res.data.posts.forEach((post) => {
        console.log(
          "address: ",
          post.address,
          " coordinates: ",
          post.addressCoordinates
        );
      });

      setRecentPosts(res.data.posts);
    });
  };

  const Logo = () => {
    return (
      <Box>
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          <img src={"assets/logo.svg"} height="300px" width="300px" />
        </Box>
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <img src={"assets/logo.svg"} height="150px" width="150px" />
        </Box>
      </Box>
    );
  };

  const TabPanel = ({ children, value, index }) => {
    return (
      <div role="tabpanel" hidden={value !== index}>
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  };

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      spacing={{ xs: 1, sm: 1, md: 5, lg: 5 }}
    >
      <Logo />

      <Box
        sx={{ width: "auto" }}
        hidden={!loggedIn || suggestedPosts.length == 0}
      >
        <Divider variant="middle">
          <Typography variant="h5" margin="10px">
            Recommended For You
          </Typography>
        </Divider>
        <Posts data={suggestedPosts} noBorder />
      </Box>

      <Box sx={{ width: { sm: "500px", md: "1000px" } }}>
        <Switch
          sx={{ left: 0 }}
          title="Map Visualize"
          onChange={() => setShowAsMap(!showAsMap)}
          checked={showAsMap}
        />
        <Tabs value={activeTabNumber} onChange={handleTabChange}>
          <Tab label={tabs[0]} />
          <Tab label={tabs[1]} />
          <Tab label={tabs[2]} />
        </Tabs>
        <TabPanel value={activeTabNumber} index={0}>
          <Posts data={nearbyPosts} showMap={showAsMap} />
        </TabPanel>
        <TabPanel value={activeTabNumber} index={1}>
          <Posts data={recentPosts} showMap={showAsMap} />
        </TabPanel>
        <TabPanel value={activeTabNumber} index={2}>
          <AddPost />
        </TabPanel>
      </Box>
    </Stack>
  );
};

export default Home;
