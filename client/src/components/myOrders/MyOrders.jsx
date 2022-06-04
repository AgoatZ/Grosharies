import React, { useState, useEffect } from "react";
import { Typography, Box, CardMedia, Divider, Button } from "@mui/material";
import axios from "../../utils/axios";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const MySwal = withReactContent(Swal);

const MyOrders = () => {
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
      setCancelledPendings(res.data.cancelledPendings);
    });
  };

  return (
    <>
      <Box sx={{ m: "5%", mb: "1%" }}>
        <Typography
          component="div"
          variant="h3"
          fontFamily="Roboto"
          sx={{ mb: "5%" }}
        >
          My Orders
        </Typography>

        {pendingsPosts.length > 0 ? (
          <>
            <Typography component="div" variant="h4" fontFamily="Roboto">
              Pending
            </Typography>
            <RenderOrders posts={pendingsPosts} />
          </>
        ) : null}

        {finishedPendings.length > 0 ? (
          <>
            <Typography component="div" variant="h4" fontFamily="Roboto">
              Finished
            </Typography>
            <RenderOrders posts={finishedPendings} isFinished />
          </>
        ) : null}

        {cancelledPendings.length > 0 ? (
          <>
            <Typography component="div" variant="h4" fontFamily="Roboto">
              Canceled
            </Typography>
            <RenderOrders posts={cancelledPendings} isCanceled />
          </>
        ) : null}
      </Box>
    </>
  );
};

const calculateTimeLeft = (pendingPost) => {
  const today = new Date();
  const untilDate = new Date(pendingPost.pendingTime.until);
  const days = parseInt((untilDate - today) / (1000 * 60 * 60 * 24));
  const hours = parseInt((Math.abs(untilDate - today) / (1000 * 60 * 60)) % 24);
  const minutes = parseInt(
    (Math.abs(untilDate.getTime() - today.getTime()) / (1000 * 60)) % 60
  );
  const seconds = parseInt(
    (Math.abs(untilDate.getTime() - today.getTime()) / 1000) % 60
  );

  return today.getTime() > untilDate.getTime()
    ? pendingPost.status.collectorStatement === "collected"
      ? approveOrderComplete("publisher", pendingPost._id)
      : cancelOrder(pendingPost._id)
    : ("0" + days).slice(-2) +
    ":" +
    ("0" + hours).slice(-2) +
    ":" +
    ("0" + minutes).slice(-2) +
    ":" +
    ("0" + seconds).slice(-2) +
    " left for the order";
};

const myOrderDetails = (orderDetails, navigate) => {
  console.log(orderDetails)
  axios.get("posts/" + orderDetails.sourcePost).then((res) => {
    orderDetails.description = res.data.post.description
    res.data.post.content.forEach((grocery, i) => {
      orderDetails.content[i].left = grocery.left;
    });
    console.log("edit mode", JSON.stringify(orderDetails))
    navigate("/post/" + orderDetails._id, {
      state: { post: orderDetails, isEdit: true },
    });
  });
};

const handleFinishedOrCanceled = (isFinished) => {
  return isFinished ? (
    <Box
      sx={{
        width: "30%",
        m: "0 auto",
        height: "100%",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        pt: "3%",
      }}
    >
      <CheckIcon
        sx={{
          color: "green",
          m: "0 auto",
          height: "50%",
          width: "50%",
          fontSize: "20px",
        }}
      />
      <Typography
        component="div"
        variant="h6"
        fontFamily="Roboto"
        sx={{ color: "green" }}
      >
        Order Picked up
      </Typography>
    </Box>
  ) : (
    <Box
      sx={{
        width: "30%",
        m: "0 auto",
        height: "100%",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        pt: "3%",
      }}
    >
      <CloseIcon
        sx={{
          color: "red",
          m: "0 auto",
          height: "50%",
          width: "50%",
          fontSize: "20px",
        }}
      />
      <Typography
        component="div"
        variant="h6"
        fontFamily="Roboto"
        sx={{ color: "red" }}
      >
        Order was canceled
      </Typography>
    </Box>
  );
};

