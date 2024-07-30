import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useLoginAndConnect } from './useLoginAndConnect';
import { useNavigate } from 'react-router-dom';
import logo from '../components/assets/coinstac-logo.png';
import { Typography } from '@mui/material';
import { useUserState } from '../contexts/UserStateContext';
import { useNotifications } from '../contexts/NotificationsContext';

const styles = {
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%', // Ensure the container takes the full width
  },
  input: {
    maxWidth: '300px', // Set a maximum width for the input fields
    width: '100%', // Ensure input takes the full width of its container
    margin: '10px 0', // Add vertical margin
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#001F70',
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0'
  },
  branding: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandingText: {
    fontFamily: 'Lato',
    fontWeight: '700',
    fontSize: '3rem',
    color: 'white',
  },
  button: {
    width: '100%',
    borderRadius: '1.5rem',
    marginTop: '0.5rem',
    backgroundColor: '#0066FF', // Specific color for login/logout buttons
    ':disabled': {
      backgroundColor: '#ccc',
    },
  },
  statusMessage: {
    margin: '5px',
  },
  loading: {
    color: '#007bff',
  },
  error: {
    color: 'red',
  },
  success: {
    color: 'green',
  },
};

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


const InputField = ({ placeholder, value, type, onChange }) => (
  // Wrapping in div causes a warning in the dev console: validateDOMNesting(...): <div> cannot appear as a descendant of <p>.
  // <div style={styles.inputContainer}> {/* Wrap input in a div with the container style */}
  <input
    style={styles.input}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={e => onChange(e.target.value)}
  />
  // </div>
);

function Login() {
  const [value, setValue] = React.useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { loginToCentral, connectAsUser, createUser } = useLoginAndConnect();
  const [loginStatus, setloginStatus] = useState({ loading: false, error: null, data: null });
  const [connectStatus, setConnectStatus] = useState({ loading: false, error: null, data: null });
  const [errorMessage, setErrorMessage] = useState('');
  const { subscribe, unsubscribe } = useNotifications();

  const { username: loggedInUsername, setUserData, clearUserData } = useUserState();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setloginStatus({ loading: true, error: null, data: null });
    await loginToCentral(username, password);
    setloginStatus({ loading: false, error: null, data: true });

    setConnectStatus({ loading: true, error: null, data: null });
    await connectAsUser();
    setConnectStatus({ loading: false, error: null, data: true });

    await subscribe();

    navigate('/consortia');
  };

  const connectAndSubscribe = async () => {
    try {
        await unsubscribe();
        await connectAsUser();
        await subscribe();
    } catch (e) {
        console.error(`Error connecting: ${e}`);
        setErrorMessage('Failed to connect. Please try again later.');
    }
  };

  const handleCreateUser = async (username, password, rememberMe) => {
    setErrorMessage(''); // Clear previous error messages
    try {
        const { accessToken, userId, username: returnedUserName, roles } = await createUser(username, password);
        setUserData({ accessToken, userId, username: returnedUserName, roles }, rememberMe);
        await connectAndSubscribe();
        navigate('/consortia/');
    } catch (e) {
        console.error(`Error logging in: ${e.message}`);
        setErrorMessage(`Failed to login: ${e.message}`);
        clearUserData();
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div style={styles.container}>
      <div style={styles.branding}>
        <img
          src={logo}
          alt="Logo"
        />
        <Typography style={styles.brandingText}>COINSTAC</Typography>
      </div>
      <Box sx={{ backgroundColor: '#f5f5f5', width: '300px', borderRadius: '0.5rem', marginTop: '1rem' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <Tab label="Login" {...a11yProps(0)} sx={{ flexGrow: '1' }} />
            <Tab label="Sign Up" {...a11yProps(1)} sx={{ flexGrow: '1' }} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <InputField
            type="text"
            placeholder="Username"
            value={username}
            onChange={setUsername}
          />
          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
          />
          <div>
              <label style={{fontSize: '0.9rem'}}>
                  <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{marginRight: '0.25rem'}}
                  />
                  Remember me
              </label>
          </div>
          <button
            style={styles.button}
            onClick={() => handleLogin()}
            disabled={loginStatus.loading || connectStatus.loading}
          >
            {loginStatus.loading || connectStatus.loading ? 'Loading...' : 'Submit'}
          </button>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <InputField
              type="text"
              placeholder="Username"
              value={username}
              onChange={setUsername}
            />
            <InputField
              type="password"
              placeholder="Password"
              value={password}
              onChange={setPassword}
            />
            <div>
                <label style={{fontSize: '0.9rem'}}>
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={{marginRight: '0.25rem'}}
                    />
                    Remember me
                </label>
            </div>
            <button
              style={styles.button}
              onClick={async () => {
                await handleCreateUser(username, password, rememberMe)
              }}
              disabled={loginStatus.loading || connectStatus.loading}
            >Create User</button>
        </CustomTabPanel>
      </Box>
    </div>
  );
}

export default Login;

