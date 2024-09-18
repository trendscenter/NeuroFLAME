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
        <ListItem component={Link} to="/consortium">
          <ListItemText primary="Consortium" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default NavDrawer;