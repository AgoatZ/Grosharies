import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Button, Tooltip, MenuItem, Drawer, List, ListItem, ListItemText, ListItemIcon, Divider, Icon } from '@mui/material';
import { styled } from '@mui/material/styles';
import { UserImageThumbnail } from '../common/Images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const pages = ['Groceries', 'Events'];
const userOptions = ['Profile', 'Account', 'Logout'];

//props - noUser(Boolean) userData(DB User Schema)
const Header = ({ noUser, userData }) => {

  //Generic item click navigation 
  let navigate = useNavigate();
  const navigateToPage = (event) => {
    const target = event.currentTarget.innerText.toLowerCase();
    navigate("./" + target, {});
  };

  const NavigationBar = () => {
    return (
      <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
        <MenuItem key={pages[0]} onClick={navigateToPage}>
          <ListItemIcon><FontAwesomeIcon icon="fa-solid fa-apple-whole" size='lg' color='white' /></ListItemIcon>
          <ListItemText primary={pages[0]} />
        </MenuItem>
        <MenuItem key={pages[1]} onClick={navigateToPage}>
          <ListItemIcon><FontAwesomeIcon icon="fa-solid fa-calendar" size='lg' color='white' /></ListItemIcon>
          <ListItemText primary={pages[1]} />
        </MenuItem>
      </Box>
    );
  }

  const NavigationDrawer = () => {
    const [navDrawerState, setNavDrawerState] = useState(false);
    const toggleNavDrawer = (open) => (event) => {
      if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift"))
        return;
      setNavDrawerState(open);
    };

    return (
      <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
        <IconButton onClick={toggleNavDrawer(true)} >
          <FontAwesomeIcon icon="fa-solid fa-bars" color='white' size='sm' />
        </IconButton>
        <Drawer
          anchor="left"
          disableScrollLock
          open={navDrawerState}
          onClose={toggleNavDrawer(false)}>
          <Box onClick={toggleNavDrawer(false)} onKeyDown={toggleNavDrawer(false)} >
            <List>
              <MenuItem key={pages[0]} onClick={navigateToPage}>
                <ListItemIcon><FontAwesomeIcon icon="fa-solid fa-apple-whole" size='lg' /></ListItemIcon>
                <ListItemText primary={pages[0]} />
              </MenuItem>
              <MenuItem key={pages[1]} onClick={navigateToPage}>
                <ListItemIcon><FontAwesomeIcon icon="fa-solid fa-calendar" size='lg' /></ListItemIcon>
                <ListItemText primary={pages[1]} />
              </MenuItem>
            </List>
          </Box>
        </Drawer>
      </Box>
    );
  }

  const UserOptions = () => {
    const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
    const handleOpenUserMenu = (event) => setUserMenuAnchorEl(event.currentTarget);
    const handleCloseUserMenu = () => setUserMenuAnchorEl(null);

    return (
      <Box sx={{ flexGrow: 0 }} hidden={noUser}>
        {/* User Pending GroSharies */}
        <IconButton >
          <FontAwesomeIcon icon="fa-solid fa-basket-shopping" color='white' size='lg' />
        </IconButton>

        {/* User Options Menu */}
        <Tooltip title="Open User Menu">
          <IconButton onClick={handleOpenUserMenu}>
            <UserImageThumbnail src={userData.profileImage} />
          </IconButton>
        </Tooltip>
        <Menu
          keepMounted
          disableScrollLock
          sx={{ mt: '45px' }}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          anchorEl={userMenuAnchorEl}
          open={Boolean(userMenuAnchorEl)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem key={userOptions[0]} onClick={navigateToPage}>
            <ListItemText primary={userOptions[0]} />
          </MenuItem>
          <MenuItem key={userOptions[1]} onClick={navigateToPage}>
            <ListItemText primary={userOptions[1]} />
          </MenuItem>
          <Divider />
          <MenuItem key={userOptions[2]} onClick={navigateToPage}>
            <ListItemText primary={userOptions[2]} />
          </MenuItem>
        </Menu>
      </Box>
    );
  }

  const NoUser = () => {
    return (
      <Box sx={{ flexGrow: 0 }} hidden={!noUser}>
        <Button onClick={navigateToPage} size='small' variant="outlined" sx={{ color: 'white', border: '1px solid white' }}>Login</Button>
      </Box>
    );
  }

  const Logo = () => { return <img src={'/assets/logo_label_white.png'} height='30px' width='100px' /> }
  const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

  return (
    <Box>
      <AppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters>

            {/* Large Screen Setup */}
            <Button onClick={() => navigate("/")} sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}><Logo /></Button>
            <NavigationBar />

            {/* Small Screen Setup */}
            <NavigationDrawer />
            <Button onClick={() => navigate("/")} sx={{ justifyContent: 'left', flexGrow: 1, display: { xs: 'flex', md: 'none' } }}><Logo /></Button>

            {/* User Setup */}
            <UserOptions />

            {/* No User Setup */}
            <NoUser />

          </Toolbar>
        </Container>
      </AppBar>
      <Offset />
    </Box>
  );
};

export default Header;



