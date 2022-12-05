require('dotenv').config({ path: './config/.env' });
const connectMongo = require('./config/conn.js');
const cors = require('cors');
const express = require('express');
const app = express();

// Todo routes
const todo = require('./routers/todo');

// Connection to Mongo database
connectMongo();

// Cors
app.use(cors({ origin: true, credentials: true }));

app.use(express.json({ extended: false }));
app.get('/', (req, res) => {
  res.send('Server is running...');
});

app.use('/api/todo', todo);

const port = process.env.port || 8000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
