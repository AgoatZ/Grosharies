import React from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Tooltip from '@mui/material/Tooltip';

const Marker = ({ color = "red", pinOnClick, address = "home" }) => {
  return (
    <Tooltip title={address}>
      <LocationOnIcon
        onClick={pinOnClick}
        sx={{ color, width: "35px", height: "35px", ":hover": { width: "42px", height: "42px" } }}
      />
    </Tooltip >
  );
};

export default Marker;
