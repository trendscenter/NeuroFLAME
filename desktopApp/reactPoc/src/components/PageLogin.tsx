import React, {  useState } from 'react';

import { useUserState } from '../contexts/UserStateContext';

export default function PageLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, logout, userId, username: loggedInUsername } = useUserState()

    const handleLogin = () => {
        login(username, password)
    }

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
                    {
                        userId && <div>Logged in as {loggedInUsername} <button onClick={logout}>logout</button></div>
                    }
                </div>
            </form>
        </div>
    );
}
