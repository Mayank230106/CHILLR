// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import History from './components/History';
import EventsDashboard from './components/EventsDashboard';
import Login from './pages/Login';

function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path="/" element={<Dashboard />} />
      <Route path="/history" element={<History />} />
      <Route path="/events/:id" element={<EventsDashboard />} />
    </Routes>
  );
}

export default App;
