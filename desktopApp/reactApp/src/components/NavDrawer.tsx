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
        <ListItem onClick={() => { navSetDrawerOpen(false) }} component={Link} to="/home">
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem onClick={() => { navSetDrawerOpen(false) }} component={Link} to="/consortium/list">
          <ListItemText primary="Consortium List" />
        </ListItem>
        <ListItem onClick={() => { navSetDrawerOpen(false) }} component={Link} to="/run/list">
          <ListItemText primary="Run List" />
        </ListItem>
        <ListItem onClick={() => { navSetDrawerOpen(false) }} component={Link} to="/computation/list">
          <ListItemText primary="Computation List" />
        </ListItem>
        {
          isAdmin && (
            <ListItem onClick={() => { navSetDrawerOpen(false) }} component={Link} to="/admin">
              <ListItemText primary="Admin" />
            </ListItem>
          )
        }
        <ListItem onClick={() => { navSetDrawerOpen(false) }} component={Link} to="/consortium/wizard/66289c79aecab67040a22002">
          <ListItemText primary="consortium wizard test" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default NavDrawer;