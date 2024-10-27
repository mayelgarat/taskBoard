const Task = require('../models/taskModel');
const { setCache, getCache } = require('../utils/cache');
const { calculatePriority } = require('../utils/utils');


const getTasks = async (req, res, next) => {
  try {
    let tasks = getCache('allTasks');
    console.log('tasks', tasks);

    if (!tasks) {
      tasks = await Task.find();
      console.log('mongo tasks', tasks);
      setCache('allTasks', tasks);
    }

    const filter = {};
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }
    if (req.query.title) {
      filter.title = new RegExp(req.query.title, 'i');
    }

    let filteredTasks = tasks.filter((task) => {
      return Object.keys(filter).every((key) => {
        return filter[key] instanceof RegExp
          ? filter[key].test(task[key])
          : task[key] === filter[key];
      });
    });

    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order === 'desc' ? -1 : 1;
    filteredTasks = filteredTasks.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return -1 * order;
      if (a[sortBy] > b[sortBy]) return 1 * order;
      return 0;
    });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const paginatedTasks = filteredTasks.slice(skip, skip + limit);

    const totalTasks = filteredTasks.length;
    const totalPages = Math.ceil(totalTasks / limit);

    const response = {
      tasks: paginatedTasks,
      page,
      totalPages,
      totalTasks,
    };
    console.log('response', response);
    res.json(response);
  } catch (error) {
    console.error('Error fetching filtered tasks:', error);
    next(error);
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.title = title;
    task.description = description;

    task.priority = calculatePriority(task);
    console.log('Recalculated priority:', task.priority);

    const updatedTask = await task.save();

    const tasks = await Task.find();
    setCache('allTasks', tasks);

    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    next(error);
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    const taskData = {
      title,
      description,
      createdAt: new Date(),
    };

    taskData.priority = calculatePriority(taskData);
    console.log('Calculated priority:', taskData.priority);

    const newTask = new Task(taskData);
    await newTask.save();

    const tasks = await Task.find();
    setCache('allTasks', tasks);

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    next(error);
  }
};



const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error fetching task by ID:', error);
    next(error);
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const tasks = await Task.find();
    setCache('allTasks', tasks);

    res.json({ message: 'Task deleted successfully', task: deletedTask });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Failed to delete task' });
  }
};




module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
