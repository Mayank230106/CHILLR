import React, { useState, useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
  Box,
} from '@mui/material';

const eventTypes = [
  'conference',
  'workshop',
  'webinar',
  'meetup',
  'seminar',
  'networking',
  'hackathon',
  'competition',
  'concert',
  'festival',
  'movie',
];

const NewEventDialogue = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    tags: '',
    numberOfTickets: '',
    eventType: '',
  });
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setBannerImageFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Build formData
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('location', form.location);
      formData.append('date', form.date);
      formData.append('tags', form.tags);
      formData.append('isPublished', 'true');
      formData.append('numberOfTickets', form.numberOfTickets || 0);
      formData.append('eventType', form.eventType);
      if (bannerImageFile) formData.append('bannerImage', bannerImageFile);

      // **Only** call onSave (parent will call addEvent)
      if (onSave) {
        await onSave(formData);
      }

      // reset and close
      setForm({
        title: '',
        description: '',
        location: '',
        date: '',
        tags: '',
        numberOfTickets: '',
        eventType: '',
      });
      setBannerImageFile(null);
      onClose();
    } catch (err) {
      console.error('Event creation failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Event</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {[
            { label: 'Event Title', name: 'title', xs: 12 },
            { label: 'Description', name: 'description', xs: 12, multiline: true, rows: 3 },
            { label: 'Date', name: 'date', xs: 6, type: 'date', required: true },
            { label: 'Location', name: 'location', xs: 6 },
            { label: 'Tags (comma-separated)', name: 'tags', xs: 6 },
            { label: 'Number of Tickets', name: 'numberOfTickets', xs: 6, type: 'number', inputProps: { min: 0 } },
          ].map(field => (
            <Grid item xs={field.xs} key={field.name}>
              <TextField
                fullWidth
                label={field.label}
                name={field.name}
                type={field.type || 'text'}
                value={form[field.name]}
                onChange={handleChange}
                required={field.required || false}
                multiline={field.multiline || false}
                rows={field.rows || undefined}
                InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
                InputProps={field.inputProps ? { inputProps: field.inputProps } : undefined}
                disabled={submitting}
              />
            </Grid>
          ))}

          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              label="Event Type"
              name="eventType"
              value={form.eventType}
              onChange={handleChange}
              required
              disabled={submitting}
            >
              {eventTypes.map(type => (
                <MenuItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              disabled={submitting}
            >
              Upload Banner Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            {bannerImageFile && (
              <Box mt={1} fontSize="0.9rem">
                📁 {bannerImageFile.name}
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={20} /> : null}
        >
          {submitting ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewEventDialogue;
