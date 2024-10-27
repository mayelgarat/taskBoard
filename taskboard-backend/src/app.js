require('dotenv').config();
const express = require('express');
const taskRoutes = require('./routes/taskRoutes.js');

const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const { errorHandler } = require('./middleware/errorMiddleware.js');


const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/api/tasks', taskRoutes);

app.use(errorHandler);



mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
