import React from 'react';
import { Box, Typography, LinearProgress, Chip } from '@mui/material';

const TaskDetailView = ({ task }) => {
  
  const getPriorityLabel = (priority) => {
    if (priority > 0.7) return { label: 'High', color: 'error', progress: 100 };
    if (priority > 0.4) return { label: 'Medium', color: 'warning', progress: 60 };
    return { label: 'Low', color: 'success', progress: 30 };
  };

  const { label, color, progress } = getPriorityLabel(task?.priority);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>{task.title}</Typography>
      <Typography variant="body1" paragraph>{task.description}</Typography>
      <Typography variant="body2" color="textSecondary">
        Created At: {new Date(task.createdAt).toLocaleString()}
      </Typography>

      <Box mt={2}>
        <Chip
          label={`Priority: ${label}`}
          color={color}
          sx={{ mb: 1 }}
          aria-label={`Task priority level: ${label}`}
        />
        <LinearProgress
          variant="determinate"
          value={progress}
          aria-label="Task priority level"
          sx={{
            height: 10,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: color === 'error' ? '#d32f2f' : color === 'warning' ? '#ff9800' : '#388e3c',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default TaskDetailView;
