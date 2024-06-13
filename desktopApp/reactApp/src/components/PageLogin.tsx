import { gql, useMutation } from '@apollo/client';
import React, { useContext, useEffect, useState } from 'react';
import { ApolloClientsContext } from '../contexts/ApolloClientsContext';

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`;

export default function PageLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const { centralApiApolloClient } = useContext(ApolloClientsContext);

    const [login, { data, loading, error }] = useMutation(LOGIN_MUTATION, {
        client: centralApiApolloClient,
        onCompleted: (data) => {
            localStorage.setItem('accessToken', data.login);
            setAccessToken(data.login);
        },
    });

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setAccessToken(token);
        }
    }, []);

    const handleLogin = (e: any) => {
        e.preventDefault();
        login({ variables: { username, password } });
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="username">Username</label>
                </div>
                <div>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                </div>
                <div>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                </div>
                <div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
                {error && <p>Error: {error.message}</p>}
            </form>
            {accessToken && (
                <div>
                    <h2>Access Token</h2>
                    <pre><code>{accessToken}</code></pre>
                </div>
            )}
        </div>
    );
}
