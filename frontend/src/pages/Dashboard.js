import React, { useEffect, useState, useCallback } from "react";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import axiosInstance from "../axiosInstance/setHeader";

const userId = localStorage.getItem("id");

const Dashboard = () => {
  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();

  const fetchProjects = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:5000/allproject/${userId}`,
      );

      setProjects(response.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const projectDeleteHandler = async (projectId) => {
    try {
      const response = await axiosInstance.delete(
        `http://localhost:5000/${projectId}`,
      );
      if (response.statusText === "OK") {
        toast.success("Project deleted successfully");
        navigate("/dashboard");
        fetchProjects();
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    }
  };

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
                    onClick={() => projectDeleteHandler(project._id)}
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
