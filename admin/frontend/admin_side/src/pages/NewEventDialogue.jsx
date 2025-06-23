import React, { useState, useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid
} from '@mui/material';
import { EventContext } from '../../Context/EventContext.jsx';

const NewEventDialogue = ({ open, onClose }) => {
  const { addEvent } = useContext(EventContext);

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    tags: '',
    bannerImage: ''
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(tag => tag.trim()),
        isPublished: true,
        organizer: "663e0a7e760d0a03b3b5d278" // 🔁 TEMP: Replace with logged-in user ID
      };

      await addEvent(payload);

      setForm({
        title: '',
        description: '',
        location: '',
        date: '',
        tags: '',
        bannerImage: ''
      });

      onClose();
    } catch (err) {
      console.error('Event creation failed:', err);
      // Optional: Add UI feedback
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Event</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Event Title"
              name="title"
              fullWidth
              value={form.title}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={3}
              value={form.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Date"
              name="date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={form.date}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Location"
              name="location"
              fullWidth
              value={form.location}
              onChange={handleChange}
              placeholder="Online or Physical"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Tags (comma-separated)"
              name="tags"
              fullWidth
              value={form.tags}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Banner Image URL"
              name="bannerImage"
              fullWidth
              value={form.bannerImage}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewEventDialogue;
