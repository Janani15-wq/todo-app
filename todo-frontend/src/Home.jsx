const user = JSON.parse(localStorage.getItem("user")) || {
  name: "Guest",
  role: "User",
  email: "guest@example.com"
};
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL + '/tasks';

const Home = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');

  // Fetch tasks from backend
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API);
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleLogout = () => {
    // You may want to clear auth tokens here if you use them
    window.location.reload(); // Ensures redirect to login
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim() || !newDate || !newTime) return;
    const dueAt = new Date(`${newDate}T${newTime}`);
    try {
      await axios.post(API, {
        title: newTask,
        completed: false,
        dueAt,
      });
      setNewTask('');
      setNewDate('');
      setNewTime('');
      fetchTasks();
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      await axios.put(`${API}/${id}`, { completed: !completed });
      fetchTasks();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleEditTask = (id, currentTitle) => {
    setEditId(id);
    setEditValue(currentTitle);
  };

  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleEditSave = async (id) => {
    if (!editValue.trim()) return;
    try {
      await axios.put(`${API}/${id}`, { title: editValue });
      setEditId(null);
      setEditValue('');
      fetchTasks();
    } catch (err) {
      console.error('Error editing task:', err);
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditValue('');
  };

  // Filtering
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  // Sorting
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sort === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sort === 'az') {
      return a.title.localeCompare(b.title);
    } else if (sort === 'za') {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  if (loading) return <Container className="text-center">Loading...</Container>;

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button variant="outline-primary" onClick={handleProfileClick}>Profile</Button>
        <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
      </div>
      <h2 className="mb-4 text-center">My Tasks</h2>
      <form onSubmit={handleAddTask} className="mb-3 d-flex gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Add a new task..."
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
        />
        <input
          type="date"
          className="form-control"
          value={newDate}
          onChange={e => setNewDate(e.target.value)}
          required
        />
        <input
          type="time"
          className="form-control"
          value={newTime}
          onChange={e => setNewTime(e.target.value)}
          required
        />
        <Button type="submit" variant="primary">Add</Button>
      </form>
      <div className="d-flex mb-3 gap-2 flex-wrap">
        <Form.Select value={filter} onChange={e => setFilter(e.target.value)} style={{ maxWidth: 180 }}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </Form.Select>
        <Form.Select value={sort} onChange={e => setSort(e.target.value)} style={{ maxWidth: 180 }}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="az">A-Z</option>
          <option value="za">Z-A</option>
        </Form.Select>
      </div>
      <ul className="list-group">
        {sortedTasks.length === 0 && <li className="list-group-item">No tasks found!</li>}
        {sortedTasks.map(task => {
          let isExpired = false;
          if (task.dueAt && !task.completed) {
            const due = new Date(task.dueAt);
            isExpired = due < new Date();
          }
          return (
            <li
              key={task._id || task.id}
              className={`list-group-item d-flex justify-content-between align-items-center ${task.completed ? 'list-group-item-success' : ''} ${isExpired ? 'list-group-item-danger' : ''}`}
            >
              <div className="d-flex align-items-center flex-grow-1">
                {editId === (task._id || task.id) ? (
                  <>
                    <input
                      type="text"
                      className="form-control me-2"
                      value={editValue}
                      onChange={handleEditChange}
                      autoFocus
                      style={{ maxWidth: 250 }}
                    />
                    <Button size="sm" variant="success" className="me-1" onClick={() => handleEditSave(task._id || task.id)}>
                      Save
                    </Button>
                    <Button size="sm" variant="secondary" onClick={handleEditCancel}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</span>
                    {task.dueAt && (
                      <span className="ms-3 text-muted small">
                        Due: {new Date(task.dueAt).toLocaleDateString()} {new Date(task.dueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                    <Button size="sm" variant="outline-primary" className="ms-3" onClick={() => handleEditTask(task._id || task.id, task.title)}>
                      Edit
                    </Button>
                  </>
                )}
              </div>
              <div>
                <Button size="sm" variant={task.completed ? 'success' : 'outline-success'} className="me-2" onClick={() => handleToggleComplete(task._id || task.id, task.completed)}>
                  {task.completed ? 'Completed' : 'Mark Complete'}
                </Button>
                <Button size="sm" variant="outline-danger" onClick={() => handleDeleteTask(task._id || task.id)}>
                  Delete
                </Button>
              </div>
            </li> 
          );
        })}
      </ul>
    </Container>
  );
};

export default Home; 