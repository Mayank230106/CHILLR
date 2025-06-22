import React from 'react';
import {
  Box, AppBar, Toolbar, Typography, Drawer,
  List, ListItem, ListItemIcon, ListItemText,
  CssBaseline, IconButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

// ✅ Higher Order Component pattern
export const Layout = (Component) => {
  return function WrappedWithLayout(props) {
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
      // TODO: Add logout logic (e.g., clearing tokens, redirecting)
      console.log('Logging out...');
    };

    const drawer = (
      <div>
        <Toolbar>
          <Typography variant="h6" noWrap>
            MyApp
          </Typography>
        </Toolbar>
        <List>
          <ListItem button component={Link} to="/">
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/history">
            <ListItemIcon><HistoryIcon /></ListItemIcon>
            <ListItemText primary="History" />
          </ListItem>
          <ListItem button component={Link} to="/settings">
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </div>
    );

    return (
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        
        {/* App Bar */}
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                Dashboard
              </Typography>
            </Box>

            {/* Logout Icon Button */}
            <IconButton
              color="inherit"
              edge="end"
              aria-label="logout"
              onClick={handleLogout}
            >
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Navigation Drawer */}
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          {/* Mobile Drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>

          {/* Desktop Drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          <Toolbar />
          <Component {...props} />
        </Box>
      </Box>
    );
  };
};
