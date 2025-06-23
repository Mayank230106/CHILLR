import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from './Layout.jsx';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { EventContext } from '../../Context/EventContext.jsx';

const History = () => {
  const navigate = useNavigate();
  const { events, loading, error, deleteEvent } = useContext(EventContext);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error loading events.</Typography>;

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this event?');
    if (confirm) {
      try {
        await deleteEvent(id);
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Previous Events</Typography>
      <Grid container spacing={2}>
        {events.map(event => (
          <Grid item xs={12} sm={6} md={4} key={event._id}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6">{event.title}</Typography>
                <Typography variant="body2" color="text.secondary">Date: {event.date?.split('T')[0]}</Typography>
                <Typography variant="body2" color="text.secondary">Location: {event.location}</Typography>
                <Typography variant="body2" color="text.secondary">Published: {event.isPublished ? 'Yes' : 'No'}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/events/${event._id}`)}>
                  View Details
                </Button>
                <Button size="small" color="error" onClick={() => handleDelete(event._id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Layout(History);
