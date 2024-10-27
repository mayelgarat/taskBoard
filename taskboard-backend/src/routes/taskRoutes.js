const express = require('express');
const router = express.Router();
const { cacheMiddleware } = require('../utils/cache');

const taskController = require('../controllers/taskController');
const { validateTask } = require('../middleware/validationMiddleware');


router.post('/', validateTask, taskController.createTask);
router.get('/', cacheMiddleware('tasks'), taskController.getTasks);
router.put('/:id', taskController.updateTask);

router.get('/:id', cacheMiddleware('task_'), taskController.getTaskById);
router.delete('/:id', taskController.deleteTask);


module.exports = router;
