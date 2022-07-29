import React, { useState, useEffect } from "react";
import { Stack, Box, Tabs, Tab, Typography, Switch, Fab, styled, Drawer, useMediaQuery } from "@mui/material";
import axios from "../../utils/axios";
import Posts from "../posts/Posts";
import SuggestedPosts from "./SuggestedPosts";
import AddPost from "../add-post/AddPost";
import AddIcon from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';

const tabs = ["Near By", "Recently Added"];

const Home = () => {
  const handleTabChange = (event, newTabNumber) => setActiveTabNumber(newTabNumber);
  const [activeTabNumber, setActiveTabNumber] = useState(0);
  const [nearbyPosts, setNearbyPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [showAsMap, setShowAsMap] = useState(true);
  const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);
  const mobileScreen = useMediaQuery('(max-width:480px)');

  useEffect(() => loadPosts(), []);

  const loadPosts = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        axios
          .post("/posts/nearby/?page=1&limit=10", { coordinates: { lat: position.coords.latitude, lng: position.coords.longitude, }, })
          .then((res) => { setNearbyPosts(res.data.posts); });
      });
    }
    axios.get("/posts/?page=1&limit=10").then((res) => {
      res.data.posts.forEach((post) => {/*console.log("address: ", post.address, " coordinates: ", post.addressCoordinates);*/ });
      setRecentPosts(res.data.posts);
    });
  };

  const Logo = () => {
    return (
      mobileScreen ?
        (<img src={"assets/logo.svg"} alt="" height="150px" width="150px" />) :
        (<img src={"assets/logo.svg"} alt="" height="300px" width="300px" />)
    );
  };

  const TabPanel = ({ children, value, index }) => {
    return (
      <Stack role="tabpanel" direction="column" alignItems="center" flexWrap="wrap" hidden={value !== index} >
        {/* <Box role="tabpanel" hidden={value !== index}> */}
        {value === index && <Box>{children}</Box>}
      </Stack>
    );

  };

  const AddPostDrawer = () => {
    const [open, setOpen] = useState(false);
    const toggle = (open) => (event) => { setOpen(open); };

    return (
      <>
        <Box sx={{ position: "fixed", bottom: "1%", right: "1%", width: "fit-content" }}>
          <Fab variant="extended" color="secondary" onClick={toggle(true)}><AddIcon sx={{ mr: 1 }} />New Post</Fab>
          <Offset />
        </Box>

        <Drawer
          anchor="right"
          open={open}
          onClose={toggle(false)}
          ModalProps={{ keepMounted: true, disableScrollLock: true }}
          sx={{ maxWidth: "50%" }}>
          <Box >
            {mobileScreen ?
              <CloseIcon fontSize="large" onClick={toggle(false)} sx={{ mt: "2%", ml: "2%" }} /> :
              <ChevronRightIcon fontSize="large" onClick={toggle(false)} sx={{ mt: "2%", ml: "2%" }} />}
            <AddPost />
          </Box>
        </Drawer >
      </>
    )
  }


  return (
    <>
      <Stack direction="column" alignItems="center" flexWrap="wrap" spacing={{ xs: 1, sm: 1, md: 3, lg: 5 }}>
        <Logo />

        <SuggestedPosts />

        <Box sx={{ width: "100%" }}>


          <Stack direction="column" alignItems="center" flexWrap="wrap" >
            <Typography variant="button">View as map</Typography>
            <Switch sx={{ left: 0 }} onChange={() => setShowAsMap(!showAsMap)} checked={showAsMap} />
          </Stack>

          <Tabs variant="fullWidth" value={activeTabNumber} onChange={handleTabChange} sx={{ mb: "3%" }}>
            <Tab label={tabs[0]} />
            <Tab label={tabs[1]} />
          </Tabs>

          <TabPanel value={activeTabNumber} index={0} >
            {nearbyPosts.length > 0 ?
              <Posts data={nearbyPosts} showMap={showAsMap} /> :
              <Typography>No posts near by</Typography>}
          </TabPanel>

          <TabPanel value={activeTabNumber} index={1}>
            <Posts data={recentPosts} showMap={showAsMap} />
          </TabPanel>

        </Box>

        <AddPostDrawer />

      </Stack>

    </>
  );
};

export default Home;
