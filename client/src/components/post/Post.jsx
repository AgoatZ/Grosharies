import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Typography, Box, Button, Slider, CardMedia } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import serverRoutes from "../../utils/server-routes";
import axios from "../../utils/axios";
import { PostDummy } from "../../utils/dummies";

const MySwal = withReactContent(Swal);

const Post = () => {
  let navigate = useNavigate();
  const { handleSubmit, control } = useForm();
  const [post, setPost] = useState(PostDummy);
  const passedState = useLocation().state;
  const isEdit = passedState.isEdit ? passedState.isEdit : false;
  const postId = passedState.postId;
  const content = passedState.content; //TODO:


  //axios.get('posts/' + postId).then((res) => setPost(res.data.post)).catch(console.log("ERROR"));
  axios.get('posts/' + postId).then((res) => setPost(res.data.post));

  const imagesAndVideos = [
    {
      original: "https://picsum.photos/id/1018/1000/600/",
      thumbnail: "https://picsum.photos/id/1018/250/150/",
    },
    {
      original: "https://picsum.photos/id/1015/1000/600/",
      thumbnail: "https://picsum.photos/id/1015/250/150/",
    },
    {
      original: "https://picsum.photos/id/1019/1000/600/",
      thumbnail: "https://picsum.photos/id/1019/250/150/",
    },
  ];

  const Products = ({ post }) => {
    //const grocery = groceryWrapper.original ? groceryWrapper.original : groceryWrapper;

    //console.log(grocery);
    return (
      post.content.map((grocery) => (
        <Box key={grocery._id} sx={{ display: "flex", margin: "3% 0", justifyContent: "space-evenly", width: "45%", }}>
          <CardMedia image="/assets/default-post-image.svg" component="img" sx={{ padding: 1, borderRadius: "10px", height: "160px", width: "auto", }} />
          <Box sx={{ display: "flex", flexDirection: "column", margin: "auto 10% auto 0", }}>
            <Typography component="div" variant="h6" mb="2%" >
              {`Name: ${grocery.original.name}`}
            </Typography>
            <Typography component="div" variant="h6" mb="2%" >
              {`Total Amount: ${isEdit ? grocery.original.amount + grocery.left :
                grocery.left}  ${grocery.original.scale}`}
            </Typography>

            <Box sx={{ width: "300px" }}>
              <Controller
                control={control}
                name={grocery.original.name}
                defaultValue={isEdit ? grocery.original.amount : 0}
                render={({ field: { value, onChange } }) => (
                  <Typography variant="h6" color="red" component="div">
                    {`Your Amount: ${value} ${grocery.original.scale}`}
                    <Slider
                      marks
                      step={1}
                      min={0}
                      max={isEdit ? grocery.original.amount + grocery.left : grocery.left}
                      valueLabelDisplay="auto"
                      onChange={(e) => { onChange(e.target.value); }}
                      name={grocery.original.name}
                      value={value}
                    />
                  </Typography>
                )}
              />
            </Box>
          </Box>
        </Box>
      ))
    )
  };

  const onSubmit = (data) => {
    //TODO: 
    console.log(data)

    const updatedGroceries = post.content.map((grocery) => {
      grocery.original.amount = data[grocery.original.name];

      //console.log(groceryWrapper)

      return grocery.original;
    });

    if (!isEdit) {
      axios.post(serverRoutes.ApplyPost, {
        postId: post._id,
        collectorId: "",
        groceries: updatedGroceries,
      }).then((res) => {
        console.log(res.data);
        MySwal.fire({
          title: "Successfully Applied Your Order!",
          text: "You can now go and take your GroSharies",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
          backdrop: false
        });
        setTimeout(() => { navigate("/my-orders", {}); }, 1000);
      });
    } else {
      axios.put("/pendings/" + post._id, { data, })
        .then((res) => {
          console.log(res.data);
          MySwal.fire({
            title: "Successfully Edited Your Order!",
            text: "You can now go and take your donation",
            icon: "success",
            timer: 1000,
            showConfirmButton: false,
          });
          setTimeout(() => { navigate("/my-orders", {}); }, 1000);
        });
    }
  };


  return (
    <Box sx={{ margin: "0 10%" }}>
      <Box sx={{ justifyContent: "space-between", display: "flex", margin: "3% 0", }}>
        <Box sx={{ display: "flex", flexDirection: "column", margin: "auto 10% auto 0", }}>
          <Typography component="div" variant="h3" mb="2%" >{post.headline}</Typography>
          <Typography variant="h6" color="text.secondary" component="div">{post.description}</Typography>
        </Box>
        <CardMedia image="/assets/default-post-image.svg" component="img" sx={{ padding: 1, borderRadius: "10px", height: "250px", width: "auto", }} />
      </Box>
      <Box sx={{ flexDirection: "row", display: "flex" }}>
        <LocationOnIcon color="primary" fontSize="large" />
        <Typography gutterBottom fontSize="25px" fontWeight="bold" color="text.secondary">{post.address}</Typography>
      </Box>

      <Box sx={{ width: "600px", height: "600px", margin: "0 auto" }}>
        <Typography gutterBottom fontSize="25px" fontWeight="bold" color="text.secondary">Gallery</Typography>
        <ImageGallery items={imagesAndVideos} autoPlay />
      </Box>

      <Typography gutterBottom fontSize="25px" fontWeight="bold" color="text.secondary">Products</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
          <Products post={post} />
        </Box>
        <Button sx={{ ml: "10%" }} variant="contained" disableElevation type="submit">{isEdit ? "Edit Order" : "Create Order"}</Button>
      </form>
    </Box>
  );
};

export default Post;
