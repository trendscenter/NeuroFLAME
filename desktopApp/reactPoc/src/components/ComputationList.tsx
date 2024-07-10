import { gql } from '@apollo/client';
import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { ApolloClientsContext } from '../contexts/ApolloClientsContext';
import { Link } from 'react-router-dom';

export const GET_COMPUTATION_LIST = gql`
  query GetComputationList {
    getComputationList {
      id
      title
      imageName
    }
  }
`;

interface ComputationListItem {
    id: string;
    title: string;
    imageName: string;
}

const ComputationList: React.FC = () => {
    const { centralApiApolloClient } = useContext(ApolloClientsContext);

    const { loading, error, data } = useQuery<{ getComputationList: ComputationListItem[] }>(
        GET_COMPUTATION_LIST,
        { client: centralApiApolloClient }
    );

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h1>Computation List</h1>
            <Link to="/computations/create">Create Computation</Link>
            {data?.getComputationList.map((computation) => (
                <div key={computation.title}>
                    <Link to={`/computations/details/${computation.id}`}>
                        <h2>{computation.title}</h2>
                    </Link>
                    <p>Image Name: {computation.imageName}</p>

                    {/* <pre>{JSON.stringify(computation, null, 2)}</pre> */}
                </div>
            ))}
        </div>
    );
};

export default ComputationList;
