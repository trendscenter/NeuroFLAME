import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import { useUserState } from '../contexts/UserStateContext';

interface NavDrawerProps {
  open: boolean;
  onClose: () => void;
  navSetDrawerOpen: (...args: any[]) => any;
}

const NavDrawer: React.FC<NavDrawerProps> = ({ open, onClose, navSetDrawerOpen }) => {
  const { roles } = useUserState();

  const isAdmin = roles.includes('admin');

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <List>
        <ListItem onClick={() => { navSetDrawerOpen(false) }} component={Link} to="/">
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem onClick={() => { navSetDrawerOpen(false) }} component={Link} to="/consortiumList">
          <ListItemText primary="Consortium List" />
        </ListItem>
        <ListItem onClick={() => { navSetDrawerOpen(false) }} component={Link} to="/runList">
          <ListItemText primary="Run List" />
        </ListItem>
        <ListItem onClick={() => { navSetDrawerOpen(false) }} component={Link} to="/computationList">
          <ListItemText primary="Computation List" />
        </ListItem>
        {
          isAdmin && (
            <ListItem onClick={() => { navSetDrawerOpen(false) }} component={Link} to="/admin">
              <ListItemText primary="Admin" />
            </ListItem>
          )
        }
      </List>
    </Drawer>
  );
};

export default NavDrawer;