import GoogleMapReact from "google-map-react";
import Marker from "./Marker";
import { Box } from "@mui/material";

const Map = ({
  locations,
  center,
  addCenterPoint = false,
  zoom = 15,
  centerAddress = "Me",
  sx,
}) => {
  return (
    <Box
      sx={
        sx || {
          height: "400px",
          width: "60%",
          //margin: "0 auto",
          marginBottom: "100px",
        }
      }
    >
      <GoogleMapReact
        //TODO: remove api key
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
        defaultZoom={zoom}
        defaultCenter={{ lat: 35, lng: 35 }}
        center={center}
      >
        {locations &&
          locations.map(({ lat, lng, address, onClick }, index) =>
            lat || lng ? (
              <Marker
                key={index}
                address={address}
                lat={lat}
                lng={lng}
                pinOnClick={onClick}
              ></Marker>
            ) : null
          )}
        {center && addCenterPoint && (
          <Marker
            color={"black"}
            address={centerAddress}
            lat={center.lat}
            lng={center.lng}
          />
        )}
      </GoogleMapReact>
    </Box>
  );
};

export default Map;
