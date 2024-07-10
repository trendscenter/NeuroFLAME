import React, { useEffect, useState } from 'react';
import { useUserState } from '../contexts/UserStateContext';
import { useLoginAndConnect } from './useLoginAndConnect';
import {useNavigate} from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationsContext';

export default function PageLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { loginToCentral, connectAsUser } = useLoginAndConnect();
    const {subscribe, unsubscribe} = useNotifications();
    const { username: loggedInUsername, setUserData, clearUserData } = useUserState();
    const [isLoggedIn, setIsloggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsloggedIn(!!loggedInUsername);
    }, [loggedInUsername]);



    const handleLogin = async (username: string, password: string, rememberMe: boolean) => {
        console.log("before loginToCentral")
        setErrorMessage(''); // Clear previous error messages
        try {
            const { accessToken, userId, username: returnedUserName, roles } = await loginToCentral(username, password);
            setUserData({ accessToken, userId, username: returnedUserName, roles }, rememberMe);
            console.log("before connectAndSubscribe")
            await connectAndSubscribe();
            console.log("after connectAndSubscribe")
            navigate('/consortia/');
        } catch (e: any) {
            console.error(`Error logging in: ${e}`);
            setErrorMessage('Failed to login. Please check your username and password.');
            clearUserData();
        }
    };

    const connectAndSubscribe = async () => {
        try {
            console.log("before connectAsUser")
            await connectAsUser();
            console.log("before subscribe")
            await subscribe();
            console.log("after subscribe")
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
                <button onClick={handleConnect}>Connect As User</button>
            </div>
            <div>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );

    const loginView = (
        <div>
            <h1>Login</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <label>
                <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
            </label>
            <button onClick={
                async () => {
                    await handleLogin(username, password, rememberMe)
                }
            }>Login</button>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );

    return (
        <div>
            {isLoggedIn ? loggedInView : loginView}
        </div>
    );
}
