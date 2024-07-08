import React from 'react';
import { useContext } from "react";
import { useParams } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Avatar from '@mui/material/Avatar';

export default function UserAvatar(props: any) {   
    const { username } = props;

    return (
      <Avatar 
        sx={{ 
          bgcolor: '#FF007A', 
          width: '32px', 
          height: '32px',
          marginLeft: '1rem',
          marginRight: '0.5rem'  
        }}
      >{username && username.charAt(0).toUpperCase()}
      </Avatar>
    )
}