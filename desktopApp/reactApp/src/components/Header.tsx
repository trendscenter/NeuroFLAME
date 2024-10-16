import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import NavDrawer from './NavDrawer';
<<<<<<< HEAD

const Header: React.FC = () => {
=======
import UserAvatar from './UserAvatar';
import logoSM from '../assets/coinstac-logo-sm.png';

interface HeaderProps {
  appUsername: string;
}

const Header: React.FC<HeaderProps> = ({appUsername}) => {
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  return (
    <>
      <AppBar position="sticky">
<<<<<<< HEAD
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">My App</Typography>
        </Toolbar>
      </AppBar>
      <NavDrawer open={drawerOpen} onClose={() => toggleDrawer(false)} />
=======
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
              aria-label="menu"
              onClick={() => toggleDrawer(true)}
            >
            <MenuIcon />
            </IconButton>
        </Toolbar>                              
      </AppBar>
      <NavDrawer open={drawerOpen} onClose={() => toggleDrawer(false)} navSetDrawerOpen={setDrawerOpen} />
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)
    </>
  );
};

export default Header;
