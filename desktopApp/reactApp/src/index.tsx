import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Use TypeScript's non-null assertion operator (!) to assure that the element exists.
const rootElement = document.getElementById('root') as HTMLElement;

// Create a root.
const root = ReactDOM.createRoot(rootElement);

// Render the App component within React.StrictMode.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
