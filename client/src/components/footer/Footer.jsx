import React from 'react';
import { useNavigate } from "react-router-dom";
import { AppBar, Box, Toolbar, Container, Button } from '@mui/material';
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
    <Box >
      <Offset />
      <AppBar position="sticky" sx={{ top: 'auto', bottom: 0 }}>
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
    </Box>
  );
};
export default Footer;
