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

const UserColor = [
  "#FFBA08",
  "#F25919",
  "#B91372",
  "#440381",
  "#016572",
  "#6EC2C0"
]

const GetUserColor = (index) => {
  index = +index < UserColor.length ? index : 0;
  return UserColor[index];
}

const UserAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== 'admin'
})(({ admin, index }) => ({
    width: '45px',
    height: '45px',
    background: !admin ? GetUserColor(index) : 'none'
}));

export default function MemberAvatar(props) {   
    const { index, username, admin, active } = props;
    return (
      <div style={{
        position: "relative",
        display: "inline-flex",
        marginRight: "0.5rem",
        marginBottom: "0.5rem",
        textAlign: "center",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
      }}>
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
              marginLeft: '2rem',
              zIndex: '3',
            }}
          /> : ''}
        <UserAvatar admin={admin} index={index}>
          <span
            style={{ 
              position: 'absolute',
              width: '45px', 
              height: '45px', 
              zIndex: '2',
              top: '25%',
            }}
          >
          {username.charAt(0).toUpperCase()}
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
      </div>
    )
}