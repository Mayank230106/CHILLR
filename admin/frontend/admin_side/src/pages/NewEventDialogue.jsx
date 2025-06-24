import React, { useState, useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
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
    numberOfTickets: '',    // ← new field
  });
  const [bannerImageFile, setBannerImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setBannerImageFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('location', form.location);
      formData.append('date', form.date);
      formData.append('tags', form.tags);
      formData.append('isPublished', 'true');
      formData.append('numberOfTickets', form.numberOfTickets || 0);  // ← append tickets
      if (bannerImageFile) {
        formData.append('bannerImage', bannerImageFile);
      }

      await addEvent(formData);

      setForm({
        title: '',
        description: '',
        location: '',
        date: '',
        tags: '',
        numberOfTickets: '',
      });
      setBannerImageFile(null);
      onClose();
    } catch (err) {
      console.error('Event creation failed:', err);
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
          <Grid item xs={6}>
            <TextField
              label="Tags (comma-separated)"
              name="tags"
              fullWidth
              value={form.tags}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Number of Tickets"
              name="numberOfTickets"
              type="number"
              fullWidth
              InputProps={{ inputProps: { min: 0 } }}
              value={form.numberOfTickets}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" component="label" fullWidth>
              Upload Banner Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            {bannerImageFile && (
              <div style={{ marginTop: '8px', fontSize: '0.9rem' }}>
                📁 {bannerImageFile.name}
              </div>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewEventDialogue;
