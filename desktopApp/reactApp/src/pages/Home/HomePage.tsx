// HomePage.tsx
import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { CreateUser } from './CreateUser/CreateUser';
import { Login } from './Login/Login';
import { ChangePassword } from './ChangePassword/ChangePassword';
import { useHomePage } from './useHomePage';
import logo from '../../assets/coinstac-logo.png';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { isLoggedIn, logout } = useHomePage(); // Assuming logout is provided by useHomePage
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const navigate = useNavigate();

  return (
    <Box sx={{
      width: "100vw",
      height: "100vh",
      background: "#001F70",
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <img src={logo} alt="Logo" />
        <Typography style={{
          fontFamily: 'Lato',
          fontWeight: 700,
          fontSize: '3rem',
          color: 'white',
        }}>COINSTAC</Typography>
      </Box>

      <Box sx={{ maxWidth: 'xs' }}>
        {!isLoggedIn ? (
          <>
            {showCreateUser ? (
              <CreateUser />
            ) : (
              <Login />
            )}
            <Button
              variant="text"
              color="primary"
              fullWidth
              onClick={() => setShowCreateUser(!showCreateUser)}
              sx={{ mt: 2 }}
            >
              {showCreateUser ? 'Back to Login' : 'Create User'}
            </Button>
          </>
        ) : (
          <>
            {showChangePassword ? (
              <ChangePassword />
            ) : (
              <Button
                variant="text"
                color="primary"
                fullWidth
                onClick={() => setShowChangePassword(true)}
                sx={{ mt: 2 }}
              >
                Change Password
              </Button>
            )}
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={logout}
              sx={{ mt: 2 }}
            >
              Logout
            </Button>
          </>
        )}
      </Box>
      <Box sx={{ maxWidth: 'xs' }}>
      <Button
        variant="text"
        color="primary"
        fullWidth
        onClick={() => navigate(`/appConfig`)}
      >
        App Configuration
      </Button>
      </Box>

    </Box>
  );
};

export default HomePage;
