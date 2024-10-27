import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
const TASK_API_BASE_URL = `${API_BASE_URL}/api/tasks`;

export const fetchTasks = async ({ priority, title, sortBy, order, page, limit }) => {
  try {
    const response = await axios.get(TASK_API_BASE_URL, {
      params: { priority, title, sortBy, order, page, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};


export const createTask = async (taskData) => {
  try {
    const response = await axios.post(TASK_API_BASE_URL, taskData);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (id, taskData) => {
  try {
    const response = await axios.put(`${TASK_API_BASE_URL}/${id}`, taskData);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (id) => {
  try {
    const response = await axios.delete(`${TASK_API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const fetchTaskById = async (taskId) => {
  try {
    const response = await axios.get(`${TASK_API_BASE_URL}/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching task by ID:', error);
    throw error;
  }
};
