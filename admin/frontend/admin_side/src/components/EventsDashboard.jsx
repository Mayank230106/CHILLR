// components/EventsDashboard.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from './Layout';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card,
  CardContent,
  CardHeader,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp,
  People,
  AttachMoney,
  ConfirmationNumber,
  EventSeat
} from '@mui/icons-material';

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const EventsDashboard = () => {
  // Pull the :id param from the URL
  const { id } = useParams();

  // Mock event data
  const eventDetails = {
    id: id,
    name: 'Tech Conference 2024',
    date: '2024-07-15',
    venue: 'Convention Center, Mumbai',
    status: 'Active',
    description: 'Annual technology conference featuring industry leaders'
  };

  // Key metrics data
  const metrics = [
    {
      title: 'Total Revenue',
      value: '₹7,60,000',
      icon: <AttachMoney />,
      color: '#4caf50',
      change: '+12%',
      changeColor: 'success'
    },
    {
      title: 'Tickets Sold',
      value: '950/1200',
      icon: <ConfirmationNumber />,
      color: '#2196f3',
      change: '+8%',
      changeColor: 'success'
    },
    {
      title: 'Attendees',
      value: '920',
      icon: <People />,
      color: '#ff9800',
      change: '+5%',
      changeColor: 'success'
    },
    {
      title: 'Capacity Used',
      value: '79%',
      icon: <EventSeat />,
      color: '#9c27b0',
      change: '+3%',
      changeColor: 'success'
    }
  ];

  // Sample chart data
  const salesOverTimeData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [{
      label: 'Tickets Sold',
      data: [150, 200, 300, 250, 200, 150],
      borderColor: 'rgba(75,192,192,1)',
      backgroundColor: 'rgba(75,192,192,0.2)',
      fill: true,
      tension: 0.4,
    }]
  };

  const revenueByCategoryData = {
    labels: ['VIP', 'General', 'Student', 'Early Bird'],
    datasets: [{
      label: 'Revenue (₹)',
      data: [350000, 300000, 110000, 100000],
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)'
      ],
      borderWidth: 1
    }]
  };

  const attendanceByDayData = {
    labels: ['Day 1', 'Day 2', 'Day 3'],
    datasets: [{
      label: 'Expected Attendance',
      data: [400, 450, 300],
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
    }, {
      label: 'Actual Attendance',
      data: [380, 420, 280],
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
    }]
  };

  // Recent registrations data
  const recentRegistrations = [
    { name: 'Rajesh Kumar', email: 'rajesh@email.com', ticket: 'VIP', time: '2 hours ago' },
    { name: 'Priya Sharma', email: 'priya@email.com', ticket: 'General', time: '3 hours ago' },
    { name: 'Amit Patel', email: 'amit@email.com', ticket: 'Student', time: '5 hours ago' },
    { name: 'Sneha Gupta', email: 'sneha@email.com', ticket: 'VIP', time: '6 hours ago' },
    { name: 'Vikram Singh', email: 'vikram@email.com', ticket: 'General', time: '8 hours ago' },
  ];

  const getTicketChipColor = (ticket) => {
    switch (ticket) {
      case 'VIP': return 'error';
      case 'General': return 'primary';
      case 'Student': return 'warning';
      default: return 'default';
    }
  };

  return (
      <Box sx={{ flexGrow: 1 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            {eventDetails.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Event ID: #{eventDetails.id} | {eventDetails.date} | {eventDetails.venue}
          </Typography>
          <Chip 
            label={eventDetails.status} 
            color="success" 
            variant="outlined" 
            sx={{ mt: 1 }}
          />
        </Box>

        {/* Key Metrics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {metrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: metric.color, mr: 2 }}>
                      {metric.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h5" component="div">
                        {metric.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {metric.title}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUp fontSize="small" color={metric.changeColor} />
                    <Typography 
                      variant="body2" 
                      color={`${metric.changeColor}.main`}
                      sx={{ ml: 0.5 }}
                    >
                      {metric.change} from last week
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Sales Over Time */}
          <Grid item xs={12} md={8}>
            <Card elevation={3}>
              <CardHeader title="Ticket Sales Over Time" />
              <CardContent>
                <Box sx={{ height: 300 }}>
                  <Line
                    data={salesOverTimeData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Revenue Distribution */}
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardHeader title="Revenue by Category" />
              <CardContent>
                <Box sx={{ height: 300 }}>
                  <Pie
                    data={revenueByCategoryData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        },
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Attendance Tracking */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardHeader title="Attendance by Day" />
              <CardContent>
                <Box sx={{ height: 300 }}>
                  <Bar
                    data={attendanceByDayData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Ticket Sales Progress */}
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardHeader title="Ticket Sales Progress" />
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">VIP (₹2000)</Typography>
                    <Typography variant="body2">175/200</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={87.5} sx={{ mb: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">General (₹1000)</Typography>
                    <Typography variant="body2">600/800</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={75} sx={{ mb: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Student (₹500)</Typography>
                    <Typography variant="body2">175/200</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={87.5} sx={{ mb: 2 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Registrations */}
        <Card elevation={3}>
          <CardHeader title="Recent Registrations" />
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Ticket Type</TableCell>
                    <TableCell>Registration Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentRegistrations.map((registration, index) => (
                    <TableRow key={index}>
                      <TableCell>{registration.name}</TableCell>
                      <TableCell>{registration.email}</TableCell>
                      <TableCell>
                        <Chip 
                          label={registration.ticket} 
                          color={getTicketChipColor(registration.ticket)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{registration.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
  );
};

export default Layout(EventsDashboard);