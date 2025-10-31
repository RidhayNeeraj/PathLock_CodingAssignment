import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Button,
  ListGroup,
  Modal,
  Form,
  Spinner,
  Row,
  Col,
  Alert,
  Navbar,
} from 'react-bootstrap';

const API_URL = 'http://localhost:5206/api/tasks';

interface TaskItem {
  id: string;
  description: string;
  isCompleted: boolean;
}

function App() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [newTaskDesc, setNewTaskDesc] = useState('');

  const handleClose = () => setShowModal(false);
  const handleShow = () => {
    setNewTaskDesc('');
    setError('');
    setShowModal(true);
  };

  // 1. Fetch all tasks
  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (err) {
      setError('Could not load tasks. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 2. Add a new task
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskDesc.trim()) return;

    setIsSubmitting(true);
    setError('');
    try {
      const response = await axios.post(API_URL, {
        description: newTaskDesc,
      });
      setTasks([...tasks, response.data]);
      handleClose();
    } catch (err) {
      setError('Error adding task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Toggle a task
  const handleToggleTask = async (id: string) => {
    try {
      await axios.put(`${API_URL}/${id}`);
      // Update state locally for a snappy UI
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
        )
      );
    } catch (err) {
      setError('Error updating task.');
    }
  };

  // 4. Delete a task
  const handleDeleteTask = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      // Update state locally
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      setError('Error deleting task.');
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Basic Task Manager</Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="mt-4">
        {error && (
          <Alert variant="danger" onClose={() => setError('')} dismissible>
            {error}
          </Alert>
        )}

        <Row className="mb-4 align-items-center">
          <Col>
            <h2>Your Tasks</h2>
          </Col>
          <Col xs="auto">
            <Button variant="primary" onClick={handleShow}>
              + Add New Task
            </Button>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p>Loading tasks...</p>
          </div>
        ) : (
          <ListGroup>
            {tasks.length > 0 ? tasks.map((task) => (
              <ListGroup.Item key={task.id} className="d-flex align-items-center">
                <Form.Check
                  type="checkbox"
                  id={`task-${task.id}`}
                  className="me-3"
                  style={{ transform: 'scale(1.2)' }}
                  checked={task.isCompleted}
                  onChange={() => handleToggleTask(task.id)}
                />
                <span
                  className={`flex-grow-1 ${
                    task.isCompleted ? 'text-decoration-line-through text-muted' : ''
                  }`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleToggleTask(task.id)}
                >
                  {task.description}
                </span>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Delete
                </Button>
              </ListGroup.Item>
            )) : (
              <p>No tasks found. Add one to get started!</p>
            )}
          </ListGroup>
        )}
      </Container>

      {/* --- Add Task Modal --- */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddTask}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group controlId="taskDescription">
              <Form.Label>Task Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="What do you need to do?"
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Task'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default App;