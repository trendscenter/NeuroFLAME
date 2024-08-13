import React from 'react';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PropTypes from 'prop-types';

import {
    Link as RouterLink,
    Route,
    Routes,
    MemoryRouter,
  } from 'react-router-dom';

export default function AppDrawer({
    appDrawerWidth,
    appToggleDrawer,
    appOpen, 
    appSetOpen,
    appOnLogout
}) {   
    // Define the props type, replace 'any' with the actual type of your itemProps if known
    interface LinkProps {
        to: string;
        // Add other props specific to your RouterLink component
        [key: string]: any;
    }
    
    const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(itemProps, ref) {
        return <RouterLink ref={ref} {...itemProps} role={undefined} />;
    });
    
    function ListItemLink(props) {
        const { icon, primary, to, onClick } = props;
    
        return (
            <li>
            <ListItem button component={Link} to={to} onClick={onClick}>
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary} />
            </ListItem>
            </li>
        );
    }
    
    ListItemLink.propTypes = {
        icon: PropTypes.element,
        primary: PropTypes.string.isRequired,
        to: PropTypes.string.isRequired,
        onClick: PropTypes.func,
    };
    
    interface ListItemFuncProps {
        icon?: React.ReactElement;
        primary: string;
        onClick: () => void; // Change to onClick instead of clickFunc
    }
    
    const ListItemFunc: React.FC<ListItemFuncProps> = ({ icon, primary, onClick }) => {
        return (
            <li>
            <ListItem button component={Link} onClick={e => { onClick() }}>
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary} />
            </ListItem>
            </li>
        )
    }
    
    ListItemFunc.propTypes = {
        icon: PropTypes.element,
        primary: PropTypes.string.isRequired,
        onClick: PropTypes.func,
    };

    const Drawer = styled(MuiDrawer, {
        shouldForwardProp: (prop) => prop !== 'open'
        })(
        ({ theme, open }) => ({
            '& .MuiDrawer-paper': {
            position: 'absolute',
            whiteSpace: 'nowrap',
            backgroundColor: 'rgba(0,31,112, 0.9)',
            right: '0',
            width: appDrawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!appOpen && {
                right: '-72px',
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9),
                },
            }),
            },
        }),
    );
    return (
        <Drawer variant="permanent" anchor="right" open={appOpen}>
            <Toolbar
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: [1],
              }}
            >
              <IconButton onClick={appToggleDrawer}>
                <ChevronLeftIcon sx={{ color: '#ffffff' }} />
              </IconButton>
            </Toolbar>
            <Divider />
            <div>
              <Box sx={{ width: 360 }}>
                <List aria-label="main mailbox folders" sx={{ color: '#ffffff', borderTop: '1px solid rgba(255,255,255,0.33)' }}>
                  <ListItemLink onClick={() => appSetOpen(!appOpen)} to="/consortia" primary="Consortia" />
                  <ListItemLink onClick={() => appSetOpen(!appOpen)} to="/computations" primary="Computations" />
                  <ListItemLink onClick={() => appSetOpen(!appOpen)} to="/runs" primary="Runs" />
                  <ListItemLink onClick={() => appSetOpen(!appOpen)} to="/notifications" primary="Notifications" />
                </List>
              </Box>
              <Box sx={{ width: 360, position: 'absolute', bottom: 0 }}>
                <List aria-label="main mailbox folders" sx={{ color: '#ffffff', background: 'rgba(0,0,0,0.1)', borderTop: '1px solid rgba(255,255,255,0.33)' }}>
                  <ListItemLink onClick={() => appOnLogout()} to="/" primary="Logout" />
                  <ListItemLink onClick={() => appSetOpen(!appOpen)} to="/appConfig" primary="App Config" />
                  <ListItemLink onClick={() => appSetOpen(!appOpen)} to="/pageLogin" primary="User Config" />
                </List>
              </Box>
            </div>
          </Drawer>
)
}