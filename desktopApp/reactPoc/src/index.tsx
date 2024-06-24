import React from 'react';
import ReactDOM from 'react-dom';
import { fetchConfig } from './fetchConfig';
import ApolloClientsProvider from './contexts/ApolloClientsProvider';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './Root';
import ConsortiumList from './components/ConsortiumList';
import ComputationList from './components/ComputationList';
import ConsortiumDetails from './components/ConsortiumDetails';
import PageLogin from './components/PageLogin';
import NavBar from './components/NavBar';

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavBar></NavBar>,
    children: [
      {
        path: "login",
        element: <PageLogin></PageLogin>
      },
      {
        path: "consortia",
        element: <ConsortiumList></ConsortiumList>,
    
      },
      {
        path: "consortia/:consortiumId/",
        element: <ConsortiumDetails></ConsortiumDetails>
      },
      {
        path: "computations",
        element: <ComputationList></ComputationList>
      }
    ]
  },
  
]);

const startApp = async () => {
  const config = await fetchConfig();

  if (config) {
    ReactDOM.render(
      <ApolloClientsProvider config={config}>
        <RouterProvider router={router}></RouterProvider>
      </ApolloClientsProvider>,
      document.getElementById('root')
    );
  } else {
    console.error('Failed to start the app due to configuration loading failure.');
  }
};

startApp();
