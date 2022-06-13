import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import PostCard from "../myPosts/PostCard";
import ProductsList from "../myPosts/ProductsList";
import OrderCard from "../myOrders/OrderCard";
import { Typography, Box, Divider, Accordion, AccordionDetails, AccordionSummary, List, ListItemText, ListSubheader } from "@mui/material";
//Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => { loadMyPosts(); }, []);

  //TODO: fix open orders wont render and collector's name undefined
  const loadMyPosts = () => {
    let userPosts = [];
    //Get user's open posts
    axios.get("posts/openPosts/current").then((userOpenPosts) => {
      userPosts = userOpenPosts.data.posts;
      console.log('images', userPosts[userPosts.length - 1].images);
    }).then(() => {
      //TODO: use post.repliers:[{user: userIdreply: pendingPostId}] instead 
      //Add pending orders to each post object
      userPosts.forEach(post => {
        post.pendings = [];
        axios.get("pendings/post/" + post._id).then((postOpenOrders) => {
          //Filter to relevant pendings 
          post.pendings = postOpenOrders.data.pendings.filter((pending) => pending.status.finalStatus === "pending");
          //Add collector's name for each pending
          post.pendings.forEach((pending) => {
            axios.get("users/profile/" + pending.collectorId).then((res) => pending.collector = res.data.user.firstName + ' ' + res.data.user.lastName);
          });
        });
      });
    }).then(() => {
      console.log("User Posts", userPosts);
      setPosts(userPosts);
    });
  }

  const PostsAccordion = ({ posts }) => {
    return (
      posts.map((post) => (
        <Accordion key={post._id} sx={{ mb: '16px' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <PostCard post={post} />
          </AccordionSummary >
          <AccordionDetails>
            <Divider />
            <ProductsList content={post.content} />
            <Divider />
            <OrdersList pendings={post.pendings} />
          </AccordionDetails>
        </Accordion >
      ))
    )
  };

  const OrdersList = ({ pendings }) => {
    return (
      <List>
        <ListSubheader>Open Orders</ListSubheader>
        {
          pendings.length > 0 ?
            (pendings.map(pending => <OrderCard pendingPost={pending} role="publisher" key={pending._id} />)) :
            (<ListItemText inset>This post has no open orders at the moment</ListItemText>)
        }
      </List >
    )
  }

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: "5%" }}>My Posts</Typography>
      {posts.length > 0 ? (<PostsAccordion posts={posts} />) : <Typography>No Posts</Typography>}
    </Box>
  );
};

export default MyPosts;