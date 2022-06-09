import GoogleMapReact from "google-map-react";
import Marker from "./Marker";

const Map = ({
  locations,
  center,
  addCenterPoint = false,
  zoom = 15,
  centerAddress = "Me",
  sx,
}) => {
  // set with defualt values if not exist
  console.log(locations);

  return (
    <div
      style={
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
        bootstrapURLKeys={{ key: "AIzaSyCikGIFVg1fGrX4ka60a35awP_27npk0tc" }}
        defaultZoom={zoom}
        defaultCenter={center}
      >
        {locations &&
          locations.map(({ lat, lng, address, onClick }, index) => (
            <Marker
              key={index}
              address={address}
              lat={lat}
              lng={lng}
              pinOnClick={onClick}
            ></Marker>
          ))}
        {center && addCenterPoint && (
          <Marker
            color={"black"}
            address={centerAddress}
            lat={center.lat}
            lng={center.lng}
          />
        )}
      </GoogleMapReact>
    </div>
  );
};

export default Map;
