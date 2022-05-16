import React, { useState, useEffect } from "react";
import { Typography, Box, CardMedia, Divider, Button } from '@mui/material';
import axios from "../../utils/axios";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  let navigate = useNavigate();
  const [pendingsPosts, setPendingsPosts] = useState([]);
  useEffect(() => {
    loadPendingPosts();
  }, []);

  const loadPendingPosts = () => {
    axios.get("/pendings/byUserId").then((res) => {
      console.log(res.data);
      setPendingsPosts(res.data.posts);
    });
  };

  const calculateTimeLeft = (pendingPost) => {
    const today = new Date();
    const untilDate = new Date(pendingPost.pendingTime.until);
    const days = parseInt((untilDate - today) / (1000 * 60 * 60 * 24));
    const hours = parseInt(Math.abs(untilDate - today) / (1000 * 60 * 60) % 24);
    const minutes = parseInt(Math.abs(untilDate.getTime() - today.getTime()) / (1000 * 60) % 60);
    const seconds = parseInt(Math.abs(untilDate.getTime() - today.getTime()) / (1000) % 60);

    return (today.getTime() > untilDate.getTime()) ?
      `Time's Up!` :
      ('0' + days).slice(-2) + ":" + ('0' + hours).slice(-2) + ":" + ('0' + minutes).slice(-2) + ":" + ('0' + seconds).slice(-2) + " left for the order";
  };

  const myOrderDetails = (orderDetails) => {
    navigate('/my-order-details', { state: orderDetails });
  };

  return (
    <>
      <Box sx={{ m: '5%', mb: '1%' }}>
        <Typography component="div" variant="h3" fontFamily='Roboto'>
          My Orders
        </Typography>
      </Box>

      {pendingsPosts.map((pendingPost) => {
        return (
          <Box key={pendingPost._id} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', m: '5%', backgroundColor: 'whitesmoke', borderRadius: '20px' }}>
            <Box sx={{ display: 'flex', width: '100%' }}>

              <Box onClick={() => myOrderDetails(pendingPost)} sx={{ display: 'flex', width: '70%', ":hover": { cursor: 'pointer', bgcolor: 'lightgray' } }}>
                <CardMedia
                  component="img"
                  sx={{
                    padding: 1,
                    borderRadius: "10px",
                    height: "250px",
                    width: "auto",
                    mr: '3%'
                  }}
                  image='/assets/default-post-image.svg'
                />
                <Box sx={{ flexDirection: 'column', margin: 'auto 10% auto 0', width: '70%' }}>
                  <Typography component="div" variant="h4" mb='2%' fontFamily='Roboto'>
                    Title: {pendingPost.headline}
                  </Typography>
                  <Typography component="div" variant="h6" mb='2%' fontFamily='Roboto'>
                    Address: {pendingPost.address}
                  </Typography>
                  <Typography component="div" variant="h6" mb='2%' fontFamily='Roboto' sx={{ display: 'flex' }}>
                    <Typography sx={{ color: 'red', mr: '2%' }}>{calculateTimeLeft(pendingPost)}</Typography>
                  </Typography>
                </Box>
              </Box>

              <Divider color="black" sx={{ width: '1px' }} />

              <Box sx={{ width: '30%' }}>
                <Button sx={{ flexDirection: 'row', display: 'flex', width: '100%', height: '50%' }}>
                  <CheckIcon fontSize="large" sx={{ color: "green", mr: '10px' }} />
                  <Typography fontSize='25px'>I Picked Up the Order</Typography>
                </Button>
                <Divider color="black" sx={{ width: '100%' }} />
                <Button sx={{ flexDirection: 'row', display: 'flex', width: '100%', height: '50%' }}>
                  <CloseIcon fontSize="large" sx={{ color: "red", mr: '10px' }} />
                  <Typography fontSize='25px'>I Want to Cancel</Typography>
                </Button>
              </Box>

            </Box>
          </Box>
        )
      })}

    </>
  );
};

export default MyOrders;

