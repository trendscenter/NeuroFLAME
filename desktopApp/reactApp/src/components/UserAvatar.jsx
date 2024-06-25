import React from 'react';
import { useParams } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Avatar from '@mui/material/Avatar';
import { gql, useQuery, useMutation, useSubscription } from '@apollo/client';


const GET_USER_DETAILS = gql`
  query getUserDetails($userId: String!) {
    getUserDetails(userId: $userId) {
      id
      username
    }
  }
`;

export default function UserAvatar(props) {   
    const { userId } = props;
    const { loading, error, data } = useQuery(GET_USER_DETAILS, {
      variables: { userId }
    });

    return (
      <Avatar 
        sx={{ 
          bgcolor: '#FF007A', 
          width: '32px', 
          height: '32px',
          marginLeft: '1rem',
          marginRight: '0.5rem'  
        }}
      >{data ? data.getUserDetails.username.charAt(0).toUpperCase() : ''}
      </Avatar>
    )
}