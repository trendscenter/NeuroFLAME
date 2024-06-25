import React from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { CompConfigAdmin } from './CompConfigAdmin/CompConfigAdmin';

const GET_CONSORTIUM_DETAILS = gql`
  query getConsortiumDetails($consortiumId: String!) {
    getConsortiumDetails(consortiumId: $consortiumId) {
      id
      title
      description
      administrator {
        id
        username
      }
      members {
        id
        username
      }
      activeMembers {
        id
        username
      }
    }
  }
`;

export default function ComputationConfigurationAdmin(props) {
    const { consortiumId, onChangeComputationConfigurationAdmin } = props;
    const { loading, error, data } = useQuery(GET_CONSORTIUM_DETAILS, { variables: { consortiumId } });

    const handleChangeComputation = (event) => {
      onChangeComputationConfigurationAdmin(event);
    }

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: Please try again</p>}
            {data && <CompConfigAdmin consortiumId={consortiumId} onChangeCompConfigAdmin={handleChangeComputation} />}
        </div>
    );
}


