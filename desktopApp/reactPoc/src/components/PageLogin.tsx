import React, { useEffect, useState } from 'react';
import { useUserState } from '../contexts/UserStateContext';
import { useLoginAndConnect } from './useLoginAndConnect';
import { Link, useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationsContext';

export default function PageLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { loginToCentral, connectAsUser, createUser, startClients } = useLoginAndConnect();
    const { subscribe, unsubscribe } = useNotifications();
    const { username: loggedInUsername, setUserData, clearUserData } = useUserState();
    const [isLoggedIn, setIsloggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsloggedIn(!!loggedInUsername);
    }, [loggedInUsername]);

    const handleCreateUser = async (username: string, password: string, rememberMe: boolean) => {
        setErrorMessage(''); // Clear previous error messages
        try {
            const { accessToken, userId, username: returnedUserName, roles } = await createUser(username, password);
            setUserData({ accessToken, userId, username: returnedUserName, roles }, rememberMe);
            await connectAndSubscribe();
            navigate('/consortia/');
        } catch (e: any) {
            console.error(`Error logging in: ${e.message}`);
            setErrorMessage(`Failed to login: ${e.message}`);
            clearUserData();
        }
    };

    const handleLogin = async (username: string, password: string, rememberMe: boolean) => {
        setErrorMessage(''); // Clear previous error messages
        try {
            const { accessToken, userId, username: returnedUserName, roles } = await loginToCentral(username, password);
            setUserData({ accessToken, userId, username: returnedUserName, roles }, rememberMe);
            await connectAndSubscribe();
            navigate('/consortia/');
        } catch (e: any) {
            console.error(`Error logging in: ${e}`);
            setErrorMessage('Failed to login. Please check your username and password.');
            clearUserData();
        }
    };

    const connectAndSubscribe = async () => {
        try {
            await unsubscribe();
            await startClients();
            await connectAsUser();
            await subscribe();
        } catch (e: any) {
            console.error(`Error connecting: ${e}`);
            setErrorMessage('Failed to connect. Please try again later.');
        }
    };

    const handleConnect = async () => {
        try {
            await connectAndSubscribe();
            navigate('/consortia/');
        } catch (e: any) {
            console.error(`Error connecting: ${e}`);
            setErrorMessage('Failed to connect. Please try again later.');
        }
    };

    const handleLogout = () => {
        clearUserData();
        unsubscribe();
    };

    const loggedInView = (
        <div>
            <h1>Welcome {loggedInUsername}</h1>
            <div>
                <button onClick={handleConnect} style={{ width: '150px' }}>Connect</button>
            </div>
            <div>
                <button onClick={handleLogout} style={{ width: '150px' }}>Logout</button>
            </div>
            <div>
                <button style={{ width: '150px' }}>
                    <Link to="/changePassword/">Change Password</Link>
                </button>
            </div>
        </div>

    );

    const loginView = (
        <div>
            <h1>Login</h1>
            <div>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember me
                </label>
            </div>
            <div>
                <button onClick={
                    async () => {
                        await handleLogin(username, password, rememberMe)
                    }
                }>Login</button> or <button
                    onClick={async () => {
                        await handleCreateUser(username, password, rememberMe)
                    }}
                >Create User</button>
            </div>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );

    return (
        <div>
            {isLoggedIn ? loggedInView : loginView}
        </div>
    );
}
