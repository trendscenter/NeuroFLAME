import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { electronApi } from './apis/electronApi/electronApi';
import ApolloClientsProvider from './contexts/ApolloClientsProvider';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserStateProvider } from './contexts/UserStateContext';

const startApp = async () => {
  const config = await electronApi.FetchConfig();
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
