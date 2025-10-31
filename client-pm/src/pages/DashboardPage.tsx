import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types';
import api from '../services/api';
import { Navbar } from '../components/Navbar';
import { ErrorAlert } from '../components/ErrorAlert';
import { 
  Container, 
  Button, 
  ListGroup, 
  Modal, 
  Form, 
  Spinner,
  Row,
  Col,
  Alert
} from 'react-bootstrap';

const DashboardPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  const handleClose = () => setShowModal(false);
  const handleShow = () => {
    // Clear form and show modal
    setNewProjectTitle('');
    setNewProjectDesc('');
    setError('');
    setShowModal(true);
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      setError('Could not load projects. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;

    setIsSubmitting(true);
    setError('');
    try {
      await api.post('/projects', { 
        title: newProjectTitle, 
        description: newProjectDesc 
      });
      fetchProjects(); // Refresh the list
      handleClose(); // Close the modal
    } catch (err) {
      setError('Error creating project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <Container>
        <ErrorAlert error={error} onClose={() => setError('')} />
        
        <Row className="mb-4 align-items-center">
          <Col>
            <h2>Dashboard</h2>
          </Col>
          <Col xs="auto">
            <Button variant="primary" onClick={handleShow}>
              + Create New Project
            </Button>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p>Loading projects...</p>
          </div>
        ) : (
          <ListGroup>
            {projects.length > 0 ? projects.map(project => (
              <ListGroup.Item 
                key={project.id}
                as={Link} 
                to={`/project/${project.id}`}
                action 
              >
                {project.title}
              </ListGroup.Item>
            )) : (
              <p>No projects found. Get started by creating one!</p>
            )}
          </ListGroup>
        )}
      </Container>

      {/* --- Create Project Modal --- */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Project</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateProject}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3" controlId="projectTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                required
                minLength={3}
                maxLength={100}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="projectDesc">
              <Form.Label>Description (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
                maxLength={500}
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
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default DashboardPage;