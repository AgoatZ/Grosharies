import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Typography, Box, Button, Slider, CardMedia, Stack, Paper, useMediaQuery, Badge, Container, Divider } from "@mui/material";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "../../utils/axios";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { PostDummy } from "../../utils/dummies";
import Map from "../map/Map";
import PickupDatesCalendar from "./PickupDatesCalendar";
import LocationOnIcon from '@mui/icons-material/LocationOn';

const MySwal = withReactContent(Swal);

const Post = () => {
  let navigate = useNavigate();
  const sourcePostId = useParams().id;
  const [post, setPost] = useState(PostDummy);
  const [isEdit, setEdit] = useState(false);
  const { handleSubmit, control } = useForm();
  const mobileScreen = useMediaQuery('(max-width:480px)');
  useEffect(() => loadPost(), []);

  const loadPost = () => {
    let post = {}

    axios.get('posts/' + sourcePostId).then((res) => {
      post = res.data.post;

      //Add and Init user's order amount for each grocery item
      post.content.forEach((grocery) => grocery.currentOrder = 0);

      //TODO: Add to API getPendingByPostAndByCollector ?
      //Get user's active order for this post and add it to main post object if exists
      axios.get("pendings/collector/current").then((res) => {
        const userPendingPost = res.data.pendingPosts.find((order) => order.sourcePost == post._id);
        const valid = userPendingPost && userPendingPost.status.finalStatus === "pending" && userPendingPost.status.collectorStatement === "pending" && userPendingPost.status.publisherStatement === "pending";

        if (valid) {
          post.userPendingPostId = userPendingPost._id;
          console.log("User's open pending post (order) for this post", userPendingPost);
          //Set the user's order amount for each grocery item
          userPendingPost.content.forEach((orderGrocery) => (post.content.find((grocery) => grocery.original.name === orderGrocery.name).currentOrder = orderGrocery.amount));

          setEdit(true);
          setPost(post);
        } else {
          setPost(post);
        }
      }).catch(e => { console.log("Error getting user's pending posts"); setPost(post); });

    }).then(() => {
      console.log("Post", post);
      console.log("Post Content", post.content)
    }).catch(e => console.log("Error getting post"));
  }

  const convertImagesToItems = (post) => {
    if (mobileScreen)
      return post.images.map((image) => ({ original: "data:image/jpg;base64, " + image, originalWidth: "300px", originalHeight: "400px", }));
    return post.images.map((image) => ({ original: "data:image/jpg;base64, " + image, originalWidth: "400px", originalHeight: "500px", }));
  }

  const Products = ({ post }) => {
    return (
      post.content.map((grocery) => (
        <Box key={grocery._id} sx={{ width: "fit-content", margin: "1%" }}>
          <CardMedia image={"data:image/jpg;base64, " + grocery.original.images} component="img"
            sx={{ padding: 1, height: "150px", width: "auto", }} />

          <Stack direction="column" >
            <Typography variant="h6" mb="2%" >
              <b>{`${grocery.original.name}`}</b>
            </Typography>
            <Typography variant="h6" mb="2%" >
              {`Original Amount: ${grocery.original.amount}  ${grocery.original.scale}`}
            </Typography>
            <Typography variant="h6" mb="2%" >
              {`Available Amount: ${grocery.left + grocery.currentOrder}  ${grocery.original.scale}`}
            </Typography>

            <Box >
              <Controller
                control={control}
                name={grocery.original.name}
                defaultValue={grocery.currentOrder}
                render={({ field: { value, onChange } }) => (
                  <Typography variant="h6" color="secondary" >
                    {`Your Amount: ${value} ${grocery.original.scale}`}
                    <Slider
                      marks
                      step={1}
                      min={0}
                      max={Number(grocery.left + grocery.currentOrder)}
                      valueLabelDisplay="auto"
                      onChange={(e) => { onChange(e.target.value); }}
                      name={grocery.original.name}
                      value={value}
                    />
                  </Typography>
                )}
              />
            </Box>
          </Stack>
        </Box>
      ))
    )
  };

  const onSubmit = (data) => {
    const orderGroceries = post.content
      .filter((grocery) => data[grocery.original.name] > 0)
      .map((grocery) => {
        grocery.original.amount = data[grocery.original.name];
        return grocery.original;
      })

    console.log("Form Data", data);
    console.log("Order Groceries", orderGroceries);

    if (!isEdit) {
      //Create Pending Post
      axios.post("posts/pend", { postId: sourcePostId, groceries: orderGroceries }).then((res) => {
        console.log("Create Pending Post Result", res.data);
        MySwal.fire({
          title: "Successfully Applied Your Order!",
          text: "You can now go and take your GroSharies",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
          backdrop: false
        });
        setTimeout(() => { navigate("/my-orders", {}); }, 1000);
      }).catch(e => console.log("Create Pending Post Error", e));
    } else {
      //Edit Pending Post
      axios.put("pendings/" + post.userPendingPostId, { content: orderGroceries }).then((res) => {
        console.log(res.data);
        MySwal.fire({
          title: "Successfully Edited Your Order!",
          text: "You can now go and take your GroSharies",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
          backdrop: false
        });
        setTimeout(() => { navigate("/my-orders", {}); }, 1000);
      }).catch(e => console.log("Edit Pending Post Error", e));
    }

  };

  return (
    <Stack direction="column" flexWrap="wrap" spacing={{ xs: 1, sm: 1, md: 2, lg: 4 }} >

      <Stack direction="column" spacing={1}>
        <Badge color="secondary" sx={{ marginRight: 3 }}
          badgeContent={<Typography variant="overline">{post.status}</Typography>} >
          <Typography variant="h3" mb="2%" >{post.headline}</Typography>
        </Badge>
        <Typography variant="h6" color="text.secondary">{post.description}</Typography>
      </Stack>

      <Stack sx={{ width: '100%' }} direction="row" alignItems="center" justifyContent="center" flexWrap="wrap">
        <Paper elevation={2} sx={{ margin: "1%", width: "fit-content", padding: "0.5%", borderRadius: "10px", border: "solid 1px white" }}>
          <ImageGallery
            items={convertImagesToItems(post)}
            slideDuration={600} autoPlay={false} showPlayButton={false} showBullets showIndex useBrowserFullscreen={false} />
        </Paper>

        <Paper elevation={2} sx={{ margin: "1%", width: "max-content", padding: "0.5%", border: "solid 1px white", borderRadius: "10px", }}>
          <Typography gutterBottom variant="h6"><LocationOnIcon color="primary" fontSize="large" sx={{ verticalAlign: "middle" }} />{post.address}</Typography>
          <Map
            sx={mobileScreen ? { width: "300px", height: "350px" } : { width: "400px", height: "450px" }}
            locations={[{ ...post.addressCoordinates, address: post.address }]}
            center={post.addressCoordinates} />
        </Paper>

        <Paper elevation={2} sx={{ margin: "1%", width: "fit-content", padding: '0.5%', border: "solid 1px white", borderRadius: "10px", }}>
          <Typography gutterBottom variant="h6" align="center">PickUp Dates</Typography>
          <PickupDatesCalendar post={post} />
        </Paper>
      </Stack>

      <Divider variant="middle"><Typography variant="h4">Products</Typography></Divider>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ width: '100%' }} direction="row" flexWrap="wrap" justifyContent="center">
          <Products post={post} />
        </Stack>

        <Stack direction="row" justifyContent="center" sx={{ marginTop: "7%", marginBottom: "7%" }}>
          <Button variant="contained" type="submit">{isEdit ? "Edit Order" : "Create Order"}</Button>
        </Stack>

      </form>
    </Stack >
  );
};

export default Post;
