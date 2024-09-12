import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { useUserState } from './contexts/UserStateContext';
import AppRoutes from './components/AppRoutes';
import AppHeader from './components/AppHeader';
import AppDrawer from './components/AppDrawer';
import styles from './components/styles';
import './AppStyles.css';

const drawerWidth = 240;

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

function App() {
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const { username } = useUserState();
  const isLoggedIn = !!username;

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        {isLoggedIn && <AppHeader appDrawerWidth={drawerWidth} appUsername={username} appOpen={open} appToggleDrawer={toggleDrawer} />}
        <div style={styles.content}>
          <AppRoutes />
        </div>
        <AppDrawer appDrawerWidth={drawerWidth} appSetOpen={setOpen} appOpen={open} appToggleDrawer={toggleDrawer} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
