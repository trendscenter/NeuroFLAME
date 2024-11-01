import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';
import '@fontsource/lato/300.css';
import '@fontsource/lato/400.css';
import '@fontsource/lato/700.css';
import "./index.css"
import { electronApi } from './apis/electronApi/electronApi';
import ApolloClientsProvider from './contexts/ApolloClientsProvider';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserStateProvider } from './contexts/UserStateContext';

const startApp = async () => {
  const config = await electronApi.getConfig();
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  if (config) {
    root.render(
      <ApolloClientsProvider config={config}>
        <UserStateProvider>
          <Router>
            <App />
          </Router>
        </UserStateProvider>
      </ApolloClientsProvider>
    );
  } else {
    console.error('Failed to start the app due to configuration loading failure.');
  }
};

startApp();
