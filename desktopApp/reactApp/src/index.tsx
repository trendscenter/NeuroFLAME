import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { fetchConfig } from './fetchConfig';
import ApolloClientsProvider from './contexts/ApolloClientsProvider';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';
import '@fontsource/lato/300.css';
import '@fontsource/lato/400.css';
import '@fontsource/lato/700.css';
import "./index.css"
import { UserStateProvider } from './contexts/UserStateContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import Router from './Router';

const startApp = async () => {
  const config = await fetchConfig();

  if (config) {
    ReactDOM.render(
      <UserStateProvider>
        <ApolloClientsProvider config={config}>
          <Router>
            <NotificationsProvider>
              <App />
            </NotificationsProvider>
          </Router>
        </ApolloClientsProvider>
      </UserStateProvider>
      ,
      document.getElementById('root')
    );
  } else {
    console.error('Failed to start the app due to configuration loading failure.');
  }
};

startApp();
