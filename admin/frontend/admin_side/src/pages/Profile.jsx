import React, { useContext } from 'react';
import {
  Box,
  Typography,
  Button,
  Avatar,
  Divider,
  Paper,
  useTheme,
  IconButton
} from '@mui/material';
import { Email, Person, ExitToApp, ArrowBack } from '@mui/icons-material';
import { AuthContext } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const theme = useTheme();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  const getInitials = (name) =>
    name.split(' ').map((part) => part[0]).join('').toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '100vh',
        bgcolor: theme.palette.background.default,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: { xs: '100%', sm: 400 },
          p: 4,
          borderRadius: theme.shape.borderRadius * 2,
          position: 'relative',
        }}
      >
        {/* ✅ Back Icon */}
        <IconButton
          onClick={() => navigate('/')}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            color: theme.palette.text.secondary,
          }}
        >
          <ArrowBack />
        </IconButton>

        <Box sx={{ textAlign: 'center', mb: 4, mt: 2 }}>
          <Avatar
            sx={{
              width: 96,
              height: 96,
              mx: 'auto',
              mb: 2,
              bgcolor: theme.palette.primary.main,
              fontSize: '2.5rem',
            }}
          >
            {getInitials(user.name)}
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Person color="primary" sx={{ mr: 2 }} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Full Name
              </Typography>
              <Typography variant="body1">{user.name}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Email color="primary" sx={{ mr: 2 }} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Email Address
              </Typography>
              <Typography variant="body1">{user.email}</Typography>
            </Box>
          </Box>
        </Box>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<ExitToApp />}
          sx={{
            py: 1.5,
            borderRadius: 2,
            textTransform: 'uppercase',
            fontWeight: 600,
            letterSpacing: 1,
          }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Paper>
    </Box>
  );
};

export default Profile;
