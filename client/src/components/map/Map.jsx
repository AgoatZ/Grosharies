import GoogleMapReact from "google-map-react";
import Marker from "./Marker";

const Map = ({ locations, center, addCenterPoint = false, zoom = 15, centerAddress = "Me", sx }) => {

  // set with defualt values if not exist
  const centerLocation = center || {
    lat: 32.077299,
    lng: 34.849206,
  }
  console.log(locations)

  return (
    <div
      style={sx || {
        height: "400px",
        width: "60%",
        //margin: "0 auto",
        marginBottom: "100px",

      }}
    >
      <GoogleMapReact
        //TODO: remove api key
        bootstrapURLKeys={{ key: "AIzaSyCikGIFVg1fGrX4ka60a35awP_27npk0tc" }}
        defaultCenter={centerLocation}
        defaultZoom={zoom}
      >
        {locations && locations.map(({ lat, lng, address }, index) => <Marker key={index} address={address} lat={lat} lng={lng} pinOnClick={() => { console.log("Clicked on Me!") }}></Marker>)}
        {addCenterPoint && <Marker color={"black"} address={centerAddress} lat={centerLocation.lat} lng={centerLocation.lng} />}
      </GoogleMapReact>
    </div >
  );
};

export default Map;
