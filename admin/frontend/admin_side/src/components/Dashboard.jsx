// DashboardContent.jsx
import React, { useState, useContext } from 'react';
import { Layout } from './Layout.jsx';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Bar, Line } from 'react-chartjs-2';
import NewEventDialogue from '../pages/NewEventDialogue.jsx';
import { EventContext } from '../../Context/EventContext.jsx';

const DashboardContent = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    stats,
    categoryStats,
    loading,
    addEvent,
  } = useContext(EventContext);
  const theme = useTheme();

  const handleSaveEvent = async (newEvent) => {
    try {
      await addEvent(newEvent);
      setDialogOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Only keep valid eventType entries
  const filteredStats = categoryStats.filter(cs => typeof cs.eventType === 'string');

  const barData = {
    labels: filteredStats.map(cs =>
      cs.eventType.charAt(0).toUpperCase() + cs.eventType.slice(1)
    ),
    datasets: [
      {
        label: 'Event Count',
        data: filteredStats.map(cs => cs.count),
        backgroundColor: theme.palette.primary.light,
        borderColor: theme.palette.primary.main,
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: [10000, 18000, 22000, 19500, 25000, 31000],
        fill: false,
        tension: 0.4,
        borderColor: theme.palette.secondary.main,
        pointBackgroundColor: theme.palette.secondary.main,
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
    <Box sx={{ flexGrow: 1, px: 4, py: 3 }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
      }}>
        <Typography variant="h4" fontWeight="bold">
          Event Sales Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{ borderRadius: 2, px: 3 }}
        >
          Add Event
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress size={40} />
        </Box>
      ) : (
        <>
          {/* KPI Cards */}
          <Grid container spacing={3} mb={5}>
            {keyStats.map((stat, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Paper elevation={4} sx={{
                  p: 3,
                  borderRadius: 3,
                  textAlign: 'center',
                  transition: '0.3s',
                  '&:hover': { boxShadow: 6 },
                }}>
                  <Typography variant="h5" fontWeight={600} color="primary.main" gutterBottom>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Charts */}
          <Grid container spacing={3} mb={5}>
            <Grid item xs={12} md={6}>
              <Paper elevation={4} sx={{ p: 2, borderRadius: 3, height: 400 }}>
                <Bar
                  data={barData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Events by Category',
                        font: { size: 18 },
                      },
                      legend: { display: false },
                    },
                    scales: { y: { beginAtZero: true } },
                  }}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={4} sx={{ p: 2, borderRadius: 3, height: 400 }}>
                <Line
                  data={lineData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Monthly Revenue Trend',
                        font: { size: 18 },
                      },
                    },
                    scales: { y: { beginAtZero: true } },
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
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
