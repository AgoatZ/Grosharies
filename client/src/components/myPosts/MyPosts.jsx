import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { Typography, Box, CardMedia, Divider, Button, Stack, Accordion, AccordionDetails, AccordionSummary, List, ListItemButton, ListItemText, Collapse, ListSubheader, Fab } from "@mui/material";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => { loadMyPosts(); }, []);

  const loadMyPosts = async () => {
    let userPosts = []
    //Get user's open posts
    axios.get("posts/openPosts/current").then((userOpenPosts) => {
      userPosts = userOpenPosts.data.posts;
    }).then(() => {
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
      console.log(userPosts);
      setPosts(userPosts);
    });
  }

  const PostsAccordion = ({ posts }) => {
    const [expanded, setExpanded] = useState(false);
    const handleChange = (panel) => (event, isExpanded) => setExpanded(isExpanded ? panel : false);

    return (
      posts.map((post, index) => (
        <Accordion onChange={handleChange('panel' + index)} key={post._id} sx={{ mb: '16px' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <PostCard post={post} />
          </AccordionSummary >
          <AccordionDetails>
            <Divider />
            <PendingsList pendings={post.pendings} />
          </AccordionDetails>
        </Accordion >
      ))
    )
  };

  const PostCard = ({ post }) => {
    let navigate = useNavigate();
    const toPostPage = (post) => navigate("/post/" + post._id, { state: { post: post }, isEdit: true });

    return (
      <>
        <CardMedia
          component="img"
          image="/assets/default-post-image.svg"
          sx={{ padding: 1, borderRadius: "10px", height: "250px", width: "auto", mr: "3%" }}
        />
        <Stack spacing={1} sx={{ mt: "10px", mb: "10px", width: "auto" }}>
          <Typography variant="h4" >{post.headline}</Typography>
          <Typography variant="h6" >Address: {post.address}</Typography>
          <List disablePadding sx={{ display: { xs: 'none', md: 'block' } }}>
            {post.content.map((item) => (
              <ListItemText inset key={item.original._id}>{item.original.amount + item.original.scale + ' '} <b>{item.original.name} </b> {' packed in a ' + item.original.packing}</ListItemText>
            ))}
          </List>
          <Divider />
          <Button fullWidth variant="text" onClick={() => toPostPage(post)}>Go To Post Page</Button>
        </Stack>
        <Box >

        </Box>
      </>
    )

  }

  const PendingsList = ({ pendings }) => {
    return (
      <List>
        <ListSubheader>Open Orders</ListSubheader>
        {
          pendings.length > 0 ?
            (pendings.map(pending => <PendingCard pending={pending} key={pending._id} />)) :
            (<ListItemText>This post has no orders at the moment</ListItemText>)
        }
      </List >
    )
  }

  const PendingCard = ({ pending }) => {
    const [open, setOpen] = useState(false);
    const handleClick = () => setOpen(!open);
    return (
      <>
        <ListItemButton onClick={handleClick}>
          <ListItemText>{"Order By " + pending.collector}</ListItemText>
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open}>
          <List disablePadding>
            {pending.content.map((item) => (
              <ListItemText inset key={item._id}>{item.amount + item.scale + ' '} <b>{item.name} </b> {' packed in a ' + item.packing}</ListItemText>
            ))}
          </List>
        </Collapse>
      </>
    )
  }

  return (
    <Box sx={{ m: "5%", mb: "1%" }}>
      <Typography variant="h3" sx={{ mb: "5%" }}>My Posts</Typography>
      {posts.length > 0 ? (<PostsAccordion posts={posts} />) : null}
    </Box>
  );
};

export default MyPosts;