import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTasks } from '../api/taskApi';

export const loadTasks = createAsyncThunk('tasks/loadTasks', async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState().tasks;
    const params = {
      ...state.filters,
      page: state.page,
      limit: state.limit,
    };
    const data = await fetchTasks(params);
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    totalPages: 1,
    totalTasks: 0,
    page: 1,
    limit: 10,
    filters: {
      title: '',
      priority: '',
      sortBy: 'createdAt',
      order: 'asc',
    },
    status: 'idle',
    error: null,
  },
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex((task) => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload.tasks;
        state.totalPages = action.payload.totalPages;
        state.totalTasks = action.payload.totalTasks;
      })
      .addCase(loadTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setFilter, setPage, setLimit, addTask, updateTask, deleteTask } = taskSlice.actions;

export default taskSlice.reducer;
