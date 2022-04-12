import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Button, Tooltip, MenuItem, Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import EventIcon from '@mui/icons-material/Event';
import { UserImageThumbnail } from '../common/Images';

const Header = () => {
  let navigate = useNavigate();

  //Navigation menu setup
  const [navDrawerState, setNavDrawerState] = useState(false);
  const toggleNavDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift"))
      return;
    open ? setNavDrawerState(true) : setNavDrawerState(false);
  };
  const handleClickItemNavMenu = (event) => {
    const target = event.currentTarget.innerText.toLowerCase();
    navigate("./" + target, {});
  };

  const pagesAndIcons = {
    Groceries: <ShoppingBasketIcon />,
    Events: <EventIcon />
  }
  const navMenu =
    Object.keys(pagesAndIcons).map((page) => (
      <MenuItem button key={page} onClick={handleClickItemNavMenu}>
        <ListItemIcon>{pagesAndIcons[page]}</ListItemIcon>
        <ListItemText primary={page} />
      </MenuItem>
    ));

  //User menu setup
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const handleOpenUserMenu = (event) => setUserMenuAnchorEl(event.currentTarget);
  const handleCloseUserMenu = () => setUserMenuAnchorEl(null);

  const handleClickItemUserMenu = (event) => {
    setUserMenuAnchorEl(null);
    const target = event.currentTarget.innerText.toLowerCase();
    navigate("./" + target, {});
  };

  const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
  const userMenu =
    settings.map((setting) => (
      <MenuItem key={setting} onClick={handleClickItemUserMenu}>
        <Typography textAlign="center">{setting}</Typography>
      </MenuItem>
    ));

  //User Data Setup
  const [userData, setUser] = useState({});
  const [noUser, setUserState] = useState(() => {

    //TODO: add request to get user's status and data

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

  const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);
  return (
    <Box>
      <AppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters>

            {/* Large Screen Setup */}
            <Button href='/' sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}>
              <img src={'assets/logo_label_white.png'} height='30px' width='100px' />
            </Button>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {navMenu}
            </Box>

            {/* Small Screen Setup */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={toggleNavDrawer(true)}
                color="inherit"
              >
                <MenuRoundedIcon sx={{ color: 'white' }} />
              </IconButton>
              <Drawer
                anchor="left"
                disableScrollLock
                open={navDrawerState}
                onClose={toggleNavDrawer(false)}>
                <Box
                  onClick={toggleNavDrawer(false)}
                  onKeyDown={toggleNavDrawer(false)}
                >
                  <List>
                    {navMenu}
                  </List>
                </Box>
              </Drawer>
            </Box>
            <Button href='/' sx={{ justifyContent: 'left', flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <img src={'assets/logo_label_white.png'} height='30px' width='100px' />
            </Button>

            {/* Profile Icon Setup */}
            <Box sx={{ flexGrow: 0 }} hidden={Boolean(noUser)}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <UserImageThumbnail src={userData.profileImage} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={userMenuAnchorEl}
                keepMounted
                disableScrollLock
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(userMenuAnchorEl)}
                onClose={handleCloseUserMenu}
              >
                {userMenu}
              </Menu>
            </Box>

            {/* Profile Icon Setup */}
            <Box sx={{ flexGrow: 0 }} hidden={Boolean(!noUser)}>
              <Button sx={{ color: 'white' }}>Sign In \ Create account</Button>
            </Box>

          </Toolbar>
        </Container>
      </AppBar>
      <Offset />
    </Box>
  );
};

export default Header;
