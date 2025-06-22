import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from './Layout.jsx';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardContent = () => {
  const navigate = useNavigate();

  const barData = {
    labels: ['Concerts', 'Workshops', 'Conferences', 'Webinars', 'Theatre'],
    datasets: [
      {
        label: 'Tickets Sold',
        data: [420, 310, 280, 150, 190],
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
        label: 'Revenue (₹K)',
        data: [120, 150, 180, 160, 220, 240],
        fill: false,
        tension: 0.4,
        borderColor: 'rgba(53, 162, 235, 0.8)',
        pointBackgroundColor: 'rgba(53, 162, 235, 0.8)',
      },
    ],
  };

  const stats = [
    { label: 'Total Events', value: 47 },
    { label: 'Tickets Sold', value: 13520 },
    { label: 'Revenue This Month (₹)', value: '₹4.3L' },
    { label: 'New Attendees', value: 822 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Event Sales Dashboard</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/events/new')} // Update this route if needed
        >
          Add Event
        </Button>
      </Box>

      {/* Key Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {stats.map((stat, i) => (
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

      {/* Bar Chart */}
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

      {/* Line Chart */}
      <Box sx={{ maxWidth: 800 }}>
        <Line
          data={lineData}
          options={{
            plugins: { title: { display: true, text: 'Monthly Revenue Trend' } },
            scales: { y: { beginAtZero: true } },
          }}
        />
      </Box>
    </Box>
  );
};

// Export wrapped with Layout (Option 1)
const Dashboard = () => (
    <DashboardContent />
);

export default Layout(Dashboard);
