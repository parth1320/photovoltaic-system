import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance/setHeader";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";

const id = localStorage.getItem("id");

const UserProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    axiosInstance
      .get(`http://localhost:5000/user/${id}`)
      .then((response) => {
        const user = response.data;
        setProfileData(user);
        setName(user.name);
        setEmail(user.email);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInstance
      .post(`http://localhost:5000/userUpdate/${id}`, { name, email })
      .then((response) => {
        const updatedUser = response.data;
        setName(updatedUser.name);
        setEmail(updatedUser.email);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteHandler = () => {
    axiosInstance
      .delete(`http://localhost:5000/delete/${id}`)
      .then((response) => {
        alert(response.data.message);
        window.location.href("/");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <Card>
            <Card.Body>
              <Card.Title>User Profile</Card.Title>
              {profileData ? (
                <Form>
                  <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>
                  <div className="mt-4">
                    <Button
                      variant="primary"
                      onClick={handleSubmit}
                      className="me-2"
                    >
                      Update Profile
                    </Button>
                    <Button variant="danger" onClick={deleteHandler}>
                      Delete Profile
                    </Button>
                  </div>
                </Form>
              ) : (
                <Card.Text>Loading profile data...</Card.Text>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
