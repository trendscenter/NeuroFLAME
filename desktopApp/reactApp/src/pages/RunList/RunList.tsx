import React from 'react';
import { useRunList } from './useRunList'; // Import the custom hook for fetching run list
import { CircularProgress, List, Typography, Box, Alert, Button } from '@mui/material';
import { RunListItem } from './RunListItem'; // Import the new RunListItem component

export function RunList() {
  const { runList, loading, error, fetchRunList } = useRunList(); // Use the hook to fetch run data

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Run List
      </Typography>

      {/* Button to refetch the run list */}
      <Button variant="contained" color="primary" onClick={fetchRunList} sx={{ mb: 2 }}>
        Refetch Run List
      </Button>

      {/* Loading State */}
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="20vh">
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Box mt={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {/* Run List Display */}
      {runList && runList.length > 0 ? (
        <List>
          {runList.map((run) => (
            <RunListItem key={run.runId} run={run} />
          ))}
        </List>
      ) : (
        !loading && (
          <Typography variant="body1" color="textSecondary">
            No runs available.
          </Typography>
        )
      )}
    </Box>
  );
}
