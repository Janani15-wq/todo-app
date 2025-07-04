import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from './firebase';
import { signInWithPopup } from 'firebase/auth';
import { Container, Card, Button, Form } from 'react-bootstrap';

const Login = ({ user }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/home');
    } catch (error) {
      alert('Google sign-in failed.');
    }
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    setLoginError('Email/password login is not available. Please use Google sign-in.');
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Card className="p-4 shadow-lg w-100" style={{ maxWidth: 400 }}>
        <div className="d-flex flex-column align-items-center mb-4">
          <h1 className="mb-1 fw-bold text-primary">TaskFlow</h1>
          <p className="text-muted text-center mb-2" style={{ fontSize: '1.1rem' }}>
            Organize your tasks, collaborate, and boost your productivity.<br />
            Sign in to get started!
          </p>
        </div>
        {user && (
          <div className="mb-3 text-center">
            <div className="text-success mb-2">You are already signed in.</div>
            <Button variant="primary" onClick={() => navigate('/home')} className="w-100 mb-2">Go to Home</Button>
          </div>
        )}
        <Form onSubmit={handleEmailLogin} className="mb-3">
          <Form.Group className="mb-2" controlId="loginEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="username"
              disabled
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="loginPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100 mb-2" disabled>
            Log In
          </Button>
          {loginError && <div className="text-danger small text-center">{loginError}</div>}
        </Form>
        <div className="mb-3">
          <Button
            variant="outline-primary"
            className="w-100 d-flex align-items-center justify-content-center gap-2 py-2"
            onClick={handleGoogleSignIn}
          >
            <svg className="me-2" width="22" height="22" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.2 3.23l6.86-6.86C36.68 2.7 30.7 0 24 0 14.82 0 6.73 5.82 2.69 14.09l7.98 6.2C12.13 13.36 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.13 46.1 31.3 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.29a14.5 14.5 0 010-8.58l-7.98-6.2A23.97 23.97 0 000 24c0 3.77.9 7.34 2.69 10.49l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.48 0 11.93-2.15 15.9-5.85l-7.19-5.6c-2.01 1.35-4.6 2.15-8.71 2.15-6.38 0-11.87-3.86-13.33-9.29l-7.98 6.2C6.73 42.18 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
            Sign in with Google
          </Button>
        </div>
        <div className="text-center text-muted small mt-2">
          <span>Only Google sign-in is supported.</span>
        </div>
        <div className="text-center mt-3">
          <span className="text-secondary">Don't have an account? </span>
          <span className="fw-semibold text-primary text-decoration-none" tabIndex={-1} style={{ cursor: 'not-allowed', pointerEvents: 'none' }}>
            Sign up
          </span>
        </div>
      </Card>
    </Container>
  );
};

export default Login; 