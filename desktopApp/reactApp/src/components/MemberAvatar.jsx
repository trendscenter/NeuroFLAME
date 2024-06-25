import React from 'react';
import { useParams } from 'react-router-dom';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Avatar from '@mui/material/Avatar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Shield from '../components/assets/shield.svg';
import { gql, useQuery, useMutation, useSubscription } from '@apollo/client';


const GET_USER_DETAILS = gql`
  query getUserDetails($userId: String!) {
    getUserDetails(userId: $userId) {
      id
      username
    }
  }
`;

const UserAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== 'admin',
})
(({ theme, admin }) => ({
...(!admin && {
    width: '45px',
    height: '45px',
    background: '#0066FF',
}),
...(admin && {
  width: '45px',
  height: '45px',
  background: 'none',
}),
}));

export default function MemberAvatar(props) {   
    const { username, admin, active } = props;

    return (
      <div style={{
        position: 'relative',
        display: 'block',
        marginRight: '8px',
        width: '45px',
        textAlign: 'center'
      }}>
        <UserAvatar admin>
          <span
            style={{ 
              position: 'absolute',
              width: '45px', 
              height: '45px', 
              zIndex: '2',
              top: '25%',
            }}
          >
          {username ? username.charAt(0).toUpperCase() : ''}
          </span>
          {admin ? 
          <img 
            src={ admin ? Shield : false }
            style={{ 
              position: 'absolute',
              width: '50px', 
              height: '50px', 
              zIndex: '1',
              objectFit: 'cover'
            }}
          /> : 
         ''}
        </UserAvatar>
        <b style={{fontSize: '14px'}}>{username}</b>
        {active ? 
          <CheckCircleIcon 
            sx={{ 
              position: 'absolute',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              color: '#2FA84F', 
              width: '16px', 
              height: '16px', 
              top: '-2px',
              right: '-3px',
              zIndex: '3',
            }}
          /> : ''}
      </div>
    )
}