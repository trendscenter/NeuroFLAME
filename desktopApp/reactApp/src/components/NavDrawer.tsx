import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

interface NavDrawerProps {
  open: boolean;
  onClose: () => void;
<<<<<<< HEAD
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
=======
  navSetDrawerOpen: (...args: any[]) => any;
}

const NavDrawer: React.FC<NavDrawerProps> = ({ open, onClose, navSetDrawerOpen }) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <List>
        <ListItem onClick={()=>{navSetDrawerOpen(false)}} component={Link} to="/">
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem onClick={()=>{navSetDrawerOpen(false)}} component={Link} to="/consortiumList">
          <ListItemText primary="Consortium List" />
        </ListItem>
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)
      </List>
    </Drawer>
  );
};

export default NavDrawer;