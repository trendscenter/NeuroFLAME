import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useLogin } from './UseLogin';
import { useNavigate } from 'react-router-dom';
import logo from '../components/assets/coinstac-logo.png';
import { Typography } from '@mui/material';

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
  <div style={styles.inputContainer}> {/* Wrap input in a div with the container style */}
    <input
      style={styles.input}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

function Login() {
  const [value, setValue] = React.useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, authenticateStatus, connectStatus } = useLogin(onSuccess);
  
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);
  //const auth = useAuthContext();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function onSuccess() {
    navigate('/consortia');
  }

  // function onLogout() {
  //   auth.setAuthInfo({ accessToken: null, refreshToken: null, userId: null });
  // }

  const renderStatus = (status, action) => {
    const { loading, error, data } = status;
    const isVisible = loading || error || data;

    if (!isVisible) {
      return null;
    }
    return (
      <div style={styles.statusMessage}>
        <span>{action}: </span>
        {loading && <span style={styles.loading}>Loading...</span>}
        {error && <span style={styles.error}>Error: {error.message}</span>}
        {data && <span style={styles.success}>Success</span>}
      </div>
    );
  };

  if (auth) {
    return (
      <div style={styles.container}>
        <button style={styles.button}>
          Logout
        </button>
      </div>
    );
  }

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
          <button
            style={styles.button}
            onClick={() => login(username, password)}
            disabled={authenticateStatus.loading || connectStatus.loading}
          >
            {authenticateStatus.loading || connectStatus.loading ? 'Loading...' : 'Submit'}
          </button>
          {/*renderStatus(authenticateStatus, "Authenticate with Central Server")*/}
          {/*renderStatus(connectStatus, "Connect to Federated Client")*/}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          Item Two
        </CustomTabPanel>
      </Box>
    </div>
  );
}

export default Login;

