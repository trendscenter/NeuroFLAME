import React, { useState } from 'react';
import { useUserState } from '../contexts/UserStateContext';

export default function PageLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginStatus, setLoginStatus] = useState<{ success: boolean; message?: string } | null>(null);
    const { login, logout, userId, username: loggedInUsername } = useUserState();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        const result = await login(username, password);
        setLoginStatus(result);
    };

    const handleLogout = () => {
        logout();
        setLoginStatus(null);
        setUsername('');
        setPassword('');
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <div>
                        <label htmlFor="username">Username</label>
                    </div>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        aria-label="Username"
                    />
                </div>
                <div>
                    <div>
                        <label htmlFor="password">Password</label>
                    </div>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        aria-label="Password"
                    />
                </div>
                <div>
                    <button type="submit">Login</button>
                </div>
            </form>
            {loginStatus && (
                <div>
                    {loginStatus.message}
                </div>
            )}
            {userId && (
                <div>
                    <p>Logged in as {loggedInUsername}</p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
}
