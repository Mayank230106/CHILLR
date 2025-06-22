// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import History from './components/History';
import EventsDashboard from './components/EventsDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/history" element={<History />} />
      <Route path="/events/:id" element={<EventsDashboard />} />
    </Routes>
  );
}

export default App;
