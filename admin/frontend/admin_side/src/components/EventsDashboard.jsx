import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from './Layout.jsx';
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
  LinearProgress,
  CardMedia
} from '@mui/material';
import {
  People,
  AttachMoney,
  ConfirmationNumber,
  EventSeat
} from '@mui/icons-material';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { EventContext } from '../../Context/EventContext.jsx';
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
  const { id } = useParams();
  const { events, fetchEvents, loading } = useContext(EventContext);

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;

  const event = events.find(e => e._id === id);
  if (!event) return <Typography>Event not found.</Typography>;

  const eventDetails = {
    name: event.title,
    date: event.date?.split('T')[0],
    venue: event.location,
    status: event.isPublished ? 'Published' : 'Draft',
    description: event.description,
  };

  const metrics = [
    {
      title: 'Total Revenue',
      value: event.revenue ? `₹${event.revenue}` : '₹0',
      icon: <AttachMoney />,
      color: '#4caf50'
    },
    {
      title: 'Tickets Sold',
      value: event.ticketsSold ? `${event.ticketsSold}/${event.numberOfTickets}` : `0/${event.numberOfTickets}`,
      icon: <ConfirmationNumber />,
      color: '#2196f3'
    },
    {
      title: 'Attendees',
      value: event.attendees || 0,
      icon: <People />,
      color: '#ff9800'
    },
    {
      title: 'Capacity Used',
      value: event.numberOfTickets ? `${Math.round((event.attendees || 0) / event.numberOfTickets * 100)}%` : '0%',
      icon: <EventSeat />,
      color: '#9c27b0'
    }
  ];

  const salesOverTimeData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Tickets Sold',
      data: [150, 200, 300, 250],
      tension: 0.4,
      borderColor: '#42a5f5',
      backgroundColor: 'rgba(66,165,245,0.2)',
      pointBackgroundColor: '#42a5f5'
    }]
  };

  const revenueByCategoryData = {
    labels: ['VIP', 'General', 'Student'],
    datasets: [{
      label: 'Revenue',
      data: [event.revenueVip || 0, event.revenueGeneral || 0, event.revenueStudent || 0],
      backgroundColor: ['#f44336', '#2196f3', '#ffb300']
    }]
  };

  const attendanceByDayData = {
    labels: ['Day 1', 'Day 2', 'Day 3'],
    datasets: [
      {
        label: 'Expected',
        data: [400, 450, 300],
        backgroundColor: 'rgba(100,100,255,0.3)'
      },
      {
        label: 'Actual',
        data: [380, 420, 280],
        backgroundColor: 'rgba(0,200,83,0.6)'
      }
    ]
  };

  const recentRegs = event.recentRegistrations || [];

  const getChipColor = (ticket) => {
    switch (ticket) {
      case 'VIP': return 'error';
      case 'General': return 'primary';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={600}>{eventDetails.name}</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          ID: #{event._id} | {eventDetails.date} | {eventDetails.venue}
        </Typography>
        <Chip
          label={eventDetails.status}
          variant="outlined"
          color={event.isPublished ? 'success' : 'default'}
          sx={{ mt: 1 }}
        />
      </Box>

      {/* Banner Image */}
      {event.bannerImage && (
        <Box
          sx={{
            position: 'relative',
            height: { xs: 200, sm: 300 },
            mb: 4,
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: 3
          }}
        >
          <CardMedia
            component="img"
            image={event.bannerImage}
            alt="Event Banner"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.85)'
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: '#fff',
              px: 3,
              py: 2
            }}
          >
            <Typography variant="h6">{eventDetails.name}</Typography>
            <Typography variant="body2">{eventDetails.date} | {eventDetails.venue}</Typography>
          </Box>
        </Box>
      )}

      {/* Description */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography>{eventDetails.description}</Typography>
      </Paper>

      {/* Metrics Cards */}
      <Grid container spacing={3} mb={4}>
        {metrics.map((m, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ p: 2, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: m.color }}>{m.icon}</Avatar>
              <Box>
                <Typography variant="h6">{m.value}</Typography>
                <Typography variant="body2" color="text.secondary">{m.title}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Chart Section */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3 }}>
            <CardHeader title="Ticket Sales Over Time" />
            <CardContent>
              <Line data={salesOverTimeData} options={{ maintainAspectRatio: false }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardHeader title="Revenue by Category" />
            <CardContent>
              <Pie data={revenueByCategoryData} options={{ maintainAspectRatio: false }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardHeader title="Attendance by Day" />
            <CardContent>
              <Bar data={attendanceByDayData} options={{ maintainAspectRatio: false }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardHeader title="Ticket Sales Progress" />
            <CardContent>
              {['VIP', 'General', 'Student'].map((type, i) => (
                <Box key={i} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography fontWeight={500}>{type}</Typography>
                    <Typography variant="body2">
                      {event[`${type.toLowerCase()}Sold`] || 0} / {event.numberOfTickets}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={((event[`${type.toLowerCase()}Sold`] || 0) / event.numberOfTickets) * 100}
                    sx={{ height: 8, borderRadius: 5 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Registrations Table */}
      <Card sx={{ borderRadius: 3 }}>
        <CardHeader title="Recent Registrations" />
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Ticket</TableCell>
                  <TableCell>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentRegs.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={r.ticket}
                        color={getChipColor(r.ticket)}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{r.time}</TableCell>
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
