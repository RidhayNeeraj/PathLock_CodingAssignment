import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios'; 

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/register', { email, password });
      navigate('/login');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data === 'Email already exists.') {
          setError('This email is already in use.');
      } else {
          setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ maxWidth: '400px', marginTop: '5rem' }}>
      <Card className="p-4 shadow-sm">
        <Card.Body>
          <h2 className="text-center mb-4">Register</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button 
              variant="primary" 
              type="submit" 
              className="w-100"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </Form>
          <p className="mt-3 text-center">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RegisterPage;