import React from 'react';
import { AppBar, Box, Toolbar, Typography, Menu, Container, Button, MenuItem } from '@mui/material';
import './Footer.scss';

const pages = ['About'];

const appBarStyle = { backgroundColor: 'rgb(58, 173, 135)' };
const profileStyle = { flexGrow: 1, display: { xs: 'flex', md: 'none' } };
const menuStyle = { display: { xs: 'block', md: 'none' } };
const pagesStyle = { flexGrow: 0, display: { xs: 'none', md: 'flex' } };
const pageButtonStyle = { my: 1, color: 'white', display: 'block', alignContent: 'end' };

const Footer = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleClick = () => {
    setAnchorElNav(null);
  };

  return (
    <footer>
      <AppBar position="static" sx={appBarStyle}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>

            <Box sx={profileStyle}>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                open={true}
                sx={menuStyle}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleClick}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            
            <Box sx={pagesStyle}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleClick}
                  sx={pageButtonStyle}
                >
                  {page}
                </Button>
              ))}
            </Box>

          </Toolbar>
        </Container>
      </AppBar>
    </footer>
  );
};
export default Footer;
