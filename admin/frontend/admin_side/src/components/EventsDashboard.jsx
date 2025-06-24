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
  TrendingUp,
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

  // Header details
  const eventDetails = {
    name: event.title,
    date: event.date?.split('T')[0],
    venue: event.location,
    status: event.isPublished ? 'Published' : 'Draft',
    description: event.description,
  };

  // Metrics
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

  // Mock chart data (replace with real endpoint data if available)
  const salesOverTimeData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Tickets Sold',
      data: [150, 200, 300, 250],
      tension: 0.4,
    }]
  };

  const revenueByCategoryData = {
    labels: ['VIP', 'General', 'Student'],
    datasets: [{
      label: 'Revenue',
      data: [event.revenueVip || 0, event.revenueGeneral || 0, event.revenueStudent || 0],
    }]
  };

  const attendanceByDayData = {
    labels: ['Day 1', 'Day 2', 'Day 3'],
    datasets: [
      { label: 'Expected', data: [400,450,300] },
      { label: 'Actual', data: [380,420,280] }
    ]
  };

  // Recent registrations mock
  const recentRegs = event.recentRegistrations || [];

  const getChipColor = (ticket) => {
    switch(ticket) {
      case 'VIP': return 'error';
      case 'General': return 'primary';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4">{eventDetails.name}</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          ID: #{event._id} | {eventDetails.date} | {eventDetails.venue}
        </Typography>
        <Chip label={eventDetails.status} variant="outlined" color={event.isPublished ? 'success' : 'default'} sx={{ mt: 1 }} />
      </Box>

      {/* Banner & Description */}
      {event.bannerImage && (
        <CardMedia component="img" height="200" image={event.bannerImage} alt="banner" sx={{ mb:4,borderRadius:2 }} />
      )}
      <Paper sx={{ p:2, mb:4 }}><Typography>{eventDetails.description}</Typography></Paper>

      {/* Metrics */}
      <Grid container spacing={3} sx={{ mb:4 }}>
        {metrics.map((m,i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card>
              <CardContent sx={{ display:'flex', alignItems:'center' }}>
                <Avatar sx={{ bgcolor:m.color, mr:2 }}>{m.icon}</Avatar>
                <Box>
                  <Typography variant="h6">{m.value}</Typography>
                  <Typography variant="body2" color="text.secondary">{m.title}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb:4 }}>
        <Grid item xs={12} md={8}>
          <Card><CardHeader title="Ticket Sales Over Time" />
            <CardContent><Line data={salesOverTimeData} options={{ maintainAspectRatio:false }} /></CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card><CardHeader title="Revenue by Category" />
            <CardContent><Pie data={revenueByCategoryData} options={{ maintainAspectRatio:false }} /></CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb:4 }}>
        <Grid item xs={12} md={6}>
          <Card><CardHeader title="Attendance by Day" />
            <CardContent><Bar data={attendanceByDayData} options={{ maintainAspectRatio:false }} /></CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card><CardHeader title="Ticket Sales Progress" />
            <CardContent>
              <Box>
                {['VIP','General','Student'].map((type,i) => (
                  <Box key={i} sx={{ mb:2 }}>
                    <Box sx={{ display:'flex', justifyContent:'space-between' }}>
                      <Typography>{type}</Typography><Typography>{event[`${type.toLowerCase()}Sold`]} / {event.numberOfTickets}</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={ (event[`${type.toLowerCase()}Sold`]||0) / event.numberOfTickets *100 } />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Registrations */}
      <Card>
        <CardHeader title="Recent Registrations" />
        <CardContent>
          <TableContainer>
            <Table><TableHead><TableRow>
              <TableCell>Name</TableCell><TableCell>Ticket</TableCell><TableCell>Time</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {recentRegs.map((r,i)=>(
                <TableRow key={i}>
                  <TableCell>{r.name}</TableCell>
                  <TableCell><Chip label={r.ticket} color={getChipColor(r.ticket)} size="small" /></TableCell>
                  <TableCell>{r.time}</TableCell>
                </TableRow>
              ))}
            </TableBody></Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Layout(EventsDashboard);
