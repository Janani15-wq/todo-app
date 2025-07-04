// ✅ Todo App Frontend – Final Version
// Includes: Tailwind CSS + Toasts + Filters + Clean UI + Responsive Layout

import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { db } from './firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { Container, Navbar, Nav, Button, Form, Row, Col, ListGroup, InputGroup } from 'react-bootstrap';
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Trash2, PlusCircle, Loader, Filter, Circle, CheckCircle2 } from "lucide-react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login.jsx';
import Home from './Home.jsx';
import Profile from './Profile.jsx';

function Dashboard({ user, handleLogout }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'tasks'),
      where('owner', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksArr = [];
      querySnapshot.forEach((doc) => {
        tasksArr.push({ id: doc.id, ...doc.data() });
      });
      setTasks(tasksArr);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim() || !newDate || !newTime) return;
    // Combine date and time into a JS Date object
    const dueAt = new Date(`${newDate}T${newTime}`);
    await addDoc(collection(db, 'tasks'), {
      title: newTask,
      completed: false,
      owner: user.uid,
      createdAt: serverTimestamp(),
      dueAt: dueAt,
      sharedWith: [],
    });
    setNewTask('');
    setNewDate('');
    setNewTime('');
  };

  const handleToggleComplete = async (id, completed) => {
    const taskRef = doc(db, 'tasks', id);
    await updateDoc(taskRef, { completed: !completed });
  };

  const handleDeleteTask = async (id) => {
    const taskRef = doc(db, 'tasks', id);
    await deleteDoc(taskRef);
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
    const taskRef = doc(db, 'tasks', id);
    await updateDoc(taskRef, { title: editValue });
    setEditId(null);
    setEditValue('');
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
      return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
    } else if (sort === 'oldest') {
      return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0);
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
          // Expired logic: dueAt in the past and not completed
          let isExpired = false;
          if (task.dueAt && !task.completed) {
            const due = task.dueAt.seconds ? new Date(task.dueAt.seconds * 1000) : new Date(task.dueAt);
            isExpired = due < new Date();
          }
          return (
            <li
              key={task.id}
              className={`list-group-item d-flex justify-content-between align-items-center ${task.completed ? 'list-group-item-success' : ''} ${isExpired ? 'list-group-item-danger' : ''}`}
            >
              <div className="d-flex align-items-center flex-grow-1">
                {editId === task.id ? (
                  <>
                    <input
                      type="text"
                      className="form-control me-2"
                      value={editValue}
                      onChange={handleEditChange}
                      autoFocus
                      style={{ maxWidth: 250 }}
                    />
                    <Button size="sm" variant="success" className="me-1" onClick={() => handleEditSave(task.id)}>
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
                        Due: {task.dueAt.seconds ? new Date(task.dueAt.seconds * 1000).toLocaleDateString() : new Date(task.dueAt).toLocaleDateString()} {task.dueAt.seconds ? new Date(task.dueAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(task.dueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                    <Button size="sm" variant="outline-primary" className="ms-3" onClick={() => handleEditTask(task.id, task.title)}>
                      Edit
                    </Button>
                  </>
                )}
              </div>
              <div>
                <Button
                  size="sm"
                  variant={task.completed ? 'secondary' : 'success'}
                  className="me-2"
                  onClick={() => handleToggleComplete(task.id, task.completed)}
                >
                  {task.completed ? 'Undo' : 'Done'}
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Delete
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </Container>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  if (!authChecked) return null;

  return (
    <Routes>
      {/* Login page is always at '/' */}
      <Route path="/" element={<Login user={user} />} />
      {/* Home (task manager) is protected */}
      <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
      {/* Profile page is protected */}
      <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
      {/* Catch-all: redirect to '/' */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
