import { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import Geocode from "react-geocode";
import Marker from "./Marker";

const Map = (props) => {
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();

  const defaultProps = {
    center: {
      lat: 32.077299,
      lng: 34.849206,
    },
    zoom: 20,
  };

  useEffect(() => {
    Geocode.setApiKey("AIzaSyCikGIFVg1fGrX4ka60a35awP_27npk0tc");
    Geocode.fromAddress("givat shmuel, israel").then(
      (response) => {
        setLat(response.results[0].geometry.location.lat);
        setLng(response.results[0].geometry.location.lng);

        console.log(lat, lng);
      },
      (error) => {
        console.error(error);
      }
    );
  });

  return (
    <div
      style={{
        height: "25%",
        width: "60%",
        margin: "0 auto",
        marginBottom: "50px",
      }}
    >
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyCikGIFVg1fGrX4ka60a35awP_27npk0tc" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <Marker lat={lat} lng={lng} />
        {/* <Marker lat={props.userLocation.lat} lng={props.userLocation.lng} /> */}
      </GoogleMapReact>
    </div>
  );
};

export default Map;
