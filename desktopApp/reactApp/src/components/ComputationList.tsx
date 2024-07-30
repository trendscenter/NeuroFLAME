import { gql } from '@apollo/client';
import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import { useQuery } from '@apollo/client';
import { ApolloClientsContext } from '../contexts/ApolloClientsContext';
import { Link } from 'react-router-dom';
import styles from './styles';

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
        <div style={{position: 'relative'}}>
            <h1>Computation List</h1>
            <Link style={{position: 'absolute', top: 0, right: 0}} to="/computations/create">
                <Button variant="contained">Create Computation</Button>
            </Link>
            {data?.getComputationList.map((computation) => (
                    <Card 
                        key={computation.title} 
                        sx={styles.cardRow}
                    >
                    <Link to={`/computations/details/${computation.id}`}>
                        <h2>{computation.title}</h2>
                    </Link>
                    <p><b>Image Name:</b> {computation.imageName}</p>

                    {/* <pre>{JSON.stringify(computation, null, 2)}</pre> */}
                </Card>
            ))}
        </div>
    );
};

export default ComputationList;
