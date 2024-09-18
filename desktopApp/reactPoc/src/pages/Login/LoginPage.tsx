import React, { useState } from 'react';
import { Button, TextField, Container, Typography, CircularProgress, Alert } from '@mui/material';
import { useLogin } from './useLogin';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, loading, error } = useLogin();

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
  );
};

export default LoginPage;
