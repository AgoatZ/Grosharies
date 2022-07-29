import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import PostCard from "../myPosts/PostCard";
import ProductsList from "../myPosts/ProductsList";
import OrderCard from "../myOrders/OrderCard";
import { Typography, Box, Divider, Accordion, AccordionDetails, AccordionSummary, List, ListItemText, ListSubheader, Paper } from "@mui/material";
//Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => { loadMyPosts(); }, []);

  const loadMyPosts = () => {
    //Get user's open posts
    axios.get("posts/openPosts/current").then((res) => {
      setPosts(res.data.posts);
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
            <OrdersList repliers={post.repliers} />
          </AccordionDetails>
        </Accordion >
      ))
    )
  };

  const OrdersList = ({ repliers }) => {
    //repliers:[{user: collectorUserId, reply: pendingPostId}]
    const [pendingPosts, setPendings] = useState([]);
    useEffect(() => {
      let pendingPosts = [];
      repliers.forEach(replier => {
        //Get pending post object
        axios.get("pendings/" + replier.reply)
          .then((res) => {
            if (res.data.post.status.finalStatus === "pending")
              pendingPosts.push(res.data.post); setPendings(pendingPosts);
          })
          .catch(e => console.log("Error getting a pending post"));
      })
    }, []);

    return (
      <List>
        <ListSubheader>Open Orders</ListSubheader>
        {pendingPosts.length > 0 ?
          (pendingPosts.map(pendingPost =>
            <Paper elevation={3} key={pendingPost._id} sx={{ padding: "1%", margin: "1%" }}>
              <OrderCard pendingPost={pendingPost} role="publisher" />
            </Paper>
          )) :
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