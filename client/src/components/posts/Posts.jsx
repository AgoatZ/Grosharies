import PostCard from "../post/PostCard";
import { Grid, Container } from "@mui/material";
import Map from "../map/Map";
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";


const Posts = ({ data, noBorder, showMap }) => {
  const navigate = useNavigate();
  const [nearbyPostsLocations, setNearbyPostsLocations] = useState([]);
  const [userLocation, setUserLocation] = useState({})
  const containerBorderStyle = noBorder ? {} : {
    border: { md: "solid lightgray 1px", xl: "solid lightgray 1px" },
    borderRadius: "10px",
  };
  useEffect(() => {
    if (!showMap) return;
    //use Effect only occured when map representation need to be showen
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setNearbyPostsLocations(
          data.map((post) => {
            console.log("DEBUG ", post.addressCoordinates);
            return {
              ...post.addressCoordinates,
              address: post.address,
              onClick: () => {
                console.log("id ", post._id);
                navigate("/post/" + post._id, {
                  state: { postId: post._id },
                });
              },
            };
          })
        );
      })
    }
  }, [])


  return (
    showMap ? <Map
      sx={{
        height: "450px",
        width: { sm: "500px", md: "850px" },
        marginBottom: "100px",
      }}
      addCenterPoint={true}
      locations={nearbyPostsLocations}
      center={userLocation}
      zoom={12}
    /> :
      <Container disableGutters>
        <Grid container spacing={{ xs: 1, sm: 1, md: 2, lg: 2 }} justifyContent="center" sx={containerBorderStyle}>
          {data.map((post) => {
            return (
              <Grid item key={post._id}>
                <PostCard post={post} />
              </Grid>
            )
          })}
        </Grid>
      </Container>
  );
};

export default Posts;
