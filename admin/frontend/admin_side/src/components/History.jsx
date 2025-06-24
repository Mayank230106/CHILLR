import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from './Layout.jsx';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Skeleton,
} from '@mui/material';
import { EventContext } from '../../Context/EventContext.jsx';

const History = () => {
  const navigate = useNavigate();
  const { events, loading, error, deleteEvent } = useContext(EventContext);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteEvent(id);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Previous Events
      </Typography>

      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Skeleton variant="rectangular" height={200} />
              <Skeleton width="80%" />
              <Skeleton width="60%" />
            </Grid>
          ))}
        </Grid>
      ) : error ? (
        <Typography color="error" mt={2}>
          Error loading events.
        </Typography>
      ) : events.length === 0 ? (
        <Typography color="text.secondary" mt={2}>
          No previous events available.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <Card
                elevation={4}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  transition: '0.3s',
                  '&:hover': { boxShadow: 8 },
                }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={event.bannerImage || '/placeholder.jpg'}
                  alt={`${event.title} banner`}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    📅 {event.date?.split('T')[0] || 'No date'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    📍 {event.location || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    🟢 Published: {event.isPublished ? 'Yes' : 'No'}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => navigate(`/events/${event._id}`)}
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    variant="contained"
                    onClick={() => handleDelete(event._id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Layout(History);
