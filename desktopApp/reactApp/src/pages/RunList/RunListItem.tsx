import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RunListItem as GeneratedRunListItem } from '../../apis/centralApi/generated/graphql'; // Import the generated RunListItem type

interface RunListItemProps {
  run: GeneratedRunListItem; // Use the generated type instead of defining a new one
}

export const RunListItem: React.FC<RunListItemProps> = ({ run }) => {
  const navigate = useNavigate(); // Initialize navigation

  const handleViewDetails = () => {
    navigate(`/run/details/${run.runId}`); // Navigate to the run details page
  };

  return (
    <Card variant="outlined" sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {run.consortiumTitle}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Status: {run.status}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Created At: {new Date(+run.createdAt).toLocaleString()}
        </Typography>
      </CardContent>
      <CardActions>
        <Box ml="auto"> {/* This will push the button to the right */}
          <Button variant="contained" color="primary" onClick={handleViewDetails}>
            View Details
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};
