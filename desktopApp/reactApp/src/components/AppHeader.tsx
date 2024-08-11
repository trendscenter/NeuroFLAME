import React, { useState, useEffect } from 'react';
import MuiAppBar, { AppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import UserAvatar from './UserAvatar';
import logoSM from './assets/coinstac-logo-sm.png';

import {
    Link as RouterLink,
    Route,
    Routes,
    MemoryRouter,
  } from 'react-router-dom';


export default function AppHeader({
    appDrawerWidth,
    appUsername,
    appOpen,
    appToggleDrawer
}) {   
    interface AppBarOwnProps {
        appOpen?: boolean;
        // other props if needed
      }
      
    const AppBar = styled(MuiAppBar, {
        shouldForwardProp: (prop) => prop !== 'open',
      })<AppBarProps & AppBarOwnProps>(({ theme, appOpen }) => ({
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        ...(appOpen && {
          marginRight: appDrawerWidth,
          width: `calc(100% - ${appDrawerWidth}px)`,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }),
    }));

  // Define the props type, replace 'any' with the actual type of your itemProps if known
  interface LinkProps {
    to: string;
    // Add other props specific to your RouterLink component
    [key: string]: any;
  }
  
  const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(itemProps, ref) {
    return <RouterLink ref={ref} {...itemProps} role={undefined} />;
  });
  
    return (
        <AppBar position="absolute" appOpen={appOpen}>
            <Toolbar
                sx={{
                pr: '24px', // keep right padding when drawer closed
                backgroundColor: '#001f70'
                }}
            >
                <Typography
                sx={{ flexGrow: 1 }}
                >
                </Typography>
                <img
                src={logoSM}
                alt="Logo"
                style={{
                    marginRight: '2px',
                    width: '28px',
                    height: '28px',
                }}
                />
                <Typography
                component="h1"
                variant="h6"
                color="inherit"
                sx={{
                    fontFamily: 'Lato',
                    fontWeight: '600'
                }}
                noWrap
                >
                COINSTAC
                </Typography>
                <Link to="/pageLogin" style={{textDecoration: 'none'}}>
                <UserAvatar username={appUsername} />
                </Link>
                <IconButton
                edge="end"
                color="inherit"
                aria-label="open drawer"
                onClick={appToggleDrawer}
                sx={{
                    ...(appOpen && { display: 'none' }),
                }}
                >
                <MenuIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
)
}