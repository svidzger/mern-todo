const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema for todo
const TodoSchema = new Schema({
  title: {
    type: 'String',
    required: true,
  },
  date: {
    type: Date,
  },
  description: {
    type: 'String',
  },
});

const Todo = mongoose.model('todo', TodoSchema);

module.exports = Todo;
