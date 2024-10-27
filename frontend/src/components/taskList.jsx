import React from 'react';
import { List, ListItem, ListItemText, Typography, Button, Box } from '@mui/material';

const TaskList = ({ tasks, onEditTask, onDeleteTask, onTaskClick }) => {
  return (
    <Box>
      {tasks?.length > 0 ? (
        <List>
          {tasks.map((task) => (
            <ListItem
              key={task._id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #ccc',
                paddingY: 1,
                cursor: 'pointer', 
              }}
              onClick={() => onTaskClick(task._id)}
            >
              <ListItemText
                primary={task.title}
                secondary={`Priority: ${task.priority}`}
              />
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditTask(task);
                  }}
                  sx={{ color: 'white', border: 'none' }}
                  className='btn-submit'
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTask(task._id);
                  }}
                >
                  Delete
                </Button>
              </Box>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1" textAlign="center">
          No tasks found.
        </Typography>
      )}
    </Box>
  );
};

export default TaskList;
