import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, Button, Box, FormControl, InputLabel } from '@mui/material';

import '../styles/styles.scss';

const TaskForm = ({ onTaskSubmit, currentTask, clearCurrentTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('low');

  useEffect(() => {
    if (currentTask) {
      setTitle(currentTask.title);
      setDescription(currentTask.description);
      setPriority(currentTask.priority);
    } else {
      setTitle('');
      setDescription('');
      setPriority('low');
    }
  }, [currentTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      onTaskSubmit({ title, description, priority, _id: currentTask ? currentTask._id : undefined });
      setTitle('');
      setDescription('');
      setPriority('low');
      clearCurrentTask();
    } else {
      alert('Please enter a title, description, and priority.');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        padding:2,
        gap: 3,
        margin: '0 auto',
      }}
    >
      <TextField
        label="Task Title"
        variant="outlined"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        fullWidth
      />
      <TextField
        label="Task Description"
        variant="outlined"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        fullWidth
      />
      <FormControl fullWidth variant="outlined">
        <InputLabel>Priority</InputLabel>
        <Select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          label="Priority"
          fullWidth
        >
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </Select>
      </FormControl>
      <Button fullWidth className='btn-submit' variant="contained" type="submit">
        {currentTask ? 'Update Task' : 'Add Task'}
      </Button>
      {currentTask && (
        <Button className='btn-submit' variant="outlined" onClick={clearCurrentTask} sx={{  color: 'white',
          border: 'none', padding: '0 45px'}}>
          Cancel
        </Button>
      )}
    </Box>
  );
};

export default TaskForm;
