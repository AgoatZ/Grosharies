import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { Typography, Box, CardMedia, Divider, Button, ButtonGroup, Stack, Accordion, AccordionDetails, AccordionSummary, List, ListItemButton, ListItemText, Collapse, ListSubheader, TextField } from "@mui/material";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
//Icons
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from "@mui/icons-material/Check";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DeleteIcon from '@mui/icons-material/Delete';

const MySwal = withReactContent(Swal);

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => { loadMyPosts(); }, []);

  const loadMyPosts = async () => {
    let userPosts = [];
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
      console.log("User Posts", userPosts);
      setPosts(userPosts);
    });
  }

  const PostsAccordion = ({ posts }) => {
    //TODO: Edit Post Page
    let navigate = useNavigate();
    const toEditPostPage = (post) => navigate("/post/" + post._id, { state: { postId: post._id } });

    return (
      posts.map((post) => (
        <Accordion key={post._id} sx={{ mb: '16px' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <PostCard post={post} />
          </AccordionSummary >
          <AccordionDetails>
            <ButtonGroup fullWidth>
              <Button variant="outlined" startIcon={<EditIcon />} onClick={() => toEditPostPage(post)}>Edit Post</Button>
              <Button variant="outlined" startIcon={<CheckIcon />} onClick={() => completePost(post)}>Mark Collected</Button>
              <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => deletePost(post)}>Delete Post</Button>
            </ButtonGroup>
            <Divider />
            <ProductsList content={post.content} />
            <Divider sx={{ mt: '10px' }} />
            <OrdersList pendings={post.pendings} />
          </AccordionDetails>
        </Accordion >
      ))
    )
  };

  const PostCard = ({ post }) => {
    let navigate = useNavigate();
    const toPostPage = () => navigate("/post/" + post._id, { state: { postId: post._id } });
    return (
      <>
        <CardMedia component="img" image="/assets/default-post-image.svg"
          sx={{ display: { xs: "none", md: "flex" }, padding: 1, borderRadius: "10px", height: "200px", width: "auto", mr: "3%" }} />
        <Stack spacing={1} sx={{ flexShrink: 1, mr: "3%", mt: "10px", mb: "10px" }}>
          <CardMedia component="img" image="/assets/default-post-image.svg"
            sx={{ display: { xs: "flex", md: "none" }, padding: 1, borderRadius: "10px", height: "200px", width: "auto", mr: "3%" }} />
          <Typography variant="overline">{post.status}</Typography>
          <Typography variant="h5" >{post.headline}</Typography>
          <Typography variant="h6" ><LocationOnIcon /> {post.address}</Typography>
          <Divider />
          <Button variant="text" onClick={toPostPage}>Go To Post</Button>
        </Stack>
      </>
    )
  }

  //TODO: DB - mark all as collected by publisher
  const completePost = (post) => {
    MySwal.fire({
      title: <strong>Are you sure you want to mark all as collected?</strong>,
      icon: "info",
      showCancelButton: true,
      cancelButtonText: "no",
      showConfirmButton: true,
      confirmButtonText: "yes",
      backdrop: false
    }).then((result) => {
      if (result.isConfirmed) {
        //Finish all post's open orders
        post.pendings.forEach((pendingPost) => {
          axios.post('pendings/finish/' + pendingPost._id)
            .then((res) => console.log("Result finishing pending post id:" + pendingPost._id + " by publisher", res.data));
        })

        //TODO: FIX! NOT UPDATING CONTENT IN DB
        //Mark none left
        post.content.forEach((grocery) => grocery.left = 0)
        console.log(post);
        //Update post in db
        axios.put('posts/' + post._id, { post })
          .then((res) => console.log("Result updating post id:" + post._id, res.data));
        //window.location.reload();
      }
    });
  };

  const deletePost = (post) => {
    MySwal.fire({
      title: <strong>Are you sure you want to delete this post?</strong>,
      icon: "info",
      showCancelButton: true,
      cancelButtonText: "no",
      showConfirmButton: true,
      confirmButtonText: "yes",
      backdrop: false
    }).then((result) => {
      if (result.isConfirmed) {
        //Cancel all post's open orders
        post.pendings.forEach((pendingPost) => {
          axios.post('pendings/cancel/' + pendingPost._id)
            .then((res) => console.log("Result canceling pending post id:" + pendingPost._id + " by publisher", res.data));
        })

        //Delete post in db
        axios.delete('posts/' + post._id, { post })
          .then((res) => console.log("Result deleting post id:" + post._id, res.data));

        window.location.reload();
      }
    });
  };

  const ProductsList = ({ content }) => {
    return (
      <List disablePadding>
        <ListSubheader>Products</ListSubheader>
        {content.map((item) => (
          <ListItemText inset key={item.original._id}>
            {item.original.amount + item.original.scale + ' '}
            <b>{item.original.name} </b>
            {' packed in a ' + item.original.packing + ' '}
            <ins >{item.left + ' left'}</ins >
          </ListItemText>
        ))}
      </List>
    )
  }

  const OrdersList = ({ pendings }) => {
    return (
      <List>
        <ListSubheader>Open Orders</ListSubheader>
        {
          pendings.length > 0 ?
            (pendings.map(pending => <Order pending={pending} key={pending._id} />)) :
            (<ListItemText>This post has no orders at the moment</ListItemText>)
        }
      </List >
    )
  }

  const Order = ({ pending }) => {
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
      {posts.length > 0 ? (<PostsAccordion posts={posts} />) : <Typography>No Posts</Typography>}
    </Box>
  );
};



export default MyPosts;