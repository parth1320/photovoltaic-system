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
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <div className="glass-card border-0 shadow-lg p-5">
            <h2 className="mb-4 fw-bold text-primary text-center">User Profile</h2>
            <Form>
              <Form.Group controlId="name" className="mb-4">
                <Form.Label className="fw-semibold text-muted">Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-3"
                />
              </Form.Group>
              <Form.Group controlId="email" className="mb-4">
                <Form.Label className="fw-semibold text-muted">Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-3"
                />
              </Form.Group>
              <div className="d-flex gap-3 mt-5">
                <Button
                  variant="primary"
                  onClick={() => updateMutation.mutate()}
                  className="flex-grow-1 rounded-pill p-3 fw-bold shadow-sm"
                >
                  Update Profile
                </Button>
                <Button
                  variant="danger"
                  onClick={() => deleteMutation.mutate()}
                  className="flex-grow-1 rounded-pill p-3 fw-bold shadow-sm"
                >
                  Delete Profile
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
