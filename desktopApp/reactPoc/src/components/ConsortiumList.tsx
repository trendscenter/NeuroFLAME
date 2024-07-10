import { gql } from '@apollo/client';
import React, { useContext, useEffect } from 'react';
import { ApolloClientsContext } from '../contexts/ApolloClientsContext';
import { Link } from 'react-router-dom';
import { useUserState } from '../contexts/UserStateContext';

interface PublicUser {
  id: string;
  username: string;
}

interface IConsortiumListItem {
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

export const JOIN_CONSORTIUM = gql`
  mutation consortiumJoin($consortiumId: String!) {
    consortiumJoin(consortiumId: $consortiumId)
  }
`;

export const LEAVE_CONSORTIUM = gql`
  mutation consortiumLeave($consortiumId: String!) {
    consortiumLeave(consortiumId: $consortiumId)
  }
`;

const ConsortiumList: React.FC = () => {
  const { centralApiApolloClient } = useContext(ApolloClientsContext);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<any>(null);
  const [data, setData] = React.useState<{ getConsortiumList: IConsortiumListItem[] } | null>(null);


  useEffect(() => {
    getConsortiumList();
  }, []);

  const getConsortiumList = async () => {
    setLoading(true)
    const response = await centralApiApolloClient?.query({
      query: GET_CONSORTIUM_LIST
    })
    setData(response?.data)
    setError(response?.error)
    setLoading(false)
  }

  const handleJoinConsortium = async (consortiumId: string) => {
    centralApiApolloClient?.mutate({
      mutation: JOIN_CONSORTIUM,
      variables: { consortiumId: consortiumId }
    })
    getConsortiumList();
  }

  const handleLeaveConsortium = async (consortiumId: string) => {
    centralApiApolloClient?.mutate({
      mutation: LEAVE_CONSORTIUM,
      variables: { consortiumId: consortiumId }
    })
    getConsortiumList();
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Consortium List</h1>
      <Link to="/consortia/create">Create Consortium</Link>
      {data?.getConsortiumList.map((consortium) => {
        return <ConsortiumListItem key={consortium.id} consortium={consortium} handleJoinConsortium={handleJoinConsortium} handleLeaveConsortium={handleLeaveConsortium}></ConsortiumListItem>
      }
      )}
    </div>
  );
};

const ConsortiumListItem = ({ consortium, handleJoinConsortium, handleLeaveConsortium }: { consortium: IConsortiumListItem, handleJoinConsortium: (consortiumId: string) => Promise<void>, handleLeaveConsortium: (consortiumId: string) => Promise<void> }) => {
  const { userId } = useUserState();
  const [canJoin, setCanJoin] = React.useState<boolean>(false);
  const [canLeave, setCanLeave] = React.useState<boolean>(false);



  useEffect(() => {
    if (userId) {
      const isUser = !!userId
      const isMember = consortium.members.some((member) => member.id === userId);
      const isLeader = consortium.leader.id === userId;

      setCanJoin(isUser && !isMember && !isLeader);
      setCanLeave(isUser && isMember && !isLeader);
    }

  }, [userId, consortium.members, consortium.leader])

  return <div key={consortium.title}>
    <h2>
      <Link to={`/consortia/details/${consortium.id}/`}>
        {consortium.title}
      </Link>
    </h2>
    <p>{consortium.description}</p>
    <p>Leader: {consortium.leader.username}</p>
    <h3>Members:</h3>
    <ul>
      {consortium.members.map((member) => (
        <li key={member.id}>{member.username}</li>
      ))}
    </ul>

    {canJoin && <button onClick={async () => { await handleJoinConsortium(consortium.id) }}>Join</button>}
    {canLeave && <button onClick={async () => { await handleLeaveConsortium(consortium.id) }} >Leave</button>}
  </div>
}

export default ConsortiumList;
