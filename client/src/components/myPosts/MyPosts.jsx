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
import { approveOrCancelSection, RenderOrders } from "../myOrders/MyOrders";
import PopupState, { bindToggle, bindPopper } from "material-ui-popup-state";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [pendingsForPost, setPendingsForPost] = useState([]);

  useEffect(() => {
    loadMyPosts();
  }, []);

  const loadMyPosts = async () => {
    axios.get("posts/openPosts/current").then((openPostsRes) => {
      let filterArray = [];
      axios.get("pendings/").then((res) => {
        for (const post of openPostsRes.data.posts) {
          filterArray.push(
            res.data.posts.filter((pending) => {
              return (
                pending.status.finalStatus === "pending" &&
                post._id === pending.sourcePost
              );
            })
          );
        }
        setPendingsForPost(filterArray);
        setPosts(openPostsRes.data.posts);
      });
    });
  };

  const RenderPosts = ({ posts, bindToggle, bindPopper }) =>
    posts.map((post, index) => {
      return (
        // <PopupState variant="popper" popupId="demo-popup-popper">
        //   {(popupState) => (
        //     <div>
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
              {...bindToggle()}
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
          <Popper {...bindPopper()} transition>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper>
                  {pendingsForPost[index].length > 0 ? (
                    <RenderOrders
                      role="publisher"
                      isFinished={false}
                      isCanceled={false}
                      posts={pendingsForPost[index]}
                    ></RenderOrders>
                  ) : (
                    <Typography sx={{ fontFamily: "roboto" }}>
                      This post has no orders at the moment
                    </Typography>
                  )}
                  {/* <RenderOrders role="publisher" isFinished={false} isCanceled={false} posts={pendingsForPost[index]}></RenderOrders> */}
                </Paper>
              </Fade>
            )}
          </Popper>
        </Box>
        //     </div>
        //   )}
        // </PopupState>
      );
    });

  return (
    <>
      <PopupState variant="popper" popupId="demo-popup-popper">
        {(popupState) => (
          <div>
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
                  <RenderPosts
                    posts={posts}
                    bindToggle={bindToggle.bind(this, popupState)}
                    bindPopper={bindPopper.bind(this, popupState)}
                  />
                </>
              ) : null}
            </Box>
          </div>
        )}
      </PopupState>
    </>
  );
};

export default MyPosts;
