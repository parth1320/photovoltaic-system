import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

import axiosInstance from "../axiosInstance/setHeader";

const userId = localStorage.getItem("id");

const Dashboard = () => {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:5000/allproject/${userId}`,
      );

      setProjects(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const deleteProject = () => {};
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
