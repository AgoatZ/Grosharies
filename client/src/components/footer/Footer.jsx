import React from 'react';
import { AppBar, Box, Toolbar, Typography, Menu, Container, Button, MenuItem } from '@mui/material';

const pages = ['About'];

const Footer = () => {

  const handleClick = () => {
    
  };

  return (
    <AppBar position="relative" sx={{ top: 'auto', bottom: 0}}>
      <Toolbar>
        <Container maxWidth="xl">
           <Box >
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleClick}
                sx={{  color: 'white' }}
              >
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
