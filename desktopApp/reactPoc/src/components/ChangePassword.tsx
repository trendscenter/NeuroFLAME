import { useContext, useState } from "react";
import { useUserState } from "../contexts/UserStateContext";
import { ApolloClientsContext } from "../contexts/ApolloClientsContext";
import { gql } from "@apollo/client";

// userChangePassword(userId: String, password: String): Boolean
const USER_CHANGE_PASSWORD_MUTATION = gql`
    mutation UserChangePassword( $password: String!) {
        userChangePassword(password: $password)
    }
`;


export default function ChangePassword() {
    const { centralApiApolloClient } = useContext(ApolloClientsContext);
    const { username } = useUserState();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

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
                mutation: USER_CHANGE_PASSWORD_MUTATION,
                variables: {
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

    return (
        <div>
            <h1>Change Password</h1>
            <h2>{username}</h2>
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
            </div>
            {error && <div id="passwordHelp" style={{ color: 'red' }}>{error}</div>}
            {message && <div style={{ color: 'green' }}>{message}</div>}
            <button onClick={changePassword} disabled={loading}>
                {loading ? 'Changing...' : 'Change Password'}
            </button>
        </div>
    );
}
