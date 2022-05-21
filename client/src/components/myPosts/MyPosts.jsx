import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  CardMedia,
  Divider,
  Button,
  Fade,
  Popper,
  Paper,
} from "@mui/material";
import axios from "../../utils/axios";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { approveOrCancelSection, RenderOrders } from "../myOrders/MyOrders";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import PopupState, { bindToggle, bindPopper } from "material-ui-popup-state";

const MySwal = withReactContent(Swal);

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [pendingsForPost, setPendingsForPost] = useState([]);

  useEffect(() => {
    loadMyPosts();
  }, []);

  const cancelPost = (postId) => {
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

  const loadMyPosts = () => {
    axios.get("posts/openPosts/current").then((res) => {
      setPosts(res.data.posts);
    });

    axios.get("pendings/publisher/current").then((res) => {
      console.log(JSON.stringify(res.data));
      setPendingsForPost(res.data.pendings);
    });
  };

  const loadPendingsForSpecificPost = (post) => {
    const pendingsByPost = axios.get("pendings/post/" + post._id);
    console.log(JSON.stringify(pendingsByPost.data));
    return (
      <RenderOrders
        posts={pendingsByPost.data.pendings}
        isFinished={false}
        isCanceled={false}
      />
    );
  };

  const RenderPosts = ({ posts }) =>
    posts.map((post) => {
      return (
        <PopupState variant="popper" popupId="demo-popup-popper">
          {(popupState) => (
            <div>
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
                    {...bindToggle(popupState)}
                    sx={{
                      display: "flex",
                      width: "100%",
                      ":hover": {
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
                    </Box>
                  </Box>
                  {/* {approveOrCancelSection("publisher", post._id)} */}
                </Box>
                {loadPendingsForSpecificPost(post)}
                {/* <Popper {...bindPopper(popupState)} transition>
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                      <Paper>{loadPendingsForSpecificPost(post)}</Paper>
                    </Fade>
                  )}
                </Popper> */}
              </Box>
            </div>
          )}
        </PopupState>
      );
    });

  return (
    <>
      <Box sx={{ m: "5%", mb: "1%" }}>
        <Typography
          component="div"
          variant="h3"
          fontFamily="Roboto"
          sx={{ mb: "5%" }}
        >
          My Posts
        </Typography>

        {posts.length > 0 ? (
          <>
            <RenderPosts posts={posts} />
          </>
        ) : null}
      </Box>
    </>
  );
};

export default MyPosts;
