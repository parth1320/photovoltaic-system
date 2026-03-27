import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";

const Register = ({ inAuth }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailChangeHandler = (event) => setEmail(event.target.value);
  const passwordChangeHandler = (event) => setPassword(event.target.value);
  const nameChangeHandler = (event) => setName(event.target.value);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        window.location.href = "/";
      } else {
        console.error("Registration Failed");
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
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
                  Create an Account
                </Card.Title>
                <Form onSubmit={submitHandler}>
                  <Form.Group controlId="registrationName" className="mb-4">
                    <Form.Label className="fw-semibold">Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={name}
                      onChange={nameChangeHandler}
                      required
                      placeholder="Jane Doe"
                    />
                  </Form.Group>
                  <Form.Group controlId="registrationEmail" className="mb-4">
                    <Form.Label className="fw-semibold">Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={email}
                      onChange={emailChangeHandler}
                      required
                      placeholder="name@example.com"
                    />
                  </Form.Group>
                  <Form.Group controlId="registrationPassword" className="mb-4">
                    <Form.Label className="fw-semibold">Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={password}
                      onChange={passwordChangeHandler}
                      required
                      placeholder="Create a strong password"
                    />
                  </Form.Group>
                  <div className="d-grid mt-5">
                    <Button variant="primary" size="lg" type="submit" className="rounded-pill p-3 shadow-var text-white fw-bold">
                      Register Now
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

export default Register;
