import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { fetchConfig } from './fetchConfig';
import  ApolloClientsProvider  from './contexts/ApolloClientsProvider';

const startApp = async () => {
  const config = await fetchConfig();

  if (config) {
    ReactDOM.render(
      <ApolloClientsProvider config={config}>
        <App />
      </ApolloClientsProvider>,
      document.getElementById('root')
    );
  } else {
    console.error('Failed to start the app due to configuration loading failure.');
  }
};

startApp();
