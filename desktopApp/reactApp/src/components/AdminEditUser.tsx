import { useContext, useState } from "react";
import { ApolloClientsContext } from "../contexts/ApolloClientsContext";
import { useUserState } from '../contexts/UserStateContext';
import { gql } from "@apollo/client";

const ADMIN_CHANGE_USER_PASSWORD = gql`
    mutation AdminChangeUserPassword($username: String!, $password: String!) {
        adminChangeUserPassword(username: $username, password: $password)
    }
`;

const ADMIN_CHANGE_USER_ROLES = gql`
    mutation AdminChangeUserRoles($username: String!, $roles: [String]!) {
        adminChangeUserRoles(username: $username, roles: $roles)
    }
`;

export default function AdminChangeUserPassword() {
    const { centralApiApolloClient } = useContext(ApolloClientsContext);
    const [newUsername, setNewUsername] = useState('');
    const [password, setPassword] = useState('');
    const [roles, setRoles] = useState([] as string[]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const { username, clearUserData } = useUserState();

    const validatePassword = () => {
        if (password.length < 8) {
            return "Password must be at least 8 characters long.";
        }
        // Add more validation rules as needed
        return '';
    };

    const changePassword = async () => {
        const validationError = validatePassword();
        if (validationError) {
            setError(validationError);
            return;
        }
        setLoading(true);
        try {
            await centralApiApolloClient?.mutate({
                mutation: ADMIN_CHANGE_USER_PASSWORD,
                variables: {
                    username,
                    password
                }
            });
            setError('');
            setMessage('Password changed successfully.');
        } catch (e) {
            console.error(`Error changing password: ${e}`);
            setError('Failed to change password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const changeRoles = async () => {
        setLoading(true);
        try {
            await centralApiApolloClient?.mutate({
                mutation: ADMIN_CHANGE_USER_ROLES,
                variables: {
                    username,
                    roles
                }
            });
            setError('');
            setMessage('Roles changed successfully.');
        } catch (e) {
            console.error(`Error changing roles: ${e}`);
            setError('Failed to change roles. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Admin Change User Details</h1>
            <div>
                <label htmlFor="username">Username:</label>
            </div>
            <div>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={newUsername}
                    placeholder={username}
                    onChange={(e) => setNewUsername(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="password">New Password:</label>
            </div>
            <div>
                <input
                    type="password"
                    id="password"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    aria-describedby="passwordHelp"
                />
                <button onClick={changePassword} disabled={loading}>
                    {loading ? 'Changing...' : 'Change Password'}
                </button>
            </div>
            <div>
                <label htmlFor="roles">Roles (comma separated):</label>
            </div>
            <div>
                <input
                    type="text"
                    id="roles"
                    name="roles"
                    value={roles.join(', ')}
                    onChange={(e) => setRoles(e.target.value.split(',').map(role => role.trim()))}
                />
                <button onClick={changeRoles} disabled={loading}>
                    {loading ? 'Changing...' : 'Change Roles'}
                </button>
            </div>
            {error && <div id="passwordHelp" style={{ color: 'red' }}>{error}</div>}
            {message && <div style={{ color: 'green' }}>{message}</div>}
        </div>
    );
}
