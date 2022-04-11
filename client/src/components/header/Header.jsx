import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { UserImageThumbnail } from '../common/Images';

const pages = ['Groceries', 'Events'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const Header = () => {
  let navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleClickItemNavMenu = (event) => {
    setAnchorElNav(null);
    const target = event.currentTarget.innerText.toLowerCase();
    navigate("./" + target, {});
  };

  const handleClickItemUserMenu = (event) => {
    setAnchorElUser(null);
    const target = event.currentTarget.innerText.toLowerCase();
    navigate("./" + target, {});
  };

  const [userData, setUser] = useState({});
  const [noUser, setUserState] = useState(() => {

    //TODO: add request to get user's status

    //if no user is signed in
    //return true;

    //if the user is signed in
    const fakeUser = {
      firstName: "Ilan",
      lastName: "Rozenfeld",
      emailAddress: "Ilan@Walla.com",
      phone: "05000000000",
      accountType: "user",
      rank: 0,
      posts: [],
      profileImage: "/assets/ohad.png",
      collectedHistory: []
    };

    setUser(fakeUser);

    return false;
  });
  
  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          {/* Large Screen Setup */}
          <Button href='/' sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}>
            <img src={'assets/logo_label_white.png'} height='30px' width='100px' />
          </Button>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button key={page} onClick={handleClickItemNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}>
                {page}
              </Button>
            ))}
          </Box>

          {/* Small Screen Setup */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon sx={{ color: 'white' }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              keepMounted
              disableScrollLock
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
              transformOrigin={{ vertical: 'top', horizontal: 'left', }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' }, }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleClickItemNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Button href='/' sx={{ justifyContent: 'left', flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <img src={'assets/logo_label_white.png'} height='30px' width='100px' />
          </Button>

          {/* Profile Icon Setup */}
          <Box sx={{ flexGrow: 0 }} hidden={Boolean(noUser)}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <UserImageThumbnail src={userData.profileImage}/>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              keepMounted
              disableScrollLock
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleClickItemUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Profile Icon Setup */}
          <Box sx={{ flexGrow: 0 }} hidden={Boolean(!noUser)}>
            <Button sx={{ color: 'white' }}>Sign In \ Create account</Button>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
