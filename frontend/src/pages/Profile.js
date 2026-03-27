import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { fetchUser, updateUser, deleteUser, userKeys } from "../api/users";
import useAuth from "../hooks/useAuth";

const UserProfile = () => {
  const { userId: id } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const { data: profileData, isLoading, isError } = useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUser(id),
  });

  useEffect(() => {
    if (profileData) {
      setName(profileData.name);
      setEmail(profileData.email);
    }
  }, [profileData]);

  const updateMutation = useMutation({
    mutationFn: () => updateUser({ userId: id, name, email }),
    onSuccess: (updatedUser) => {
      setName(updatedUser.name);
      setEmail(updatedUser.email);
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteUser(id),
    onSuccess: (data) => {
      alert(data.message);
      navigate("/");
    },
  });

  if (isLoading) return <Spinner animation="border" />;
  if (isError) return <Alert variant="danger">Failed to load profile.</Alert>;

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <Card>
            <Card.Body>
              <Card.Title>User Profile</Card.Title>
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
                    onClick={() => updateMutation.mutate()}
                    className="me-2"
                  >
                    Update Profile
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => deleteMutation.mutate()}
                  >
                    Delete Profile
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

export default UserProfile;
