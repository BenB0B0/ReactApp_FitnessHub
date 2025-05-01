import { useAuth } from "../context/AuthContext";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

function NavBar() {
  // **** CONTEXTS ****
  const { isAuthenticated, login, handleLogout, user } = useAuth();

  // **** RETURN LOGIC ****
  return (
    <Navbar data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
      <Container>

        {/* HEADER */}
        <Navbar.Brand href="/">Home</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">

          {/* NAV LINKS */}
          {isAuthenticated &&
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/workouts">Workouts</Nav.Link>
              <Nav.Link as={Link} to="/routines">Routines</Nav.Link>
              <Nav.Link as={Link} to="/calendar">Calendar</Nav.Link>
              <Nav.Link as={Link} to="/ai-planner">AI Planner</Nav.Link>
              <Nav.Link as={Link} to="/stats">Stats</Nav.Link>
            </Nav>
          }

          {/* DROPDOWN ACCOUNT SETTINGS */}
          <Nav className="ms-auto">
            {isAuthenticated ? (
              <>
                <NavDropdown align="end" title={`${user?.name}`} id="basic-nav-dropdown">
                  <NavDropdown.Item onClick={() => handleLogout()}>Logout</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4" disabled>Settings</NavDropdown.Item>
                </NavDropdown>
              </>) : (
              <>
                <Button variant="warning" onClick={() => login()}>Sign up or Login!</Button>
              </>)}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
