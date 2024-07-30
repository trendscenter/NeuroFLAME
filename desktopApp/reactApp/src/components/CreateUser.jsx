import React from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

const CREATE_USER = gql`
  mutation CreateUser($username: String!, $password: String!) {
    createUser(username: $username, password: $password)
  }
`;

function CreateUserComponent() {
    const [createUser, { data, loading, error }] = useMutation(CREATE_USER);
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleCreateUser = () => {
        createUser({
            variables: {
                username: username,
                password: password,
            },
        });
    };

    return (
        <div>
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
            <button onClick={handleCreateUser}>Create User</button>

            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {data && <p>User created successfully!</p>}
        </div>
    );
}

export default CreateUserComponent;