import React from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import CompConfigMember from './CompConfigMember/CompConfigMember';

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


export default function ComputationConfigurationMember() {
    const { consortiumId } = useParams();
    const { loading, error, data } = useQuery(GET_CONSORTIUM_DETAILS, { variables: { consortiumId } })

    return (
        <div>
            <h1>{(data && data.getConsortiumDetails.title) || consortiumId}</h1>
            {loading && <p>Loading...</p>}
            {error && <p>Error: Please try again</p>}
            <CompConfigMember consortiumId={consortiumId} />
        </div>
    );
}


