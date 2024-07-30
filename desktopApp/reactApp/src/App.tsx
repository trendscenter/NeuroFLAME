import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MuiAppBar, { AppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ConsortiumList from './components/ConsortiumList';
import Login from './components/Login';
import styles from './components/styles';
import ConsortiumDetails from './components/ConsortiumDetails';
import ComputationsList from './components/ComputationList';
import ComputationDetails from './components/ComputationDetails';
import ComputationsCreate from './components/ComputationsCreate';
import NotificationList from './components/NotificationList';
import RunsList from './components/RunList';
import RunDetails from './components/RunDetails';
import UserAvatar from './components/UserAvatar';
import AdminEditUser from './components/AdminEditUser';
import PageLogin from './components/PageLogin';
import { useUserState } from './contexts/UserStateContext';
import { useNotifications } from './contexts/NotificationsContext';
import logoSM from './components/assets/coinstac-logo-sm.png';
import './AppStyles.css';

import {
  Link as RouterLink,
  Route,
  Routes,
  MemoryRouter,
} from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { AppConfig } from './components/AppConfig';
import ConsortiumCreate from './components/ConsortiumCreate';
import ChangePassword from './components/ChangePassword';

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

// Define the props type, replace 'any' with the actual type of your itemProps if known
interface LinkProps {
  to: string;
  // Add other props specific to your RouterLink component
  [key: string]: any;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(itemProps, ref) {
  return <RouterLink ref={ref} {...itemProps} role={undefined} />;
});

function ListItemLink(props) {
  const { icon, primary, to, onClick } = props;

  return (
    <li>
      <ListItem button component={Link} to={to} onClick={onClick}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

ListItemLink.propTypes = {
  icon: PropTypes.element,
  primary: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

interface ListItemFuncProps {
  icon?: React.ReactElement;
  primary: string;
  onClick: () => void; // Change to onClick instead of clickFunc
}

const ListItemFunc: React.FC<ListItemFuncProps> = ({ icon, primary, onClick }) => {
  return (
    <li>
      <ListItem button component={Link} onClick={e => { onClick() }}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  )
}

ListItemFunc.propTypes = {
  icon: PropTypes.element,
  primary: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

const drawerWidth = 240;

interface AppBarOwnProps {
  open?: boolean;
  // other props if needed
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps & AppBarOwnProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginRight: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open'
})(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'absolute',
      whiteSpace: 'nowrap',
      backgroundColor: 'rgba(0,31,112, 0.9)',
      right: '0',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        right: '-72px',
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

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
          {isLoggedIn && <AppBar position="absolute" open={open}>
            <Toolbar
              sx={{
                pr: '24px', // keep right padding when drawer closed
                backgroundColor: '#001f70'
              }}
            >
              <Typography
                sx={{ flexGrow: 1 }}
              >
              </Typography>
              <img
                src={logoSM}
                alt="Logo"
                style={{
                  marginRight: '2px',
                  width: '28px',
                  height: '28px',
                }}
              />
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                sx={{
                  fontFamily: 'Lato',
                  fontWeight: '600'
                }}
                noWrap
              >
                COINSTAC
              </Typography>
              <Link to="/pageLogin" style={{textDecoration: 'none'}}>
                <UserAvatar username={username} />
              </Link>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  ...(open && { display: 'none' }),
                }}
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </AppBar>}
          <div style={styles.content}>
            <Routes>
              <Route index path="/" element={<Login></Login>} />
              <Route index path="/login" element={<Login></Login>} />
              <Route path="/consortia" element={<ConsortiumList />} />
              <Route path="/consortia/create" element={<ConsortiumCreate />} />
              <Route path="/consortia/details/:consortiumId" element={<ConsortiumDetails />} />
              <Route path="/runs" element={<RunsList></RunsList>} />
              <Route path="/runs/:runId" element={<RunDetails></RunDetails>} />
              <Route path="/computations" element={<ComputationsList />} />
              <Route path="/computations/create" element={<ComputationsCreate />} />
              <Route path="/computations/details/:computationId" element={<ComputationDetails />} />
              <Route path="/invites" element={<div>inviteslist</div>} />
              <Route path="/notifications" element={<NotificationList />} />
              <Route path="/appConfig" element={<AppConfig />} />
              <Route path="/adminEditUser" element={<AdminEditUser />} />
              <Route path="/pageLogin" element={<PageLogin />} />
              <Route path="/changePassword" element={<ChangePassword />} />
              <Route path="/runs/details/:runId" element={<RunDetails />} />
            </Routes>
          </div>
          <Drawer variant="permanent" anchor="right" open={open}>
            <Toolbar
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: [1],
              }}
            >
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon sx={{ color: '#ffffff' }} />
              </IconButton>
            </Toolbar>
            <Divider />
            <div>
              <Box sx={{ width: 360 }}>
                <List aria-label="main mailbox folders" sx={{ color: '#ffffff', borderTop: '1px solid rgba(255,255,255,0.33)' }}>
                  <ListItemLink onClick={() => setOpen(!open)} to="/consortia" primary="Consortia" />
                  <ListItemLink onClick={() => setOpen(!open)} to="/computations" primary="Computations" />
                  <ListItemLink onClick={() => setOpen(!open)} to="/runs" primary="Runs" />
                  <ListItemLink onClick={() => setOpen(!open)} to="/notifications" primary="Notifications" />
                  <ListItemLink onClick={() => setOpen(!open)} to="/appConfig" primary="App Config" />
                  <ListItemLink onClick={() => onLogout()} to="/" primary="Logout" />
                </List>
              </Box>
            </div>
          </Drawer>
        </Box>
      </ThemeProvider>
    </Router>
  );
}

export default App;
