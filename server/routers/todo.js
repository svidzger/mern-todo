const express = require('express');
const router = express.Router();

// Mongoose querying logic import
const {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} = require('../controllers/todo');

// Get all todos. Route GET api/todo.
router.get('/', getAllTodos);

// Create a new todo. Route POST api/todo.
router.post('/', createTodo);

// Find and update todo by id. Route PUT todo/api/:id.
router.put('/:id', updateTodo);

// Find and delete todo by id. Route DELETE todo/api/:id.
router.delete('/:id', deleteTodo);

module.exports = router;
