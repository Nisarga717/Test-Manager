import React, { useState } from "react";
import { 
  AppBar, 
  Toolbar, 
  Button, 
  IconButton, 
  Typography,
  Box,
  Tooltip,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { 
  Brightness4, 
  Brightness7,
  Menu as MenuIcon,
  Dashboard,
  ListAlt,
  Folder,
  AccountCircle,
  ExpandMore,
  Settings,
  ExitToApp
} from "@mui/icons-material";

const Navbar = ({ darkMode, setDarkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  
  // For mobile drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // For user menu
  const [anchorEl, setAnchorEl] = useState(null);
  const userMenuOpen = Boolean(anchorEl);
  
  const handleUserMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Check if route is active
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { title: "Dashboard", path: "/dashboard", icon: <Dashboard /> },
    { title: "Test Cases", path: "/test-cases", icon: <ListAlt /> },
    { title: "Test Suites", path: "/test-suites", icon: <Folder /> }
  ];
  
  const renderMobileDrawer = () => (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={() => setDrawerOpen(true)}
      >
        <MenuIcon />
      </IconButton>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setDrawerOpen(false)}
        >
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              Test Manager
            </Typography>
          </Box>
          <Divider />
          <List>
            {navItems.map((item) => (
              <ListItem 
                button 
                key={item.title} 
                component={Link} 
                to={item.path}
                selected={isActive(item.path)}
                sx={{
                  backgroundColor: isActive(item.path) ? 
                    (darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)') : 
                    'transparent'
                }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem button onClick={() => setDarkMode(!darkMode)}>
              <ListItemIcon>
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </ListItemIcon>
              <ListItemText primary={darkMode ? "Light Mode" : "Dark Mode"} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
  
  const renderDesktopNav = () => (
    <>
      <Typography variant="h6" component="div" sx={{ 
        flexGrow: 0,
        fontWeight: 'bold',
        mr: 3
      }}>
        Test Manager
      </Typography>
      
      <Box sx={{ flexGrow: 1, display: 'flex' }}>
        {navItems.map((item) => (
          <Button
            key={item.title}
            component={Link}
            to={item.path}
            sx={{
              mx: 0.5,
              color: 'white',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '3px',
                backgroundColor: theme.palette.secondary.main,
                transform: isActive(item.path) ? 'scaleX(1)' : 'scaleX(0)',
                transition: 'transform 0.3s ease-in-out'
              }
            }}
            startIcon={item.icon}
          >
            {item.title}
          </Button>
        ))}
      </Box>
    </>
  );
  
  return (
    <AppBar position="static" 
      elevation={4}
      sx={{
        backgroundColor: darkMode ? 
          theme.palette.primary.dark : 
          theme.palette.primary.main
      }}
    >
      <Toolbar>
        {isMobile ? renderMobileDrawer() : renderDesktopNav()}
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!isMobile && (
            <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
              <IconButton 
                color="inherit" 
                onClick={() => setDarkMode(!darkMode)} 
                sx={{ mr: 1 }}
              >
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>
          )}
          
          <Box>
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleUserMenuClick}
                size="small"
                aria-controls={userMenuOpen ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={userMenuOpen ? 'true' : undefined}
                color="inherit"
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.secondary.main }}>U</Avatar>
                  {!isMobile && (
                    <ExpandMore fontSize="small" sx={{ ml: 0.5 }} />
                  )}
                </Box>
              </IconButton>
            </Tooltip>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={userMenuOpen}
            onClose={handleUserMenuClose}
            onClick={handleUserMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem>
              <ListItemIcon>
                <ExitToApp fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;