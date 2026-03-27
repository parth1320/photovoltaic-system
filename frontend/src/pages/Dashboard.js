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
    <div>
      <Container>
        <h2 className="mb-4">Dashboard</h2>
        <Link to="/dashboard/create">
          <Button variant="primary">Create Project</Button>
        </Link>
        <Row className="mt-4">
          {projects.map((project) => (
            <Col key={project._id} lg={4} md={6} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{project.name}</Card.Title>
                  <Card.Text>{project.description}</Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Link
                    to={`/dashboard/projects/${project._id}`}
                    className="btn btn-primary"
                  >
                    View Details
                  </Link>
                  <Button
                    onClick={() => deleteMutation.mutate(project._id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
