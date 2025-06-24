import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: 'http://localhost:3000/events',
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchEvents = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/client/${user.id}`);
      setEvents(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    if (!token) return;
    try {
      const res = await api.get('/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setStats(null);
    }
  };

  const addEvent = async (data) => {
    if (!user?.id) throw new Error('User not authenticated');
    let res;

    if (data instanceof FormData) {
      data.append('organizer', user.id);
      data.append('isPublished', 'true');
      data.append('numberOfTickets', data.numberOfTickets ?? 0);

      res = await axios.post(
        'http://localhost:3000/events/add',
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      const payload = {
        title: data.title,
        description: data.description || '',
        location: data.location || 'Online',
        date: data.date,
        organizer: user.id,
        tags: Array.isArray(data.tags) ? data.tags : [],
        isPublished: true,
        bannerImage: data.bannerImage || '',
        numberOfTickets: data.numberOfTickets ?? 0,
      };
      res = await api.post('/add', payload, {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    setEvents(prev => [...prev, res.data]);
    fetchDashboardStats();
    return res.data;
  };

  const deleteEvent = async (id) => {
    await api.delete(`/${id}`);
    setEvents(prev => prev.filter(e => e._id !== id));
    fetchDashboardStats();
  };

  useEffect(() => {
    if (user && token) {
      fetchEvents();
      fetchDashboardStats();
    }
  }, [user, token]);

  return (
    <EventContext.Provider
      value={{
        events,
        stats,
        loading,
        error,
        fetchEvents,
        fetchDashboardStats,
        addEvent,
        deleteEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
