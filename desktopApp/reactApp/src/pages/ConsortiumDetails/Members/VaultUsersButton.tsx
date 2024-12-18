// Import necessary modules
import React from 'react';
import { Button, Modal, Box, Typography } from '@mui/material';
import VaultUserList from './VaultUserList';

// Define the style for the Box component inside the Modal
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
};

// Define the VaultUsersButton
const VaultUsersButton = () => {
  // State to control the open/close state of the Modal
  const [open, setOpen] = React.useState(false);

  // Function to open the Modal
  const handleOpen = () => setOpen(true);

  // Function to close the Modal
  const handleClose = () => setOpen(false);

  return (
    <div>
      {/* Button to open the Modal */}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Vault
      </Button>

      {/* Modal Component */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <VaultUserList onClose={handleClose}></VaultUserList>
          <Button
            onClick={handleClose}
            variant="outlined"
            color="secondary"
            sx={{ mt: 3 }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default VaultUsersButton;
