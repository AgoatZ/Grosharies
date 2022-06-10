import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from "../../App";
import { Container, Typography } from "@mui/material";

const Profile = () => {
  const { userData } = useContext(AppContext);

  return (
    <Container>
      <Typography variant="h5">Profile Page</Typography>
      <Typography variant="p">
        {userData.firstName} {userData.lastName}
      </Typography>
    </Container>
  );
};

export default Profile;
