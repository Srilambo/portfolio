import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';
import App from './App';

// Redirect hash-based admin routing to clean paths for BrowserRouter
if (window.location.hash) {
  const hash = window.location.hash;
  if (hash === '#/admin' || hash === '#admin') {
    window.history.replaceState(null, '', '/admin');
  } else if (hash.startsWith('#/admin/') || hash.startsWith('#admin/')) {
    const path = hash.startsWith('#/') ? hash.slice(2) : hash.slice(1);
    window.history.replaceState(null, '', '/' + path);
  }
}

document.title = "Srilambo | Portfolio";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
