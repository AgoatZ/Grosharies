import React, { useState, useEffect } from "react";
import { Typography, Box, CardMedia, Divider, Button } from "@mui/material";
import axios from "../../utils/axios";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  let navigate = useNavigate();
  const [pendingsPosts, setPendingsPosts] = useState([]);
  const [finishedPendings, setFinishedPendings] = useState([]);
  const [cancelledPendings, setCancelledPendings] = useState([]);


  useEffect(() => {
    loadPendingPosts();
  }, []);

  const loadPendingPosts = () => {
    axios.get("pendings/collector/current").then((res) => {
      console.log(res.data);
      setPendingsPosts(res.data.pendingPosts);
      setFinishedPendings(res.data.finishedPendings);
      setCancelledPendings(res.data.cancelledPendings)
    });
  };

  const calculateTimeLeft = (pendingPost) => {
    const today = new Date();
    const untilDate = new Date(pendingPost.pendingTime.until);
    const days = parseInt((untilDate - today) / (1000 * 60 * 60 * 24));
    const hours = parseInt(
      (Math.abs(untilDate - today) / (1000 * 60 * 60)) % 24
    );
    const minutes = parseInt(
      (Math.abs(untilDate.getTime() - today.getTime()) / (1000 * 60)) % 60
    );
    const seconds = parseInt(
      (Math.abs(untilDate.getTime() - today.getTime()) / 1000) % 60
    );

    return today.getTime() > untilDate.getTime()
      ? `Time's Up!`
      : ("0" + days).slice(-2) +
      ":" +
      ("0" + hours).slice(-2) +
      ":" +
      ("0" + minutes).slice(-2) +
      ":" +
      ("0" + seconds).slice(-2) +
      " left for the order";
  };

  const myOrderDetails = (orderDetails) => {
    navigate("/my-order-details", { state: orderDetails });
  };

  const approveOrCancelSection = (
    <>
      <Divider color="black" sx={{ width: "1px" }} />

      <Box sx={{ width: "30%" }}>
        <Button
          sx={{
            flexDirection: "row",
            display: "flex",
            width: "100%",
            height: "50%",
          }}
        >
          <CheckIcon fontSize="large" sx={{ color: "green", mr: "10px" }} />
          <Typography fontSize="25px">I Picked Up the Order</Typography>
        </Button>
        <Divider color="black" sx={{ width: "100%" }} />
        <Button
          sx={{
            flexDirection: "row",
            display: "flex",
            width: "100%",
            height: "50%",
          }}
        >
          <CloseIcon fontSize="large" sx={{ color: "red", mr: "10px" }} />
          <Typography fontSize="25px">I Want to Cancel</Typography>
        </Button>
      </Box>
    </>
  );


  const RenderPosts = ({ posts, isFinished }) => posts.map((post) => {
    const timeLeft = calculateTimeLeft(post);
    return (
      <Box
        key={post._id}
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          m: "5%",
          backgroundColor: "whitesmoke",
          borderRadius: "20px",
        }}
      >
        <Box sx={{ display: "flex", width: "100%" }}>
          <Box
            onClick={() => myOrderDetails(post)}
            sx={{
              display: "flex",
              width: timeLeft !== `Time's Up!` ? "70%" : "100%",
              ":hover": {
                cursor: "pointer",
                bgcolor: "lightgray",
                borderRadius: timeLeft !== `Time's Up!` ? null : "20px",
              },
            }}
          >
            <CardMedia
              component="img"
              sx={{
                padding: 1,
                borderRadius: "10px",
                height: "250px",
                width: "auto",
                mr: "3%",
              }}
              image="/assets/default-post-image.svg"
            />
            <Box
              sx={{
                flexDirection: "column",
                margin: "auto 10% auto 0",
                width: "70%",
              }}
            >
              <Typography
                component="div"
                variant="h4"
                mb="2%"
                fontFamily="Roboto"
              >
                Title: {post.headline}
              </Typography>
              <Typography
                component="div"
                variant="h6"
                mb="2%"
                fontFamily="Roboto"
              >
                Address: {post.address}
              </Typography>
              <Typography
                component="div"
                variant="h6"
                mb="2%"
                fontFamily="Roboto"
                sx={{ display: "flex" }}
              >
                <Typography sx={{ color: "red", mr: "2%" }}>
                  {timeLeft}
                </Typography>
              </Typography>
            </Box>
          </Box>

          {timeLeft !== `Time's Up!` ? approveOrCancelSection : null}
        </Box>
      </Box>
    );
  })


  return (
    <>
      <Box sx={{ m: "5%", mb: "1%" }}>
        <Typography component="div" variant="h3" fontFamily="Roboto">
          My Orders
        </Typography>
        <RenderPosts posts={pendingsPosts} />
        <RenderPosts posts={finishedPendings} />
        <RenderPosts posts={cancelledPendings} />
      </Box>
    </>
  );
};

export default MyOrders;
