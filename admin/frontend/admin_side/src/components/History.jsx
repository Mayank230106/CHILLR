import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from './Layout.jsx';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';

const History = () => {
  const navigate = useNavigate();

  const events = [
    { id: 1, name: 'Spring Fest 2025', date: '2025-03-20', ticketsSold: 850, revenue: '₹5,10,000' },
    { id: 2, name: 'Art Expo 2025', date: '2025-04-15', ticketsSold: 600, revenue: '₹3,60,000' },
    { id: 3, name: 'Tech Summit 2025', date: '2025-05-05', ticketsSold: 1200, revenue: '₹7,20,000' },
    { id: 4, name: 'Music Carnival 2025', date: '2025-06-10', ticketsSold: 980, revenue: '₹5,88,000' },
  ];

  return (
    
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Previous Events</Typography>
        <Grid container spacing={2}>
          {events.map(event => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6">{event.name}</Typography>
                  <Typography variant="body2" color="text.secondary">Date: {event.date}</Typography>
                  <Typography variant="body2" color="text.secondary">Tickets Sold: {event.ticketsSold}</Typography>
                  <Typography variant="body2" color="text.secondary">Revenue: {event.revenue}</Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => navigate(`/events/${event.id}`)}>
                    View Details
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
