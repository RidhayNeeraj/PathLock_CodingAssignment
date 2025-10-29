import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navbar as BsNavbar, Nav, Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'; // We need this!

// You need to install one more small helper package for this
// Run: npm install react-router-bootstrap

export const Navbar = () => {
  const { email, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BsNavbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        {/* LinkContainer makes react-bootstrap work with react-router */}
        <LinkContainer to="/">
          <BsNavbar.Brand>Project Manager</BsNavbar.Brand>
        </LinkContainer>
        <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {email ? (
              <>
                <Nav.Item className="d-flex align-items-center me-3">
                  <BsNavbar.Text>Signed in as: {email}</BsNavbar.Text>
                </Nav.Item>
                <Button variant="outline-light" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};