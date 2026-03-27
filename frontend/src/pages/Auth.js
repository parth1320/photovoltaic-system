import { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

import Login from "./Login";
import Register from "./Register";

const Auth = () => {
  const [showLogin, setShowLogin] = useState(true);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };
  return (
    <div className="app-container">
      {showLogin ? <Login inAuth /> : <Register inAuth />}
      
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={6}>
            <div className="text-center mt-3">
              {showLogin ? (
                <p>
                  Don't have an account?{" "}
                  <Button variant="link" className="fw-bold text-decoration-none" onClick={toggleForm}>
                    Register
                  </Button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <Button variant="link" className="fw-bold text-decoration-none" onClick={toggleForm}>
                    Login
                  </Button>
                </p>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Auth;
