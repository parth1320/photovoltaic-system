import React from "react";
import { Card, Button, Row, Col, Container, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { fetchProjects, deleteProject, projectKeys } from "../api/projects";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading, isError } = useQuery({
    queryKey: projectKeys.all(userId),
    queryFn: () => fetchProjects(userId),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      toast.success("Project deleted successfully");
      queryClient.invalidateQueries({ queryKey: projectKeys.all(userId) });
    },
    onError: () => toast.error("An error occurred"),
  });

  if (isLoading) return <Spinner animation="border" />;
  if (isError) return <Alert variant="danger">Failed to load projects.</Alert>;

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="display-5 fw-bold text-primary mb-0">Dashboard</h2>
        <Link to="/dashboard/create">
          <Button variant="primary" size="lg" className="rounded-pill shadow-sm px-4">
            + Create Project
          </Button>
        </Link>
      </div>
      <Row>
        {projects.length === 0 && !isLoading && !isError && (
          <Col>
            <Alert variant="info" className="glass-card border-0">
              No projects found. Click "Create Project" to get started!
            </Alert>
          </Col>
        )}
        {projects.map((project) => (
          <Col key={project._id} lg={4} md={6} className="mb-4">
            <Card className="glass-card border-0 h-100 d-flex flex-column">
              <Card.Body className="p-4 flex-grow-1">
                <Card.Title className="fs-4 fw-bold mb-3">{project.name}</Card.Title>
                <Card.Text className="text-muted">{project.description}</Card.Text>
              </Card.Body>
              <Card.Footer className="bg-transparent border-0 p-4 pt-0 d-flex gap-2">
                <Link
                  to={`/dashboard/projects/${project._id}`}
                  className="btn btn-primary flex-grow-1 rounded-pill"
                >
                  View Details
                </Link>
                <Button
                  onClick={() => deleteMutation.mutate(project._id)}
                  variant="danger"
                  className="rounded-pill px-4"
                >
                  Delete
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Dashboard;
