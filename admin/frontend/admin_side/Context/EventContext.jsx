import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: 'http://localhost:3000/events', // matches backend route
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
  });

  const fetchEvents = async () => {
    try {
      const res = await api.get('/');
      setEvents(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (form) => {
    try {
      const payload = {
        title: form.title,
        description: '', // You can extend the dialog to include this
        location: form.venue || 'Online',
        date: form.date,
        organizer: '64ab1234ef12cd7890ab1234', // Replace with logged-in user ID or dynamic value
        tags: form.type ? [form.type.toLowerCase()] : [],
        isPublished: true,
        bannerImage: '',
      };

      const res = await api.post('/add', payload);
      setEvents(prev => [...prev, res.data]);
      return res.data;
    } catch (err) {
      console.error('Error adding event:', err);
      throw err;
    }
  };

  const deleteEvent = async (id) => {
    try {
      await api.delete(`/${id}`);
      setEvents(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      console.error('Error deleting event:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <EventContext.Provider
      value={{ events, loading, error, addEvent, deleteEvent }}
    >
      {children}
    </EventContext.Provider>
  );
};
