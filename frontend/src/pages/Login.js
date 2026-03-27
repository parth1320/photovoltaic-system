import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import { Form, Button, Row, Col, Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

const Login = ({ inAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard");
      toast.success("Logged In Successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Login Failed. Try Again");
    }
  };

  return (
    <div className={!inAuth ? "app-container" : ""}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={6}>
            <Card className="glass-card border-0 shadow-lg mt-5">
              <Card.Body className="p-5">
                <Card.Title className="text-center mb-4 fs-2 fw-bold text-primary">
                  Login
                </Card.Title>
                <Form onSubmit={submitHandler}>
                  <Form.Group controlId="loginEmail" className="mb-4">
                    <Form.Label className="fw-semibold">Email Directory</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                    />
                  </Form.Group>
                  <Form.Group controlId="loginPassword" className="mb-4">
                    <Form.Label className="fw-semibold">Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                    />
                  </Form.Group>
                  <div className="d-grid mt-5">
                    <Button variant="primary" size="lg" type="submit" className="rounded-pill p-3 shadow-var text-white fw-bold">
                      Sign Into Account
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
