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
    <div className="mt-5">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={6}>
            <Card>
              <Card.Body>
                {showLogin ? <Login /> : <Register />}
                <div className="text-center mt-3">
                  {showLogin ? (
                    <p>
                      Don't have an account?{" "}
                      <Button variant="link" onClick={toggleForm}>
                        Register
                      </Button>
                    </p>
                  ) : (
                    <p>
                      Already have an account?{" "}
                      <Button variant="link" onClick={toggleForm}>
                        Login
                      </Button>
                    </p>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Auth;
