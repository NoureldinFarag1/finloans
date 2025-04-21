import React, { useState } from 'react';
import { 
  AppBar, Box, Drawer, IconButton, List, ListItem, ListItemIcon, 
  ListItemText, Toolbar, Typography, Divider, Avatar, Menu, MenuItem,
  useMediaQuery, Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AttachMoney as MoneyIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountIcon,
  ExitToApp as LogoutIcon,
  Payment as PaymentIcon,
  Description as DocumentIcon
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Drawer width
const drawerWidth = 240;

const Layout = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for mobile drawer
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // State for user menu
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Toggle drawer for mobile
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  // Open user menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Close user menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Handle logout
  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate('/login');
  };

  // Determine navigation items based on user role
  const getNavigationItems = () => {
    // Default items for all users
    const items = [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    ];

    if (currentUser) {
      switch (currentUser.role) {
        case 'LP': // Loan Provider
          items.push(
            { text: 'Loans', icon: <MoneyIcon />, path: '/loans' },
            { text: 'Payments', icon: <PaymentIcon />, path: '/payments' }
          );
          break;
        case 'LC': // Loan Customer
          items.push(
            { text: 'Apply for Loan', icon: <DocumentIcon />, path: '/apply-loan' },
            { text: 'My Loans', icon: <MoneyIcon />, path: '/my-loans' },
            { text: 'Make Payment', icon: <PaymentIcon />, path: '/make-payment' }
          );
          break;
        case 'BP': // Bank Personnel
          items.push(
            { text: 'Loan Parameters', icon: <SettingsIcon />, path: '/loan-parameters' },
            { text: 'All Loans', icon: <MoneyIcon />, path: '/all-loans' },
            { text: 'Reports', icon: <DocumentIcon />, path: '/reports' }
          );
          break;
        default:
          break;
      }
    }

    return items;
  };

  const navigationItems = getNavigationItems();

  // Drawer content
  const drawerContent = (
    <>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
          FinLoans
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navigationItems.map((item) => (
          <ListItem 
            button 
            component={Link} 
            to={item.path}
            key={item.text}
            selected={location.pathname === item.path}
            onClick={isMobile ? handleDrawerToggle : undefined}
            sx={{
              '&.Mui-selected': {
                bgcolor: 'rgba(36, 81, 183, 0.08)',
                borderRight: `3px solid ${theme.palette.primary.main}`,
                '& .MuiListItemIcon-root': {
                  color: theme.palette.primary.main,
                },
                '& .MuiListItemText-primary': {
                  color: theme.palette.primary.main,
                  fontWeight: 'bold',
                },
              },
              '&:hover': {
                bgcolor: 'rgba(36, 81, 183, 0.04)',
              },
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'white',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="primary"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              display: { xs: 'none', sm: 'block' },
              color: theme.palette.primary.main,
              fontWeight: 'bold'
            }}
          >
            FinLoans
          </Typography>

          {currentUser ? (
            <>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="primary"
              >
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.primary.main,
                    width: 35,
                    height: 35
                  }}
                >
                  {currentUser.username?.charAt(0)?.toUpperCase() || <AccountIcon />}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem disabled>
                  <Typography variant="body2">
                    {currentUser.username}
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button 
                component={Link} 
                to="/login" 
                color="primary" 
                variant="outlined"
                sx={{ mr: 1 }}
              >
                Login
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer for navigation */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          backgroundColor: theme.palette.background.default,
          minHeight: 'calc(100vh - 64px)'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;