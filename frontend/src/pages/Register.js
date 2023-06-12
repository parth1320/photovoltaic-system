import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };

  const nameChangeHandler = (event) => {
    setName(event.target.value);
  };

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
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Registration</Card.Title>
              <Form onSubmit={submitHandler}>
                <Form.Group controlId="registrationName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={name}
                    onChange={nameChangeHandler}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="registrationEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={email}
                    onChange={emailChangeHandler}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="registrationPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={password}
                    onChange={passwordChangeHandler}
                    required
                  />
                </Form.Group>
                <div className="mt-4">
                  <Button variant="primary" type="submit">
                    Register
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