export const RenderOrders = ({
  posts,
  isFinished,
  isCanceled,
  role = "collector",
}) => {
  let navigate = useNavigate();
  return posts.map((post) => {
    const timeLeft =
      !isFinished && !isCanceled ? calculateTimeLeft(post) : null;
    return (
      <Box
        key={post._id}
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          m: "5%",
          width: "70%",
          backgroundColor: "whitesmoke",
          borderRadius: "20px",
        }}
      >
        <Box sx={{ display: "flex", width: "100%" }}>
          <Box
            onClick={() =>
              isFinished || isCanceled ? null : myOrderDetails(post, navigate)
            }
            sx={{
              display: "flex",
              width: "100%",
              ":hover":
                isFinished || isCanceled
                  ? null
                  : {
                    cursor: "pointer",
                    bgcolor: "#F2FCF8",
                    borderRadius: "10px",
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
                {timeLeft ? (
                  <Typography sx={{ color: "red", mr: "2%" }}>
                    {timeLeft}
                  </Typography>
                ) : null}
              </Typography>
            </Box>
            {!timeLeft
              ? handleFinishedOrCanceled(
                isFinished && !isCanceled
              ) /* returns true if finished, and false if canceled*/
              : null}
          </Box>
          {!isFinished && !isCanceled
            ? post.status.collectorStatement === "pending"
              ? approveOrCancelSection(role, post)
              : role === "collector"
                ? waitForPublisherSection()
                : approveOrCancelSection(role, post)
            : null}
        </Box>
      </Box>
    );
  });
};

const approveOrderComplete = (role, postId) => {
  let route;
  MySwal.fire({
    title: <strong>Are you sure you picked up the order?</strong>,
    icon: "info",
    showCancelButton: true,
    cancelButtonText: "no",
    showConfirmButton: true,
    confirmButtonText: "yes",
  }).then((result) => {
    role === "collector"
      ? (route = "pendings/collector/finish/" + postId)
      : (route = "pendings/finish/" + postId);
    if (result.isConfirmed) {
      axios.post(route).then((res) => {
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
  }).then((result) => {
    if (result.isConfirmed) {
      axios.post("pendings/cancel/" + postId).then((res) => {
        console.log(res.data);
        window.location.reload();
      });
    }
  });
};

const waitForPublisherSection = () => {
  return (
    <>
      <Divider color="black" sx={{ width: "1px" }} />

      <Box
        sx={{
          width: "30%",
          height: "100%",
          flexDirection: "column",
          flexWrap: "wrap",
          display: "flex",
          alignItems: "center",
          m: "6% 2% 0 2%",
        }}
      >
        <Typography
          fontSize="20px"
          sx={{ color: "green", mb: "10%", fontFamily: "Roboto" }}
        >
          Successfully Approved!
          <CheckIcon fontSize="medium" sx={{ color: "green", ml: "10px" }} />
        </Typography>
        <Typography
          fontSize="20px"
          sx={{ color: "goldenrod", mb: "2%", fontFamily: "Roboto" }}
        >
          Waiting for Post Publisher
          <AccessTimeIcon
            sx={{ color: "goldenrod", ml: "10px" }}
            fontSize="medium"
          />
        </Typography>
      </Box>
    </>
  );
};

export const approveOrCancelSection = (role, post) => {
  return (
    <>
      <Divider color="black" sx={{ width: "1px" }} />

      <Box sx={{ width: "30%" }}>
        <Button
          onClick={() => approveOrderComplete(role, post._id)}
          sx={{
            flexDirection: "row",
            display: "flex",
            width: "100%",
            height: "50%",
          }}
        >
          <CheckIcon fontSize="large" sx={{ color: "green", mr: "10px" }} />
          <Typography fontSize="18px">
            {role === "publisher" &&
              post.status.collectorStatement === "collected"
              ? "collector approved, Waiting for your approval"
              : role === "publisher" &&
                post.status.collectorStatement === "pending"
                ? "Complete the order"
                : "I Picked Up the Order"}
          </Typography>
        </Button>
        <Divider color="black" sx={{ width: "100%" }} />
        <Button
          onClick={() => cancelOrder(post._id)}
          sx={{
            flexDirection: "row",
            display: "flex",
            width: "100%",
            height: "50%",
          }}
        >
          <CloseIcon fontSize="large" sx={{ color: "red", mr: "10px" }} />
          <Typography fontSize="18px">I Want to Cancel</Typography>
        </Button>
      </Box>
    </>
  );
};

export default MyOrders;
