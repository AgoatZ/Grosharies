import React, { useState, useEffect } from "react";
import { Typography, Box, CardMedia } from '@mui/material';
import axios from "../../utils/axios";

const MyOrders = () => {
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

  return (
    <>
      <Box sx={{ m: '5%', mb: '1%' }}>
        <Typography component="div" variant="h3" fontFamily='Roboto'>
          My Orders
        </Typography>
      </Box>

      {pendingsPosts.map((pendingPost) => {
        return (
          <Box key={pendingPost._id} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', m: '5%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '90%' }}>
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
              <Box sx={{ display: 'flex', flexDirection: 'column', margin: 'auto 10% auto 0' }}>
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
          </Box>
        )
      })}

    </>
  );
};

export default MyOrders;

