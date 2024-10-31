import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

interface NavDrawerProps {
  open: boolean;
  onClose: () => void;
}

const NavDrawer: React.FC<NavDrawerProps> = ({ open, onClose }) => {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <List>
        <ListItem component={Link} to="/">
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem component={Link} to="/consortiumList">
          <ListItemText primary="Consortium List" />
        </ListItem>
        <ListItem component={Link} to="/runList">
          <ListItemText primary="Run List" />
        </ListItem>
        <ListItem component={Link} to="/appConfig">
          <ListItemText primary="App Config" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default NavDrawer;