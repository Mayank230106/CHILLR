import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { EventProvider } from '../Context/EventContext.jsx';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <EventProvider> {/* ✅ wrap App inside EventProvider */}
        <App />
      </EventProvider>
    </BrowserRouter>
  </StrictMode>
);
