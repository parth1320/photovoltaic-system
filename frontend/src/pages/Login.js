import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button } from "react-bootstrap";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { token, id } = await response.json();
        console.log(token);
        localStorage.setItem("token", token);
        localStorage.setItem("id", id);

        window.location.href = "/dashboard";
      } else {
        console.error("Login Failed");
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form onSubmit={submitHandler}>
      <Form.Group controlId="formEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={emailChangeHandler}
        />
      </Form.Group>

      <Form.Group controlId="formpassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={passwordChangeHandler}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Login
      </Button>

      <p>
        Don't have any account <a href="/register">Register</a>
      </p>
    </Form>
  );
};

export default Login;
