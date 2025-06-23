import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { EventProvider } from '../Context/EventContext.jsx';
import { AuthProvider } from '../Context/AuthContext.jsx'; // 👈 Import AuthProvider
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* 👈 Wrap AuthProvider around everything */}
        <EventProvider>
          <App />
        </EventProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
