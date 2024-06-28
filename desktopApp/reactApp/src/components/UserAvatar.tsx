import React from 'react';
import { useContext } from "react";
import { useParams } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Avatar from '@mui/material/Avatar';
import { gql, useQuery } from '@apollo/client';
import { ApolloClientsContext } from "../contexts/ApolloClientsContext";


const GET_USER_DETAILS = gql`
  query getUserDetails($userId: String!) {
    getUserDetails(userId: $userId) {
      id
      username
    }
  }
`;

export default function UserAvatar(props: any) {   
    const { userId } = props;
    const { centralApiApolloClient } = useContext(ApolloClientsContext);
    const { data } = useQuery(GET_USER_DETAILS,  {
      variables: { userId },
      client: centralApiApolloClient
    });

    const userDetails = data?.getUserDetails;

    return (
      <Avatar 
        sx={{ 
          bgcolor: '#FF007A', 
          width: '32px', 
          height: '32px',
          marginLeft: '1rem',
          marginRight: '0.5rem'  
        }}
      >{userDetails && userDetails.username.charAt(0).toUpperCase()}
      </Avatar>
    )
}