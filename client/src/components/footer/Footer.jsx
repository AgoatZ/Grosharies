import React from 'react';
import { useNavigate } from "react-router-dom";
import { AppBar, Box, Toolbar, Typography, Menu, Container, Button, MenuItem } from '@mui/material';

const pages = ['About'];

const Footer = () => {
  let navigate = useNavigate();

  const handleClickItemNavMenu = (event) => {
    const target = event.currentTarget.innerText.toLowerCase();
    navigate("./" + target, {});
  };

  return (
    <AppBar position="relative" sx={{ top: 'auto', bottom: 0 }}>
      <Toolbar>
        <Container maxWidth="xl">
          <Box >
            {pages.map((page) => (
              <Button key={page} onClick={handleClickItemNavMenu} sx={{ color: 'white' }}>
                {page}
              </Button>
            ))}
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
};
export default Footer;
