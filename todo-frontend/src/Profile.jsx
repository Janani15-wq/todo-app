// src/pages/Profile.jsx
import React from 'react';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/home');
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="outline-primary" onClick={handleBackToHome}>
          ← Back to Home
        </Button>
        <Button variant="outline-danger">Logout</Button>
      </div>
      
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h3 className="mb-0">User Profile</h3>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <div className="mb-3">
                <strong>Name:</strong>
                <p className="text-muted">John Doe</p>
              </div>
              <div className="mb-3">
                <strong>Email:</strong>
                <p className="text-muted">john.doe@example.com</p>
              </div>
              <div className="mb-3">
                <strong>Member Since:</strong>
                <p className="text-muted">January 2024</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <strong>Total Tasks:</strong>
                <p className="text-muted">25</p>
              </div>
              <div className="mb-3">
                <strong>Completed Tasks:</strong>
                <p className="text-muted">18</p>
              </div>
              <div className="mb-3">
                <strong>Pending Tasks:</strong>
                <p className="text-muted">7</p>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
