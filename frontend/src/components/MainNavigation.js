import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const MainNavigation = () => {
  return (
    <Navbar bg="light" expand="lg" className="navbar-modern sticky-top" variant="light">
      <div className="container">
        <Navbar.Brand href="/dashboard">
          <span className="text-primary fw-bold" style={{ fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
            ☀️ SolarSys
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/dashboard" className="fw-medium px-3">Dashboard</Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown
              title={
                <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle shadow-sm" style={{ width: '40px', height: '40px' }}>
                  <FontAwesomeIcon icon={faUser} />
                </div>
              }
              id="basic-nav-dropdown"
              align="end"
              className="border-0"
            >
              <NavDropdown.Item href="/dashboard/profile" className="fw-medium py-2">
                User Profile
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/logout" className="text-danger fw-bold py-2">
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default MainNavigation;
