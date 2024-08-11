import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import styles from './components/styles';
import { useUserState } from './contexts/UserStateContext';
import { useNotifications } from './contexts/NotificationsContext';
import AppRoutes from './components/AppRoutes';
import AppHeader from './components/AppHeader';
import AppDrawer from './components/AppDrawer';
import './AppStyles.css';

import {
  Link as RouterLink,
  Route,
  Routes,
  MemoryRouter,
} from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';

function Router(props) {
  const { children } = props;
  if (typeof window === 'undefined') {
    return <StaticRouter location="/login">{children}</StaticRouter>;
  }

  return (
    <MemoryRouter initialEntries={['/login']} initialIndex={0}>
      {children}
    </MemoryRouter>
  );
}

Router.propTypes = {
  children: PropTypes.node,
};

const drawerWidth = 240;

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

function App() {
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const { username, clearUserData } = useUserState();
  const { subscribe, unsubscribe } = useNotifications();
  const isLoggedIn = !!username;

  interface AuthInfo {
    accessToken: string | null;
    refreshToken: string | null;
    userId: string | null;
  }

  const useAuth = () => {
    const [authInfo, setAuthInfo] = useState<AuthInfo>({
      accessToken: null,
      refreshToken: null,
      userId: null,
    });

    const updateAuthInfo = (newAuthInfo: Partial<AuthInfo>) => {
      setAuthInfo((prevAuthInfo) => ({
        ...prevAuthInfo,
        ...newAuthInfo,
      }));
    };

    return {
      authInfo,
      updateAuthInfo,
    };
  };

  const { updateAuthInfo } = useAuth();

  const onLogout = () => {
    clearUserData();
    unsubscribe();
    setOpen(!open);
  };

  return (
    <Router>
      <ThemeProvider theme={defaultTheme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          {isLoggedIn && <AppHeader appDrawerWidth={drawerWidth} appUsername={username} appOpen={open} appToggleDrawer={toggleDrawer} />}
          <div style={styles.content}>
            <AppRoutes />
          </div>
          <AppDrawer appDrawerWidth={drawerWidth} appSetOpen={setOpen} appOpen={open} appToggleDrawer={toggleDrawer} appOnLogout={onLogout} />
        </Box>
      </ThemeProvider>
    </Router>
  );
}

export default App;
