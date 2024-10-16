<<<<<<< HEAD
import React, { useState } from 'react';
import { Button, TextField, Container, Typography, CircularProgress, Alert } from '@mui/material';
import { useLogin } from './useLogin';
=======
import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, CircularProgress, Alert } from '@mui/material';
import { useLogin } from './useLogin';
import logo from '../../assets/coinstac-logo.png';
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, loading, error } = useLogin();
<<<<<<< HEAD

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Username"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={loading}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => handleLogin(username, password)}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Log In'}
      </Button>
    </Container>
=======
  
  {/* Login on Enter */}
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.code === "Enter") {
        event.preventDefault();
    
        if (username && password) {
          handleLogin(username, password);
        } else {
          console.error("Username or password is not defined");
        }
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [username, password]);

  return (
    <Box sx={{
      width:"100vw",
      height:"100vh",
      background:"#001F70",
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
        <img
          src={logo}
          alt="Logo"
        />
        <Typography style={{
          fontFamily: 'Lato',
          fontWeight: '700',
          fontSize: '3rem',
          color: 'white',
        }}>COINSTAC</Typography>
      </Box>
      <Box maxWidth="xs">
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          placeholder="Username"
          value={username}
          fullWidth
          size="small"
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: 'white'
            },
            '& .MuiInputBase-root input': {
              margin: '0'
            },
            marginBottom: '1rem'
          }}
        />
        <TextField
          placeholder="Password"
          type="password"
          fullWidth
          size="small"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: 'white',
            },
            '& .MuiInputBase-root input': {
              margin: '0'
            },
            marginBottom: '1rem'
          }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => handleLogin(username, password)}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Log In'}
        </Button>
      </Box>
    </Box>
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)
  );
};

export default LoginPage;
