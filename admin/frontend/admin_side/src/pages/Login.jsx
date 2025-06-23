import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Link,
  Tabs,
  Tab,
  Paper,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Full viewport container with proper background
const FullPage = styled(Box)(({ theme }) => ({
  height: '100vh',
  width: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(2),
  boxSizing: 'border-box',
  overflow: 'auto', // Allows scrolling if content is taller than viewport
}));

// Form container with better responsive sizing
const FormWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 500,
  minWidth: 320,
  margin: 'auto',
  boxShadow: theme.shadows[10],
  borderRadius: theme.shape.borderRadius * 2,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    maxWidth: '95%',
    minWidth: 'auto',
    boxShadow: theme.shadows[4],
  },
}));

// Custom styled tabs
const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiTabs-indicator': {
    height: 3,
    borderRadius: 3,
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: 500,
    minHeight: 48,
    padding: theme.spacing(1.5, 2),
  },
}));

// Custom styled button
const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5, 0),
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: theme.shadows[2],
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

// Custom TextField styling
const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1),
    '& fieldset': {
      borderWidth: 1,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: theme.spacing(1.5),
    fontSize: '0.95rem',
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.95rem',
  },
}));

const Login = () => {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
    setForm({ name: '', email: '', password: '' });
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tab === 0) {
      console.log('Logging in with', form);
    } else {
      console.log('Signing up with', form);
    }
  };

  return (
    <FullPage>
      <FormWrapper elevation={6}>
        {/* Header */}
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
            Welcome
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {tab === 0 ? 'Sign in to your account' : 'Create your account'}
          </Typography>
        </Box>

        {/* Tabs */}
        <StyledTabs
          value={tab}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Sign In" />
          <Tab label="Sign Up" />
        </StyledTabs>

        {/* Form */}
        <Box component="form" noValidate onSubmit={handleSubmit}>
          {tab === 1 && (
            <StyledTextField
              fullWidth
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              variant="outlined"
              required
            />
          )}

          <StyledTextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            variant="outlined"
            required
          />

          <StyledTextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            autoComplete={tab === 0 ? "current-password" : "new-password"}
            variant="outlined"
            required
          />

          <StyledButton
            type="submit"
            fullWidth
            variant="contained"
            size="large"
          >
            {tab === 0 ? 'Sign In' : 'Create Account'}
          </StyledButton>

          <Box textAlign="center" sx={{ mt: 2 }}>
            <Link 
              component="button" 
              type="button"
              onClick={() => setTab(tab === 0 ? 1 : 0)}
              sx={{ 
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              {tab === 0 
                ? "Don't have an account? Sign up here" 
                : "Already have an account? Sign in"
              }
            </Link>
          </Box>
        </Box>
      </FormWrapper>
    </FullPage>
  );
};

export default Login;