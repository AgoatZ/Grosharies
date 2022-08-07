import React from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Container, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const pages = ['About'];

const Footer = () => {
  let navigate = useNavigate();

  const handleClickItemNavMenu = (event) => {
    const target = event.currentTarget.innerText.toLowerCase();
    navigate("./" + target, {});
  };

  const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);
  return (
    < >
      <Offset />
      <Box className="sticky bottom-0" sx={{ bgcolor: "primary.main", height: "max-content", width: "100%" }} >

        <Container maxWidth="xl">
          {pages.map((page) => (
            <Button key={page} onClick={handleClickItemNavMenu} sx={{ color: 'white', margin: "5px" }}>
              {page}
            </Button>
          ))}

        </Container>
      </Box>
    </>
  );
};
export default Footer;
