import React from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const Marker = ({ color = "red" }) => {
  return (
    <LocationOnIcon
      style={{ color, width: "35px", height: "35px" }}
    ></LocationOnIcon>
  );
};

export default Marker;
