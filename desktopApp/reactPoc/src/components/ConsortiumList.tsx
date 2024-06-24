import { gql } from '@apollo/client';
import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { ApolloClientsContext } from '../contexts/ApolloClientsContext';

interface PublicUser {
  id: string;
  username: string;
}

interface ConsortiumListItem {
  id: string;
  title: string;
  description: string;
  leader: PublicUser;
  members: PublicUser[];
}

export const GET_CONSORTIUM_LIST = gql`
  query GetConsortiumList {
    getConsortiumList {
      id
      title
      description
      leader {
        id
        username
      }
      members {
        id
        username
      }
    }
  }
`;

const ConsortiumList: React.FC = () => {
  const { centralApiApolloClient } = useContext(ApolloClientsContext);

  const { loading, error, data } = useQuery<{ getConsortiumList: ConsortiumListItem[] }>(
    GET_CONSORTIUM_LIST,
    { client: centralApiApolloClient }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Consortium List</h1>
      {data?.getConsortiumList.map((consortium) => (
        
        <div key={consortium.title}>
          <h2>{consortium.title}</h2>
          <p>{consortium.description}</p>
          <p>Leader: {consortium.leader.username}</p>
          <h3>Members:</h3>
          <ul>
            {consortium.members.map((member) => (
              <li key={member.id}>{member.username}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ConsortiumList;
