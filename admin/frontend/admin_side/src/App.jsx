import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import History from './components/History';
import EventsDashboard from './components/EventsDashboard';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/:id"
        element={
          <ProtectedRoute>
            <EventsDashboard />
          </ProtectedRoute>
        }
      />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile></Profile>
            </ProtectedRoute>
        }>
          </Route>

    </Routes>

    
  );
}

export default App;
