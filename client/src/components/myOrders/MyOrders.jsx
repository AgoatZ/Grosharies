import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { Typography, Box, CardMedia, Divider, Button, Stack, Accordion, AccordionDetails, AccordionSummary, List, ListItemButton, ListItemText, Collapse, ListSubheader, Fab } from "@mui/material";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const MySwal = withReactContent(Swal);

const MyOrders = () => {
  const [pendingsPosts, setPendingsPosts] = useState([]);
  const [finishedPendings, setFinishedPendings] = useState([]);
  const [cancelledPendings, setCancelledPendings] = useState([]);
  useEffect(() => { loadPendingPosts(); }, []);

  const loadPendingPosts = () => {
    axios.get("pendings/collector/current").then((res) => {
      console.log(res.data);
      setPendingsPosts(res.data.pendingPosts);
      setFinishedPendings(res.data.finishedPendings);
      setCancelledPendings(res.data.cancelledPendings);
    });
  };

  return (
    <Stack spacing={1} sx={{ m: "5%", mb: "1%" }}>
      <Typography variant="h3" sx={{ mb: "5%" }}>My Orders</Typography>
      <Typography variant="h4" >Pending</Typography>
      {pendingsPosts.length > 0 ? <PostsAccordion posts={pendingsPosts} /> : <Typography>No Pending Orders</Typography>}
      <Typography variant="h4" >Finished</Typography>
      {finishedPendings.length > 0 ? <PostsAccordion posts={finishedPendings} /> : <Typography>No Finished Orders</Typography>}
      <Typography variant="h4" >Canceled</Typography>
      {cancelledPendings.length > 0 ? <PostsAccordion posts={cancelledPendings} /> : <Typography>No Canceled Orders</Typography>}
    </Stack>
  );
};

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
          <ItemsList content={post.content} />
        </AccordionDetails>
      </Accordion >
    ))
  )
};

const PostCard = ({ post }) => {
  let navigate = useNavigate();
  const toPostPageWithOrderEdit = (post) => navigate("/post/" + post._id, { state: { post: post }, isEdit: true });

  return (
    <>
      <CardMedia
        component="img"
        image="/assets/default-post-image.svg"
        sx={{ padding: 1, borderRadius: "10px", height: "200px", width: "auto", mr: "3%" }}
      />
      <Stack spacing={1} sx={{ width: '50%', flexShrink: 0, mr: "3%", mt: "10px", mb: "10px" }}>
        <Status post={post} />
        <Divider />
        <Typography variant="h5" >{post.headline}</Typography>
        <Typography variant="h6" >Address: {post.address}</Typography>
      </Stack>

      <Stack justifyContent="center" alignItems="center" spacing={2} sx={{ width: '33%', flexShrink: 1 }}>
        <Button variant="outlined" startIcon={<EditIcon />} onClick={() => toPostPageWithOrderEdit(post)}>Change Order</Button>
        <Button variant="outlined" startIcon={<CheckIcon />} onClick={() => completeOrder(post)}>Complete Order</Button>
        <Button variant="outlined" startIcon={<CloseIcon />} onClick={() => cancelOrder(post)}>Cancel Order</Button>
      </Stack>
    </>
  )
}

const Status = ({ post }) => {
  const timeLeft = calculateTimeLeft(post);
  return (
    <>
      {post.status.finalStatus === "pending" && post.status.collectorStatement === "pending" && post.status.publisherStatement === "pending" ?
        (<Typography variant="overline">Waiting for you</Typography>) : null}

      {post.status.finalStatus === "cancelled" && post.status.collectorStatement === "cancelled" && post.status.publisherStatement === "pending" ?
        (<Typography variant="overline">Canceled by you</Typography>) : null}
      {post.status.finalStatus === "cancelled" && post.status.collectorStatement === "pending" && post.status.publisherStatement === "cancelled" ?
        (<Typography variant="overline">Canceled by the publisher</Typography>) : null}

      {post.status.finalStatus === "collected" && post.status.collectorStatement === "collected" && post.status.publisherStatement === "pending" ?
        (<Typography variant="overline">Collected by you</Typography>) : null}
      {post.status.finalStatus === "collected" && post.status.collectorStatement === "pending" && post.status.publisherStatement === "collected" ?
        (<Typography variant="overline">Collected by others</Typography>) : null}

      <Typography variant="overline">
        {timeLeft ? <Typography variant="overline" sx={{ color: "red" }}>{timeLeft}</Typography> : null}
      </Typography>
    </>
  )
}

//TODO: Add actions to each items - marked picked, etc
const ItemsList = ({ content }) => {

  //   //
  // const myOrderDetails = (orderDetails, navigate) => {
  //   axios.get("posts/" + orderDetails.sourcePost).then((res) => {
  //     res.data.post.content.forEach((grocery, i) => {
  //       orderDetails.content[i].left = grocery.left;
  //     });
  //     navigate("/post/" + orderDetails._id, {
  //       state: { post: orderDetails, isEdit: true },
  //     });
  //   });
  // };

  return (
    <List disablePadding sx={{ display: { xs: 'none', md: 'block' } }}>
      <ListSubheader>Items</ListSubheader>
      {content.map((item) => (
        <ListItemText inset key={item._id}>
          {item.amount + item.scale + ' '}
          <b>{item.name} </b>
          {' packed in a ' + item.packing + ' '}
          {/* <ins >{item.left + ' left'}</ins > */}
        </ListItemText>
      ))}
    </List>
  )
}

const calculateTimeLeft = (pendingPost) => {
  const today = new Date();
  const untilDate = new Date(pendingPost.pendingTime.until);
  const days = parseInt((untilDate - today) / (1000 * 60 * 60 * 24));
  const hours = parseInt((Math.abs(untilDate - today) / (1000 * 60 * 60)) % 24);
  const minutes = parseInt((Math.abs(untilDate.getTime() - today.getTime()) / (1000 * 60)) % 60);
  const seconds = parseInt((Math.abs(untilDate.getTime() - today.getTime()) / 1000) % 60);

  return today.getTime() > untilDate.getTime() ?
    (("0" + days).slice(-2) + ":" + ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2) + " left for the order") :
    ("The post is expired");
};

const completeOrder = (postId) => {
  MySwal.fire({
    title: <strong>Are you sure you picked up the order?</strong>,
    icon: "info",
    showCancelButton: true,
    cancelButtonText: "no",
    showConfirmButton: true,
    confirmButtonText: "yes",
    backdrop: false
  }).then((result) => {
    if (result.isConfirmed) {
      axios.post("pendings/finish/" + postId).then((res) => {
        console.log(res.data);
        window.location.reload();
      });
    }
  });
};

const cancelOrder = (postId) => {
  MySwal.fire({
    title: <strong>Are you sure you want to cancel the order?</strong>,
    icon: "info",
    showCancelButton: true,
    cancelButtonText: "no",
    showConfirmButton: true,
    confirmButtonText: "yes",
    backdrop: false
  }).then((result) => {
    if (result.isConfirmed) {
      axios.post("pendings/cancel/" + postId).then((res) => {
        console.log(res.data);
        window.location.reload();
      });
    }
  });
};

export default MyOrders;
