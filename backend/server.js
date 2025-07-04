// ---------- server.js ----------
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Task = require('./models/Task');
const passport = require('passport');
require('./auth'); // This loads your Google OAuth setup
const session = require('express-session');

const app  = express();
const PORT = 3000;

// 1️⃣ MongoDB connection
mongoose
  .connect(
    'mongodb+srv://todouser:todo1234@cluster0.5mul5sm.mongodb.net/tododb?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// 2️⃣ Middleware
app.use(cors());
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// 3️⃣ Google OAuth Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: req.user._id, email: req.user.email }, process.env.JWT_SECRET);
    res.redirect(`http://localhost:5173/login?token=${token}`);
  }
);

app.get('/test', (req, res) => res.send('Test route works!'));

// 4️⃣ Task API Routes
// Create
app.post('/tasks', async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ message: 'Error creating task', error: err.message });
  }
});

// Read all with filtering, sorting, and pagination
app.get('/tasks', async (req, res) => {
  try {
    const { status, sort = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'asc' ? 1 : -1;

    const tasks = await Task.find(query)
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Error fetching tasks', error: err.message });
  }
});

// Update
app.put('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ message: 'Error updating task', error: err.message });
  }
});

// Delete
app.delete('/tasks/:id', async (req, res) => {
  try {
    const result = await Task.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ message: 'Error deleting task', error: err.message });
  }
});

// Root health‑check
app.get('/', (_, res) => res.json({ 
  message: 'Todo API is live with MongoDB!',
  status: 'running',
  timestamp: new Date().toISOString()
}));

// 5️⃣ Start server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
