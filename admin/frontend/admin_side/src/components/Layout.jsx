import React, { useContext } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Drawer as MuiDrawer,
  CssBaseline,
  IconButton,
  Avatar,
  Tooltip,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';

const DRAWER_WIDTH = 280;

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
}));

const Drawer = styled(MuiDrawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: DRAWER_WIDTH,
    boxSizing: 'border-box',
    borderRight: 'none',
    boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
    overflowX: 'hidden',
  },
}));

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'History',   icon: <HistoryIcon />,   path: '/history' },
  { text: 'Profile',   icon: <SettingsIcon />,   path: '/profile' },
];

export const Layout = (Component) => {
  return function Wrapped(props) {
    const theme = useTheme();
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const doLogout = () => {
      logout();
      navigate('/login');
    };

    return (
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <CssBaseline />

        <AppBar position="fixed" elevation={0}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h5" noWrap>
              {navItems.find(i => i.path === location.pathname)?.text ?? 'MyApp'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Tooltip title="Notifications">
                <IconButton color="inherit">
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={`Logout ${user?.name}`}>
                <IconButton color="inherit" onClick={doLogout}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.name?.charAt(0)}
              </Avatar>
            </Box>
          </Toolbar>
        </AppBar>

        <Drawer variant="permanent">
          <Toolbar /> {/* pushes below AppBar */}
          <Divider />
          <List>
            {navItems.map(item => (
              <ListItemButton
                key={item.text}
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  mb: 1,
                  mx: 1,
                  borderRadius: 2,
                  '&.Mui-selected': {
                    background: theme.palette.primary.main,
                    color: '#fff',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color:
                      location.pathname === item.path
                        ? '#fff'
                        : theme.palette.text.primary,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>
        </Drawer>
<Box
  component="main"
  sx={{
    position: 'absolute',
    top: theme.mixins.toolbar.minHeight,   // sit below AppBar
    left: DRAWER_WIDTH,                     // sit to the right of Drawer
    right: 0,                               // stretch all the way to the right
    bottom: 0,                              // stretch to bottom
    overflow: 'auto',
    p: 3,
    boxSizing: 'border-box',
  }}
>
  <Component {...props} />
</Box>



      </Box>
    );
  };
};
