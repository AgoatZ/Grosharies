import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Box, Toolbar, IconButton, Menu, MenuList, MenuItem, Container, Button, Tooltip, Drawer, List, ListItem, ListItemText, ListItemIcon, Divider, Popper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { UserImageThumbnail } from "../common/Images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const pages = [
  { name: "Groceries", path: "groceries" },
  { name: "Events", path: "events" },
];
const userOptions = [
  { name: "Profile", path: "profile", },
  { name: "My Posts", path: "my-posts", },
  { name: "My Orders", path: "my-orders", },
  { name: "Logout", path: "logout", },
];

const Header = ({ loggedIn, userData, logoutUser }) => {
  //Generic item click navigation
  let navigate = useNavigate();
  const navigateToPage = (path) => navigate("./" + path, {});

  const logout = () => {
    cookies.remove("jwt_token");
    logoutUser();
  };

  const NavigationBar = () => {
    return (
      <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
        <MenuItem
          key={pages[0].name}
          onClick={navigateToPage.bind(this, pages[0].path)}
        >
          <ListItemIcon>
            <FontAwesomeIcon icon="fa-solid fa-apple-whole" size="lg" color="white" />
          </ListItemIcon>
          <ListItemText primary={pages[0].name} />
        </MenuItem>
        <MenuItem
          key={pages[1].name}
          onClick={navigateToPage.bind(this, pages[1].path)}
        >
          <ListItemIcon>
            <FontAwesomeIcon icon="fa-solid fa-calendar" size="lg" color="white" />
          </ListItemIcon>
          <ListItemText primary={pages[1].name} />
        </MenuItem>
      </Box>
    );
  };

  const NavigationDrawer = () => {
    const [navDrawerState, setNavDrawerState] = useState(false);
    const toggleNavDrawer = (open) => (event) => {
      if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift"))
        return;
      setNavDrawerState(open);
    };

    return (
      <Box sx={{ display: { xs: "flex", md: "none" } }}>
        <IconButton onClick={toggleNavDrawer(true)}>
          <FontAwesomeIcon icon="fa-solid fa-bars" color="white" size="sm" />
        </IconButton>
        <Drawer
          anchor="left"
          disableScrollLock
          open={navDrawerState}
          onClose={toggleNavDrawer(false)}
        >
          <Box
            onClick={toggleNavDrawer(false)}
            onKeyDown={toggleNavDrawer(false)}
          >
            <List>
              <MenuItem
                key={pages[0].name}
                onClick={navigateToPage.bind(this, pages[0].path)}
              >
                <ListItemIcon>
                  <FontAwesomeIcon icon="fa-solid fa-apple-whole" size="lg" />
                </ListItemIcon>
                <ListItemText primary={pages[0].name} />
              </MenuItem>
              <MenuItem
                key={pages[1].name}
                onClick={navigateToPage.bind(this, pages[1].path)}
              >
                <ListItemIcon>
                  <FontAwesomeIcon icon="fa-solid fa-calendar" size="lg" />
                </ListItemIcon>
                <ListItemText primary={pages[1].name} />
              </MenuItem>
            </List>
          </Box>
        </Drawer>
      </Box>
    );
  };

  const UserNotifications = () => {
    const [userNotificationsAnchorEl, setUserNotificationsAnchorEl] = useState(null);
    const handleOpenNotifications = (event) => setUserNotificationsAnchorEl(event.currentTarget);
    const handleCloseNotifications = (event) => setUserNotificationsAnchorEl(null);

    if (!loggedIn)
      return;

    return (
      <Box sx={{ flexGrow: 0 }} hidden={!loggedIn}>
        {/* User Notifications Area*/}
        <Tooltip title="Open Notifications">
          <IconButton onClick={handleOpenNotifications}>
            <FontAwesomeIcon icon="fa-regular fa-bell" color="white" size="lg" />
          </IconButton>
        </Tooltip>
        <Menu
          keepMounted
          disableScrollLock
          sx={{ mt: "45px" }}
          anchorEl={userNotificationsAnchorEl}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={Boolean(userNotificationsAnchorEl)}
          onClose={handleCloseNotifications}
        >
          {userData.notifications.map((n) => (
            <MenuItem key={n.postId}
              onClick={navigateToPage.bind(this, 'post/' + n.postId)}>
              <ListItemText
                primary={n.title}
                secondary={n.text} />
            </MenuItem >
          ))}
        </Menu>
      </Box>
    )
  }

  const UserOptions = () => {
    const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
    const handleOpenUserMenu = (event) => setUserMenuAnchorEl(event.currentTarget);
    const handleCloseUserMenu = () => setUserMenuAnchorEl(null);

    if (!loggedIn)
      return;

    return (
      <Box sx={{ flexGrow: 0 }} hidden={!loggedIn}>
        {/* User Options Menu */}
        <Tooltip title="Open User Menu">
          <IconButton onClick={handleOpenUserMenu}>
            <UserImageThumbnail src={userData.profileImage} />
          </IconButton>
        </Tooltip>
        <Menu
          keepMounted
          disableScrollLock
          sx={{ mt: "45px" }}
          anchorEl={userMenuAnchorEl}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={Boolean(userMenuAnchorEl)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem
            key={userOptions[0].name}
            onClick={navigateToPage.bind(this, userOptions[0].path)}
          >
            <ListItemText primary={userOptions[0].name} />
          </MenuItem>
          <MenuItem
            key={userOptions[1].name}
            onClick={navigateToPage.bind(this, userOptions[1].path)}
          >
            <ListItemText primary={userOptions[1].name} />
          </MenuItem>
          <MenuItem
            key={userOptions[2].name}
            onClick={navigateToPage.bind(this, userOptions[2].path)}
          >
            <ListItemText primary={userOptions[2].name} />
          </MenuItem>
          <Divider />
          <MenuItem key={userOptions[3].name} onClick={logout}>
            <ListItemText primary={userOptions[3].name} />
          </MenuItem>
        </Menu>
      </Box >
    );
  };

  const Login = () => {
    return (
      <Box sx={{ flexGrow: 0 }} hidden={loggedIn}>
        <Button
          onClick={navigateToPage.bind(this, "login")}
          size="small"
          variant="outlined"
          sx={{ color: "white", border: "1px solid white" }}
        >
          Login
        </Button>
      </Box>
    );
  };

  const Logo = () => {
    return (
      <img src={"/assets/logo_label_white.png"} height="30px" width="100px" />
    );
  };
  const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

  return (
    <Box>
      <AppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Large Screen Setup */}
            <Button
              onClick={() => navigate("/")}
              sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
            >
              <Logo />
            </Button>
            <NavigationBar />

            {/* Small Screen Setup */}
            <NavigationDrawer />
            <Button
              onClick={() => navigate("/")}
              sx={{
                justifyContent: "left",
                flexGrow: 1,
                display: { xs: "flex", md: "none" },
              }}
            >
              <Logo />
            </Button>

            {/* User Setup */}
            <UserNotifications />
            <UserOptions />

            {/* No User Setup */}
            <Login />
          </Toolbar>
        </Container>
      </AppBar>
      <Offset />
    </Box>
  );
};

export default Header;
