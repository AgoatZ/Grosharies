import PostCard from "./PostCard";
import { Grid, Skeleton } from "@mui/material";
import Map from "../map/Map";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Posts = ({ data, showMap }) => {
  const navigate = useNavigate();
  const [nearbyPostsLocations, setNearbyPostsLocations] = useState([]);
  const [userLocation, setUserLocation] = useState({});
  const mapSize = { height: "500px", width: { xs: "300px", sm: "500px", md: "850px" }, marginBottom: "100px", }

  useEffect(() => {
    if (!showMap) return;
    //use Effect only occured when map representation need to be showen
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude, });
        setNearbyPostsLocations(
          data.map((post) => {
            return {
              ...post.addressCoordinates, address: post.address,
              onClick: () => { navigate("/post/" + post._id); },
            };
          })
        );
      });
    }
    // eslint-disable-next-line
  }, []);


  if (showMap) {
    return (
      !nearbyPostsLocations.length === 0 && !userLocation ?
        (<Skeleton variant="rectangular" sx={mapSize} />) :
        (<Map
          sx={mapSize}
          addCenterPoint={true}
          locations={nearbyPostsLocations}
          center={userLocation}
          zoom={12}
        />)
    );
  }

  return (
    <Grid container spacing={{ xs: 1, sm: 1, md: 2, lg: 2 }} justifyContent="center">
      {data.map((post) => {
        return (
          <Grid item key={post._id}>
            <PostCard post={post} />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Posts;
