import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const ConsortiumPage: React.FC = () => {
  const content = [
    {
      title: "Consortium Members",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
    },
    {
      title: "Data directory",
      description: "Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.",
    },
    {
      title: "Consortium Leader Notes",
      description: "Maecenas faucibus mollis interdum. Aenean lacinia bibendum nulla sed consectetur. Cras mattis consectetur purus sit amet fermentum.",
    },
    {
      title: "parameters.json",
      description: "Donec sed odio dui. Curabitur blandit tempus porttitor. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh.",
    },
    {
      title: "Computation Notes",
      description: "Etiam porta sem malesuada magna mollis euismod. Nulla vitae elit libero, a pharetra augue.",
    },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Consortium
      </Typography>
      <Box 
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"
        gap={2}
        sx={{ width: '100%', margin: '0 auto' }}
      >
        {content.map((item, index) => (
          <Paper key={index} style={{ padding: 20 }}>
            <Typography variant="h6" gutterBottom>{item.title}</Typography>
            <Typography variant="body1">{item.description}</Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default ConsortiumPage;
