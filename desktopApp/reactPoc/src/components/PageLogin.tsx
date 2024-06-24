import { gql, useMutation } from '@apollo/client';
import React, { useContext, useEffect, useState } from 'react';
import { ApolloClientsContext } from '../contexts/ApolloClientsContext';

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`;

export const CONNECT_AS_USER = gql`
  mutation ConnectAsUser {
    connectAsUser
  }
`;

export default function PageLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const { centralApiApolloClient, edgeClientApolloClient } = useContext(ApolloClientsContext);

    const connectAsUser = async () => {
        try {
            const result = await edgeClientApolloClient?.mutate({
                mutation: CONNECT_AS_USER
            })
        } catch (e: any) {
            console.error(`error connecting as user ${e}`)
        }
    }

    const login = async () => {
        const result = await centralApiApolloClient?.mutate({
            mutation: LOGIN_MUTATION,
            variables: { username, password }
        })

        const accessToken = result?.data?.login

        localStorage.setItem("accessToken", accessToken)
        setAccessToken(accessToken)
    }

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setAccessToken(token);
        }
    }, []);



    const handleLogin = (e: any) => {
        e.preventDefault();
        login()
        connectAsUser()
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
                    <button type="submit">
                        Login
                    </button>
                </div>
  
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
