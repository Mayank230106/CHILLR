import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]);
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

  const fetchCategoryStats = async () => {
    if (!token) return;
    try {
      const res = await api.get('/stats/categories');
      setCategoryStats(res.data.categoryStats || []);
    } catch (err) {
      console.error('Error fetching category stats:', err);
      setCategoryStats([]);
    }
  };

  const addEvent = async (data) => {
    if (!user?.id) throw new Error('User not authenticated');
    let res;

    if (data instanceof FormData) {
      data.append('organizer', user.id);
      data.append('isPublished', 'true');
      data.append('numberOfTickets', data.numberOfTickets ?? 0);
      data.append('eventType', data.eventType);

      res = await api.post('/add', data);
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
        eventType: data.eventType,
      };
      res = await api.post('/add', payload);
    }

    setEvents(prev => [...prev, res.data]);
    await Promise.all([fetchDashboardStats(), fetchCategoryStats()]);
    return res.data;
  };

  const deleteEvent = async (id) => {
    await api.delete(`/${id}`);
    setEvents(prev => prev.filter(e => e._id !== id));
    await Promise.all([fetchDashboardStats(), fetchCategoryStats()]);
  };

  // ← NEW: recordSale
  const recordSale = async (eventId, count = 1) => {
    const res = await api.post(`/${eventId}/sell`, { count });
    // update the specific event in list
    setEvents(evts =>
      evts.map(e => (e._id === eventId ? res.data : e))
    );
    await Promise.all([fetchDashboardStats(), fetchCategoryStats()]);
    return res.data;
  };

  useEffect(() => {
    if (user && token) {
      fetchEvents();
      fetchDashboardStats();
      fetchCategoryStats();
    }
  }, [user, token]);

  return (
    <EventContext.Provider
      value={{
        events,
        stats,
        categoryStats,
        loading,
        error,
        fetchEvents,
        fetchDashboardStats,
        fetchCategoryStats,
        addEvent,
        deleteEvent,
        recordSale,       // ← expose recordSale
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
