import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Box, Button, Slider, CardMedia, } from "@mui/material";
import Calander from "react-calendar"
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import serverRoutes from "../../utils/server-routes";
import axios from "../../utils/axios";
import Map from "../map/Map";
import 'react-calendar/dist/Calendar.css';
import './post.css';

const MySwal = withReactContent(Swal);

function isDateInRange(date, dateFrom, dateTo) {
  return date >= dateFrom && date <= dateTo;
}


const Post = () => {
  const res = useLocation().state;

  //TODO: Get Post from api using post ID from URL instaed of props from state (may be null)

  const isEdit = res.isEdit;
  let navigate = useNavigate();
  const { handleSubmit, control } = useForm();
  const tileClassName = ({ date, view }) => {
    const dates = res.post.pickUpDates
    return (view === 'month') && // Block day tiles only
      dates.some(pickUpDate => {
        console.log("pickup", pickUpDate)
        return isDateInRange(date, new Date(pickUpDate.from).setHours(0, 0, 0, 0), new Date(pickUpDate.until))
      }) ? "active-date" : null;
  }
  const tileDisabled = ({ date, view }) => {
    const dates = res.post.pickUpDates
    console.log(date)
    return (view === 'month') && // Block day tiles only
      dates.some(pickUpDate => {
        console.log("pickup", pickUpDate)
        return !isDateInRange(date, new Date(pickUpDate.from).setHours(0, 0, 0, 0), new Date(pickUpDate.until))
      })
  }
  const onSubmit = (data) => {

    if (!isEdit) {
      const updatedGroceries = res.post.content.map((groceryWrapper) => {
        groceryWrapper.original.amount = data[groceryWrapper.original.name];
        return groceryWrapper.original;
      });
      axios
        .post(serverRoutes.ApplyPost, {
          postId: res.post._id,
          collectorId: "",
          groceries: updatedGroceries,
        })
        .then((res) => {
          console.log(res.data);
          MySwal.fire({
            title: "Successfully Apply Your Order!",
            text: "You can now go and take your donation",
            icon: "success",
            timer: 1000,
            showConfirmButton: false,
            backdrop: false
          });
          setTimeout(() => {
            navigate("/my-orders", {});
          }, 1000);
        });
    } else {
      axios
        .put("/pendings/" + res.post._id, {
          data,
        })
        .then((res) => {
          console.log(res.data);
          MySwal.fire({
            title: "Successfully Edited Your Order!",
            text: "You can now go and take your donation",
            icon: "success",
            timer: 1000,
            showConfirmButton: false,
            backdrop: false
          });
          setTimeout(() => {
            navigate("/my-orders", {});
          }, 1000);
        });
    }
  };

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

  const products = res.post.content.map((groceryWrapper, index) => {
    const grocery = groceryWrapper.original
      ? groceryWrapper.original
      : groceryWrapper;
    return (
      <Box
        key={index}
        sx={{
          display: "flex",
          margin: "3% 0",
          justifyContent: "space-evenly",
          width: "45%",
        }}
      >
        <CardMedia
          component="img"
          sx={{
            padding: 1,
            borderRadius: "10px",
            height: "160px",
            width: "auto",
          }}
          image="/assets/default-post-image.svg"
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            margin: "auto 10% auto 0",
          }}
        >
          <Typography component="div" variant="h6" mb="2%" fontFamily="Roboto">
            {`Name: ${grocery.name}`}
          </Typography>
          <Typography component="div" variant="h6" mb="2%" fontFamily="Roboto">
            {`Total Amount: ${isEdit
              ? groceryWrapper.amount + groceryWrapper.left
              : groceryWrapper.left
              }  ${grocery.scale}`}
          </Typography>

          <Box sx={{ width: "300px" }}>
            <Controller
              control={control}
              name={grocery.name}
              defaultValue={isEdit ? groceryWrapper.amount : 0}
              render={({ field: { value, onChange } }) => (
                <Typography variant="h6" color="red" component="div">
                  {`Your Amount: ${value} ${grocery.scale}`}
                  <Slider
                    aria-label="Small steps"
                    step={1}
                    marks
                    min={0}
                    max={
                      isEdit
                        ? groceryWrapper.amount + groceryWrapper.left
                        : groceryWrapper.left
                    }
                    valueLabelDisplay="auto"
                    onChange={(e) => {
                      onChange(e.target.value);
                    }}
                    name={grocery.name}
                    value={value}
                  />
                </Typography>
              )}
            />
          </Box>
        </Box>
      </Box>
    );
  });

  return (
    <Box style={{ margin: "0 10%", height: "100%", width: "80%" }}>
      <Box
        sx={{
          justifyContent: "space-between",
          display: "flex",
          margin: "3% 0",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            margin: "auto 10% auto 0",
          }}
        >
          <Typography component="div" variant="h3" mb="2%" fontFamily="Roboto">
            {res.post.headline}
          </Typography>
          <Typography variant="h6" color="text.secondary" component="div">
            {res.post.description}
          </Typography>
        </Box>

        <CardMedia
          component="img"
          sx={{
            padding: 1,
            borderRadius: "10px",
            height: "250px",
            width: "auto",
          }}
          image="/assets/default-post-image.svg"
        />
      </Box>

      <Map locations={res.post.addressCoordinates && [{ ...res.post.addressCoordinates, address: res.post.address }]} center={res.post.addressCoordinates} />

      <Box sx={{ width: "600px", height: "600px", margin: "0 auto" }}>
        <Typography
          gutterBottom
          fontSize="25px"
          fontWeight="bold"
          color="text.secondary"
        >
          Gallery
        </Typography>
        <ImageGallery items={imagesAndVideos} autoPlay />
      </Box>

      <Typography
        gutterBottom
        fontSize="25px"
        fontWeight="bold"
        color="text.secondary"
      >
        <Calander style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }} tileClassName={tileClassName} tileDisabled={tileDisabled}
          tileContent={
            ({ activeStartDate, date, view }) => {
              return <div className="tooltip"><sapn className="tooltiptext" >Hi</sapn></div>
            }
          }
        >
        </Calander>
        Products
      </Typography >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
          {products}
        </Box>
        <Button
          sx={{ ml: "10%" }}
          variant="contained"
          disableElevation
          type="submit"
        >
          {isEdit ? "Edit" : "Apply"}
        </Button>
      </form>
    </Box >


  );
};

export default Post;
