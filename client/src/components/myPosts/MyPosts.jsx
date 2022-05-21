import React, { useState, useEffect } from "react";
import { Typography, Box, CardMedia, Divider, Button } from "@mui/material";
import axios from "../../utils/axios";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const MyPosts = () => {
  let navigate = useNavigate();
  const [posts, setPosts] = useState([]);

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
    axios.get("posts/current").then((res) => {
      console.log(res.data);
      setPosts(res.data.pendingPosts);
    });
  };

  const RenderPosts = ({ posts }) =>
    posts.map((post) => {
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
              //onClick={() => myOrderDetails(post)}
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
          </Box>
        </Box>
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
