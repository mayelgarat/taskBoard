import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setFilter } from './redux/taskSlice';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTasks, createTask, updateTask, deleteTask, fetchTaskById } from './api/taskApi';
import { Typography, CircularProgress, Snackbar, Button, Box } from '@mui/material';

import './styles/styles.scss';
import TaskDetailView from './components/taskDetailView';
import TaskFilters from './components/taskFilters';
import TaskForm from './components/taskForm';
import Header from './components/header';
import PaginationControls from './components/PaginationControls';
import TaskList from './components/taskList';

const App = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [currentTask, setCurrentTask] = useState(null);
  const [previousTask, setPreviousTask] = useState(null);
  const [filters, setFilters] = useState({ priority: '', title: '' });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [undoType, setUndoType] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);


  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem('filters'));
    const savedPage = JSON.parse(localStorage.getItem('page'));
    const savedLimit = JSON.parse(localStorage.getItem('limit'));

    if (savedFilters) setFilters(savedFilters);
    if (savedPage) setPage(savedPage);
    if (savedLimit) setLimit(savedLimit);
  }, []);

  const { data, status } = useQuery({
    queryKey: ['tasks', filters, page, limit],
    queryFn: () => fetchTasks({
      priority: filters.priority,
      title: filters.title,
      sortBy: filters.sortBy,
      order: filters.order,
      page,
      limit,
    }),
    keepPreviousData: true,
  });


  const mutation = useMutation({
    mutationFn: async ({ task, isUpdate }) => {
      if (isUpdate) {
        return updateTask(task._id, task);
      } else {
        return createTask(task);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    dispatch(setFilter({ [name]: value }));
    setPage(1);
    localStorage.setItem('filters', JSON.stringify({ ...filters, [name]: value }));
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    localStorage.setItem('page', JSON.stringify(newPage));
  };

  const handleLimitChange = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    setLimit(newLimit);
    setPage(1);
    localStorage.setItem('limit', JSON.stringify(newLimit));
  };

  const handleTaskSubmit = useCallback((task) => {
    if (task._id) {
      const previousTaskState = data?.tasks.find((t) => t._id === task._id);
      setPreviousTask(previousTaskState);
      setUndoType('edit');
      setSnackbarMessage('Task updated');
    } else {
      setSnackbarMessage('Task created');
    }
    mutation.mutate({ task, isUpdate: !!task._id });
    setCurrentTask(null);
    setSnackbarOpen(true);
  }, [data?.tasks, mutation]);

  const handleEditTask = (task) => {
    setCurrentTask(task);
  };

  const clearCurrentTask = () => {
    setCurrentTask(null);
  };

  const clearSelectedTask = useCallback(() => {
    setSelectedTask(null);
  }, []);

  const handleDeleteTask = useCallback((taskId) => {
    const taskToDelete = data?.tasks.find((task) => task._id === taskId);
    setPreviousTask(taskToDelete);
    setUndoType('delete');
    setSnackbarMessage('Task deleted');
    deleteMutation.mutate(taskId);
    setSnackbarOpen(true);
  }, [data?.tasks, deleteMutation]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setPreviousTask(null);
    setUndoType(null);
  };

  const handleUndo = useCallback(() => {
    if (undoType === 'delete' && previousTask) {
      mutation.mutate(
        { task: previousTask, isUpdate: false },
        {
          onSuccess: () => {
            handleSnackbarClose();
          },
        }
      );
    } else if (undoType === 'edit' && previousTask) {
      mutation.mutate(
        { task: previousTask, isUpdate: true },
        {
          onSuccess: () => {
            handleSnackbarClose();
          },
        }
      );
    }
  }, [undoType, previousTask, mutation, handleSnackbarClose]);

  const handleTaskClick = useCallback(async (taskId) => {
    try {
      const task = await fetchTaskById(taskId);
      setSelectedTask(task);
    } catch (error) {
      console.error('Error fetching task details:', error);
    }
  }, [setSelectedTask]);


  return (
    <div className="App">
      <Header />
      <div className='main'>
        <div className='form'>
          <TaskForm
            onTaskSubmit={handleTaskSubmit}
            currentTask={currentTask}
            clearCurrentTask={clearCurrentTask}
          />
          <TaskFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>
        {selectedTask && (
          <Box mt={4}>
            <TaskDetailView task={selectedTask} />
            <Button onClick={clearSelectedTask} sx={{ mt: 2 }} variant="outlined">
              Close Details
            </Button>
          </Box>
        )}

        {status === 'loading' ? (
          <CircularProgress />
        ) : status === 'error' ? (
          <Typography variant="body1">Error loading tasks</Typography>
        ) : (
          data?.tasks.length > 0 ? (
            <TaskList tasks={data.tasks} onEditTask={handleEditTask} onDeleteTask={handleDeleteTask} onTaskClick={handleTaskClick} task={selectedTask} />
          ) : (
            <Typography variant="body1">No tasks match your criteria.</Typography>
          )
        )}

        <PaginationControls
          page={page}
          totalPages={data?.totalPages || 1}
          onPageChange={handlePageChange}
          limit={limit}
          onLimitChange={handleLimitChange}
        />


        <Snackbar
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          action={
            undoType === 'delete' || undoType === 'edit' ? (
              <Button color="secondary" size="small" onClick={handleUndo}>
                UNDO
              </Button>
            ) : null
          }
        />
      </div>
    </div>
  );
};

export default App;
