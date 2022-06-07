import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Box, Button, Slider, CardMedia, } from "@mui/material";
import Calander from "react-calendar"
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "../../utils/axios";
import { PostDummy } from "../../utils/dummies";
import Map from "../map/Map";
import 'react-calendar/dist/Calendar.css';
import './post.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const MySwal = withReactContent(Swal);

function isDateInRange(date, dateFrom, dateTo) {
  return date >= dateFrom && date <= dateTo;
}

const findDate = (calDate, dates) => {
  return dates.find((date) => {
    console.log(date.from)
    const from = new Date(date.from).setHours(0, 0, 0, 0)
    const until = new Date(date.until).setHours(0, 0, 0, 0)
    const pickedDate = new Date(calDate).setHours(0, 0, 0, 0)
    console.log("picked up", pickedDate)
    console.log("from", from)
    console.log("to", until)
    console.log(date)

    return from <= pickedDate && pickedDate <= until
  })
}
const Post = () => {
  let navigate = useNavigate();
  const passedState = useLocation().state;
  const sourcePostId = passedState.postId;
  const [post, setPost] = useState(PostDummy);
  const [isEdit, setEdit] = useState(false);
  const [calanderDate, setCalanderDate] = useState({})
  const { handleSubmit, control } = useForm();
  const tileClassName = ({ date, view }) => {
    const dates = post.pickUpDates
    return (view === 'month') && // Block day tiles only
      dates.some(pickUpDate => {
        return isDateInRange(date, new Date(pickUpDate.from).setHours(0, 0, 0, 0), new Date(pickUpDate.until))
      }) ? "active-date" : null;
  }
  const tileDisabled = ({ date, view }) => {
    const dates = post.pickUpDates
    return (view === 'month') && // Block day tiles only
      dates.some(pickUpDate => {
        return !isDateInRange(date, new Date(pickUpDate.from).setHours(0, 0, 0, 0), new Date(pickUpDate.until))
      })
  }
  // const onSubmit = (data) => {

  //   if (!isEdit) {
  //     const updatedGroceries = res.post.content.map((groceryWrapper) => {
  //       groceryWrapper.original.amount = data[groceryWrapper.original.name];
  //       return groceryWrapper.original;
  //     });
  //     axios
  //       .post(serverRoutes.ApplyPost, {
  //         postId: res.post._id,
  //         collectorId: "",
  //         groceries: updatedGroceries,
  //       })
  //       .then((res) => {
  //         console.log(res.data);
  //         MySwal.fire({
  //           title: "Successfully Apply Your Order!",
  //           text: "You can now go and take your donation",
  //           icon: "success",
  //           timer: 1000,
  //           showConfirmButton: false,
  //           backdrop: false
  //         });
  //         setTimeout(() => {
  //           navigate("/my-orders", {});
  //         }, 1000);
  //       });
  //   } else {
  //     axios
  //       .put("/pendings/" + res.post._id, {
  //         data,
  //       })
  //       .then((res) => {
  //         console.log(res.data);
  //         MySwal.fire({
  //           title: "Successfully Edited Your Order!",
  //           text: "You can now go and take your donation",
  //           icon: "success",
  //           timer: 1000,
  //           showConfirmButton: false,
  //           backdrop: false
  //         });
  //         setTimeout(() => {
  //           navigate("/my-orders", {});
  //         }, 1000);
  //       });
  //   }
  // };

  useEffect(() => loadPost(), []);

  const loadPost = () => {
    console.log("Passed State", passedState);
    let post = {}

    axios.get('posts/' + sourcePostId).then((res) => {
      post = res.data.post;

      //Add and Init user's order amount for each grocery item
      post.content.forEach((grocery) => grocery.currentOrder = 0);

      //TODO: Add to API getPendingByPostAndByCollector ?
      //Get user's active order for this post and add it to main post object if exists
      axios.get("pendings/collector/current").then((res) => {
        const userPendingPost = res.data.pendingPosts.find((order) => order.sourcePost == post._id);

        if (userPendingPost) {
          post.userPendingPostId = userPendingPost._id;
          console.log("User's open pending post (order) for this post", userPendingPost);
          //Set the user's order amount for each grocery item
          userPendingPost.content.forEach((orderGrocery) => (post.content.find((grocery) => grocery.original.name === orderGrocery.name).currentOrder = orderGrocery.amount));

          setEdit(true);
          setPost(post);
        } else {
          setPost(post);
        }
      }).catch(e => console.log("Error getting user's pending posts", e));

    }).then(() => {
      console.log("Post", post);
      console.log("Post Content", post.content)
    });
  }

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
    return (
      post.content.map((grocery) => (
        <Box key={grocery._id} sx={{ display: "flex", margin: "3% 0", justifyContent: "space-evenly", width: "45%", }}>
          <CardMedia image="/assets/default-post-image.svg" component="img" sx={{ padding: 1, borderRadius: "10px", height: "160px", width: "auto", }} />
          <Box sx={{ display: "flex", flexDirection: "column", margin: "auto 10% auto 0", }}>
            <Typography component="div" variant="h6" mb="2%" >
              {`Name: ${grocery.original.name}`}
            </Typography>
            <Typography component="div" variant="h6" mb="2%" >
              {`Original Amount: ${grocery.original.amount}  ${grocery.original.scale}`}
            </Typography>
            <Typography component="div" variant="h6" mb="2%" >
              {`Available Amount: ${grocery.left + grocery.currentOrder}  ${grocery.original.scale}`}
            </Typography>

            <Box sx={{ width: "300px" }}>
              <Controller
                control={control}
                name={grocery.original.name}
                defaultValue={grocery.currentOrder}
                render={({ field: { value, onChange } }) => (
                  <Typography variant="h6" color="red" component="div">
                    {`Your Amount: ${value} ${grocery.original.scale}`}
                    <Slider
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
          </Box>
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
    <Box sx={{ margin: "0 10%" }}>
      <Box sx={{ justifyContent: "space-between", display: "flex", margin: "3% 0", }}>
        <Box sx={{ display: "flex", flexDirection: "column", margin: "auto 10% auto 0", }}>
          <Typography component="div" variant="h3" mb="2%" >{post.headline}</Typography>
          <Typography variant="h6" color="text.secondary" component="div">{post.description}</Typography>
        </Box>
        <CardMedia image="/assets/default-post-image.svg" component="img" sx={{ padding: 1, borderRadius: "10px", height: "250px", width: "auto", }} />
      </Box>
      <Box sx={{ flexDirection: "row", display: "flex", flexWrap: "wrap" }}>
        <LocationOnIcon color="primary" fontSize="large" />
        <Typography sx={{ flex: "1 0 38%" }} gutterBottom fontSize="25px" fontWeight="bold" color="text.secondary">{post.address}</Typography>
        <Map sx={{
          height: "450px",
          width: "60%",
          marginBottom: "100px",
        }} locations={post.addressCoordinates && [{ ...post.addressCoordinates, address: post.address }]} center={post.addressCoordinates} />
      </Box>


      <Box sx={{ width: "600px", height: "600px", margin: "0 auto" }}>
        <Typography gutterBottom fontSize="25px" fontWeight="bold" color="text.secondary">Gallery</Typography>
        <ImageGallery items={imagesAndVideos} autoPlay />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
        <Calander style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }} tileClassName={tileClassName} tileDisabled={tileDisabled}
          onClickDay={
            (value, event) => {
              const date = findDate(value, post.pickUpDates)
              console.log(new Date(date.from).getHours())
              setCalanderDate({ ...date, current: value, isRepeated: true })
            }
          }
        >
        </Calander>

        <Box sx={{ visibility: !calanderDate.current ? "hidden" : "visible" }}>
          <h1>{new Date(calanderDate.current).toLocaleString().split(',')[0]}</h1>
          <label>From:</label>
          <Typography>
            {new Date(calanderDate.from).toUTCString().split(' ')[4]}
          </Typography>
          <label>To:</label>
          <Typography>
            {!calanderDate.isRepeated && new Date(calanderDate.until).setHours(0, 0, 0, 0) === new Date(calanderDate.current).setHours(0, 0, 0, 0) ?
              new Date(calanderDate.until).toUTCString().split(' ')[4] : calanderDate.isRepeated ? new Date(calanderDate.until).toUTCString().split(' ')[4] : "End Of Day"
            }
          </Typography>
        </Box>
      </Box>
      <Typography gutterBottom fontSize="25px" fontWeight="bold" color="text.secondary">Products</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
          <Products post={post} />
        </Box>
        <Button sx={{ ml: "10%" }} variant="contained" disableElevation type="submit">{isEdit ? "Edit Order" : "Create Order"}</Button>
      </form>
    </Box >


  );
};

export default Post;
