import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Button, Tooltip, MenuItem, Drawer, List, ListItem, ListItemText, ListItemIcon, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import EventIcon from '@mui/icons-material/Event';
import { UserImageThumbnail } from '../common/Images';

const Header = () => {
  //General navigation 
  let navigate = useNavigate();
  const handleClickItemMenu = (event) => {
    setUserMenuAnchorEl(null);
    const target = event.currentTarget.innerText.toLowerCase();
    navigate("./" + target, {});
  };

  //Navigation menu setup (drawer and bar)
  const [navDrawerState, setNavDrawerState] = useState(false);
  const toggleNavDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift"))
      return;
    setNavDrawerState(open);
  };
  const navMenu =
    [
      <MenuItem key='Groceries' onClick={handleClickItemMenu}>
        <ListItemIcon><ShoppingBasketIcon /></ListItemIcon>
        <ListItemText primary='Groceries' />
      </MenuItem>,
      <MenuItem key='Events' onClick={handleClickItemMenu}>
        <ListItemIcon><EventIcon /></ListItemIcon>
        <ListItemText primary='Events' />
      </MenuItem>
    ];

  //User menu setup
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const handleOpenUserMenu = (event) => setUserMenuAnchorEl(event.currentTarget);
  const handleCloseUserMenu = () => setUserMenuAnchorEl(null);
  const userMenu =
    [
      <MenuItem button key='Profile' onClick={handleClickItemMenu}>
        <ListItemText primary='Profile' />
      </MenuItem>,
      <MenuItem button key='Account' onClick={handleClickItemMenu}>
        <ListItemText primary='Account' />
      </MenuItem>,
      <Divider />,
      <MenuItem button key='Logout' onClick={handleClickItemMenu}>
        <ListItemText primary='Logout' />
      </MenuItem>
    ];

  //User Data Setup
  const [noUser, setNoUser] = useState(true);
  const [userData, setUser] = useState(() => {

    //TODO: add request to get user's status and data

    //if no user is signed in
    //setNoUser(true);

    //if the user is signed in
    setNoUser(false);
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

    return fakeUser;
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

            {/* User Profile Setup */}
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

            {/* User Profile Setup */}
            <Box sx={{ flexGrow: 0 }} hidden={Boolean(!noUser)}>
              <Button size='small' variant="outlined" sx={{ color: 'white', border: '1px solid white' }}>Sign In</Button>
            </Box>

          </Toolbar>
        </Container>
      </AppBar>
      <Offset />
    </Box>
  );
};

export default Header;
