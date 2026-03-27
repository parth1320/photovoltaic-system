import React from "react";
import { Card, Button, Row, Col, Container, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { fetchProjects, fetchDashboardChart, deleteProject, projectKeys } from "../api/projects";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading, isError } = useQuery({
    queryKey: projectKeys.all(userId),
    queryFn: () => fetchProjects(userId),
  });

  const { data: chartData = [] } = useQuery({
    queryKey: ["dashboardChart", userId],
    queryFn: () => fetchDashboardChart(userId),
    enabled: !!userId,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      toast.success("Project deleted successfully");
      queryClient.invalidateQueries({ queryKey: projectKeys.all(userId) });
    },
    onError: () => toast.error("An error occurred"),
  });

  if (isLoading) return <Container className="mt-5 text-center"><Spinner animation="border" variant="primary" /></Container>;
  if (isError) return <Container className="mt-5"><Alert variant="danger">Failed to load projects.</Alert></Container>;

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

      <Row className="mb-5">
        <Col xs={12}>
          <div className="glass-card border-0 p-4">
            <h3 className="fw-bold mb-4 text-primary">Total Electricity Generation</h3>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGeneration" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#6b7280" tick={{ fill: '#6b7280' }} />
                  <YAxis stroke="#6b7280" tick={{ fill: '#6b7280' }} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="generation" 
                    stroke="#4f46e5" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorGeneration)" 
                    name="Generation (kW)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <h3 className="fw-bold mb-4 text-primary">Your Projects</h3>
        </Col>
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
