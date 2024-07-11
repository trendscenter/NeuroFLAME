import React from 'react';
import ReactDOM from 'react-dom';
import { fetchConfig } from './fetchConfig';
import ApolloClientsProvider from './contexts/ApolloClientsProvider';

import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import ConsortiumList from './components/ConsortiumList';
import ComputationList from './components/ComputationList';
import ConsortiumDetails from './components/ConsortiumDetails';
import PageLogin from './components/PageLogin';
import NavBar from './components/NavBar';
import { AppConfig } from './components/AppConfig';
import { UserStateProvider } from './contexts/UserStateContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import NotificationList from './components/NotificationList';
import ConsortiumCreate from './components/ConsortiumCreate';
import ComputationDetails from './components/ComputationDetails';
import ComputationCreate from './components/ComputationsCreate';
import ChangePassword from './components/ChangePassword';
import AdminEditUser from './components/AdminEditUser';

const router = createHashRouter([
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
        path: "consortia/create",
        element: <ConsortiumCreate></ConsortiumCreate>,
      },
      {
        path: "consortia/details/:consortiumId/",
        element: <ConsortiumDetails></ConsortiumDetails>
      },
      {
        path: "computations",
        element: <ComputationList></ComputationList>
      },
      {
        path: "computations/create",
        element: <ComputationCreate></ComputationCreate>
      },
      {
        path: "computations/details/:computationId",
        element: <ComputationDetails></ComputationDetails>
      },
      {
        path: "appConfig",
        element: <AppConfig></AppConfig>
      },
      {
        path: "notifications",
        element: <NotificationList></NotificationList>
      },
      {
        path: "changePassword",
        element: <ChangePassword></ChangePassword>
      },
      {
        path: "adminEditUser",
        element: <AdminEditUser></AdminEditUser>
      }
    ]
  }
]);

const startApp = async () => {
  const config = await fetchConfig();

  if (config) {
    ReactDOM.render(
      <UserStateProvider>
        <ApolloClientsProvider config={config}>
          <NotificationsProvider>
            <RouterProvider router={router}></RouterProvider>
          </NotificationsProvider>
        </ApolloClientsProvider>
      </UserStateProvider>,
      document.getElementById('root')
    );
  } else {
    console.error('Failed to start the app due to configuration loading failure.');
  }
};

startApp();
