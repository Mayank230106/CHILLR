import React, { useState, useContext } from 'react';
import { Layout } from './Layout.jsx';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Bar, Line } from 'react-chartjs-2';
import NewEventDialogue from '../pages/NewEventDialogue.jsx';
import { EventContext } from '../../Context/EventContext.jsx';

const DashboardContent = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { stats, loading, addEvent } = useContext(EventContext);

  const handleSaveEvent = async (newEvent) => {
    try {
      await addEvent(newEvent);
      setDialogOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const barData = {
    labels: ['Concerts', 'Workshops', 'Conferences', 'Webinars', 'Theatre'],
    datasets: [
      {
        label: 'Tickets Sold',
        data: [120, 95, 80, 45, 60], // placeholder until you have ticket model
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: [10000, 18000, 22000, 19500, 25000, 31000], // placeholder until real revenue logic
        fill: false,
        tension: 0.4,
        borderColor: 'rgba(53, 162, 235, 0.8)',
        pointBackgroundColor: 'rgba(53, 162, 235, 0.8)',
      },
    ],
  };

  const keyStats = [
    { label: 'Total Events', value: stats?.totalEvents ?? '-' },
    { label: 'Tickets Sold', value: stats?.totalTicketsSold ?? '-' },
    { label: 'Revenue (₹)', value: stats?.revenue ?? '-' },
    { label: 'New Attendees', value: stats?.newAttendees ?? '-' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Event Sales Dashboard</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Add Event
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {keyStats.map((stat, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" color="primary.main">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ maxWidth: 800, mb: 4 }}>
            <Bar
              data={barData}
              options={{
                plugins: {
                  title: { display: true, text: 'Tickets Sold by Event Type' },
                  legend: { display: false },
                },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </Box>

          <Box sx={{ maxWidth: 800 }}>
            <Line
              data={lineData}
              options={{
                plugins: {
                  title: { display: true, text: 'Monthly Revenue Trend' }
                },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </Box>
        </>
      )}

      <NewEventDialogue
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveEvent}
      />
    </Box>
  );
};

const Dashboard = () => <DashboardContent />;

export default Layout(Dashboard);
