import React, { useState } from 'react';
import { Button, TextField, Container, Typography } from '@mui/material';
import { useCentralApi } from "../apis/centralApi/centralApi"
import { useEdgeApi } from '../apis/edgeApi/edgeApi';
import { useUserState } from '../contexts/userStateContext';
import { useNavigate } from 'react-router-dom';


const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {login} = useCentralApi()
  const {connectAsUser} = useEdgeApi()
  const {setUserData} = useUserState()
  const navigate = useNavigate();

  const handleLogin = async () => {
    // request to the central api
    const userData = await login(username, password)
    // set user data
    await setUserData(userData)
    // request to the edge api
    await connectAsUser();
    // subscribe to notifications
    
    // navigate to the home page
    navigate('/consortium')
    
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      <TextField
        label="Username"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleLogin}
      >
        Log In
      </Button>
    </Container>
  );
};

export default LoginPage;
