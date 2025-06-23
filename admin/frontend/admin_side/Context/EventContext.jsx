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
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchEvents = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:3000/events/client/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      const res = await axios.get(`http://localhost:3000/events/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setStats(null);
    }
  };

  const addEvent = async (form) => {
    if (!user?.id) throw new Error('User not authenticated');
    const payload = {
      title: form.title,
      description: form.description || '',
      location: form.venue || 'Online',
      date: form.date,
      organizer: user.id,
      tags: form.type ? [form.type.toLowerCase()] : [],
      isPublished: true,
      bannerImage: form.bannerImage || '',
    };
    const res = await api.post('/add', payload);
    setEvents((prev) => [...prev, res.data]);
    fetchDashboardStats(); // ✅ update stats
    return res.data;
  };

  const deleteEvent = async (id) => {
    await api.delete(`/${id}`);
    setEvents((prev) => prev.filter((e) => e._id !== id));
    fetchDashboardStats(); // ✅ update stats
  };

  useEffect(() => {
    if (user && token) {
      fetchEvents();
      fetchDashboardStats();
    }
  }, [user, token]);

  return (
    <EventContext.Provider value={{ events, stats, loading, error, fetchEvents, fetchDashboardStats, addEvent, deleteEvent }}>
      {children}
    </EventContext.Provider>
  );
};
