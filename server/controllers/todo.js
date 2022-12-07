// Todo mongoose model
const Todo = require('../models/todo');

// Show all todos
exports.getAllTodos = (req, res) => {
  Todo.find()
    .then((todo) => {
      res.json(todo);
    })
    .catch((err) =>
      res.status(404).json({ message: 'Todos not found', error: err.message })
    );
};

// Create a new todo
exports.createTodo = (req, res) => {
  Todo.create(req.body)
    .then((todo) => {
      res.json({ message: 'Todo added successfully!', todo });
    })
    .catch((err) =>
      res.status(400).json({
        message: 'Unable to add new todo!',
        error: err.message,
      })
    );
};

// Update existing todo
exports.updateTodo = (req, res) => {
  Todo.findByIdAndUpdate(req.params.id, req.body)
    .then((todo) => {
      return res.json({ message: 'Todo updated successfully!', todo });
    })
    .catch((err) =>
      res
        .status(400)
        .json({ error: 'Unable to update todo!', message: err.message })
    );
};

// Delete todo
exports.deleteTodo = (req, res) => {
  Todo.findByIdAndRemove(req.params.id, req.body)
    .then((todo) => {
      return res.json({ message: 'Todo deleted successfully!', todo });
    })
    .catch((err) =>
      res
        .status(404)
        .json({ error: 'Failed to delete todo!', message: err.message })
    );
};
