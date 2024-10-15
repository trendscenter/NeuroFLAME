import React, { useState } from "react";
import { gql, useMutation } from '@apollo/client';

const CREATE_CONSORTIUM_MUTATION = gql`
  mutation CreateConsortium($title: String!, $description: String!) {
    createConsortium(title: $title, description: $description) {
      title
      description
    }
  }
`;

export default function CreateConsortium() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [createConsortium, { data, loading, error }] = useMutation(CREATE_CONSORTIUM_MUTATION);

  const handleCreateConsortium = (event) => {
    event.preventDefault();
    createConsortium({ variables: { title: title, description: description } });
  }

  return (
    <div>
      <form onSubmit={handleCreateConsortium}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Create Consortium</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>Error :( Please try again</p>}
      {data && <pre>{JSON.stringify(data)}</pre>}
    </div>
  );
}
