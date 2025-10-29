import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Project, TaskItem } from '../types';
import { Navbar } from '../components/Navbar';
import { ErrorAlert } from '../components/ErrorAlert';
import {
  Container,
  Button,
  ListGroup,
  Modal,
  Form,
  Spinner,
  Card,
  Row,
  Col,
  Breadcrumb,
  Badge,
  Alert
} from 'react-bootstrap';

const ProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Modal state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskDependencies, setNewTaskDependencies] = useState<string[]>([]);

  // Scheduler state
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleResult, setScheduleResult] = useState<string[] | null>(null);

  // --- Handlers ---
  const handleCloseTaskModal = () => setShowTaskModal(false);
  const handleShowTaskModal = () => {
    setNewTaskTitle('');
    setNewTaskDueDate('');
    setNewTaskDependencies([]);
    setError('');
    setShowTaskModal(true);
  };

  const fetchProject = useCallback(async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data);
    } catch (err) {
      setError('Could not load project details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    fetchProject();
  }, [fetchProject]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsAddingTask(true);
    setError('');
    try {
      const taskCreateDto = {
        title: newTaskTitle,
        dueDate: newTaskDueDate ? newTaskDueDate : null,
        dependencyIds: newTaskDependencies,
      };
      await api.post(`/projects/${id}/tasks`, taskCreateDto);
      fetchProject();
      handleCloseTaskModal();
    } catch (err) {
      setError('Error creating task. Please try again.');
    } finally {
      setIsAddingTask(false);
    }
  };

  const handleToggleTask = async (task: TaskItem) => {
    try {
      const taskUpdateDto = {
        title: task.title,
        dueDate: task.dueDate,
        isCompleted: !task.isCompleted,
        dependencyIds: task.dependencyIds,
      };
      await api.put(`/tasks/${task.id}`, taskUpdateDto);
      fetchProject();
    } catch (err) {
      setError('Error updating task status.');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure? This will fail if other tasks depend on it.')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        fetchProject();
      } catch (err) {
        setError('Error: This task could not be deleted. It is likely a dependency for another task.');
      }
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this entire project?')) {
      try {
        await api.delete(`/projects/${id}`);
        navigate('/');
      } catch (err) {
        setError('Error deleting project.');
      }
    }
  };

  const handleRunScheduler = async () => {
    setIsScheduling(true);
    setScheduleResult(null);
    setError('');
    try {
      const response = await api.post(`/projects/${id}/schedule`);
      setScheduleResult(response.data.recommendedOrder);
    } catch (err) {
      setError('Error running scheduler.');
    } finally {
      setIsScheduling(false);
    }
  };

  const getTaskTitle = (taskId: string): string => {
    return project?.tasks.find((t) => t.id === taskId)?.title || 'Unknown Task';
  };

  // --- Main Render ---
  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="text-center mt-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Loading project...</p>
        </Container>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Navbar />
        <Container className="mt-5">
          <Alert variant="danger">Project not found.</Alert>
          <Link to="/">Go back to Dashboard</Link>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container className="mt-4">
        <ErrorAlert error={error} onClose={() => setError('')} />

        <Breadcrumb>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
            Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{project.title}</Breadcrumb.Item>
        </Breadcrumb>

        <Row className="align-items-center mb-3">
          <Col>
            <h2>{project.title}</h2>
            <p className="text-muted">{project.description || 'No description.'}</p>
          </Col>
          <Col xs="auto">
            <Button variant="outline-danger" size="sm" onClick={handleDeleteProject}>
              Delete Project
            </Button>
          </Col>
        </Row>

        <Row>
          {/* --- Tasks Column --- */}
          <Col md={8}>
            <Card className="mb-4">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <Card.Title as="h5" className="mb-0">
                  Tasks
                </Card.Title>
                <Button variant="primary" size="sm" onClick={handleShowTaskModal}>
                  + Add Task
                </Button>
              </Card.Header>
              <ListGroup variant="flush">
                {project.tasks.length > 0 ? project.tasks.map((task) => (
                  <ListGroup.Item key={task.id}>
                    <div className="d-flex w-100 justify-content-between">
                      <Form.Check
                        type="checkbox"
                        id={`task-${task.id}`}
                        label={
                          <span className={task.isCompleted ? 'text-decoration-line-through text-muted' : ''}>
                            {task.title}
                          </span>
                        }
                        checked={task.isCompleted}
                        onChange={() => handleToggleTask(task)}
                      />
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Delete
                      </Button>
                    </div>
                    {task.dueDate && (
                      <small className={`d-block mt-1 ${task.isCompleted ? 'text-muted' : 'text-danger'}`}>
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </small>
                    )}
                    {task.dependencyIds.length > 0 && (
                      <div className="mt-2">
                        <small className="text-muted">
                          Depends on: {task.dependencyIds.map((depId) => (
                            <Badge pill bg="secondary" key={depId} className="me-1">
                              {getTaskTitle(depId)}
                            </Badge>
                          ))}
                        </small>
                      </div>
                    )}
                  </ListGroup.Item>
                )) : (
                  <ListGroup.Item>No tasks yet. Add one!</ListGroup.Item>
                )}
              </ListGroup>
            </Card>
          </Col>

          {/* --- Scheduler Column --- */}
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Smart Scheduler</Card.Title>
                <Card.Text>
                  Calculate the optimal task order based on dependencies.
                </Card.Text>
                <Button
                  variant="secondary"
                  onClick={handleRunScheduler}
                  disabled={isScheduling}
                  className="w-100"
                >
                  {isScheduling ? <Spinner as="span" size="sm" animation="border" /> : 'Run Scheduler'}
                </Button>
                {scheduleResult && (
                  <div className="mt-3">
                    <h6>Recommended Order:</h6>
                    <ListGroup as="ol" numbered>
                      {scheduleResult.map((taskTitle) => (
                        <ListGroup.Item as="li" key={taskTitle}>
                          {taskTitle}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* --- Add Task Modal --- */}
      <Modal show={showTaskModal} onHide={handleCloseTaskModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateTask}>
          <Modal.Body>
            <ErrorAlert error={error} onClose={() => setError('')} />
            <Form.Group className="mb-3" controlId="taskTitle">
              <Form.Label>Task Title</Form.Label>
              <Form.Control
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="taskDueDate">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="taskDependencies">
              <Form.Label>Dependencies</Form.Label>
              <Form.Select
                multiple
                value={newTaskDependencies}
                onChange={(e) => {
                  const options = Array.from(e.target.selectedOptions);
                  const values = options.map((option) => option.value);
                  setNewTaskDependencies(values);
                }}
              >
                {project.tasks.filter(t => !t.isCompleted).map(task => (
                  <option key={task.id} value={task.id}>
                    {task.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseTaskModal}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={isAddingTask}
            >
              {isAddingTask ? 'Adding...' : 'Add Task'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ProjectDetailsPage;