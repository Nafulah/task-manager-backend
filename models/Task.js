const mongoose = require('mongoose');

// Defines what a Task looks like in MongoDB
const TaskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Link task to the user who created it
    required: true
  },
  title: {
    type: String,
    required: true // Task must have a title
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now // Auto set time when created
  }
});

module.exports = mongoose.model('task', TaskSchema);