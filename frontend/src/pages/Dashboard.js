import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axiosInstance from "../axiosInstance/setHeader";
import { Card, Row, Col, Button } from "react-bootstrap";

const userId = localStorage.getItem("id");

const Dashboard = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:5000/${userId}`,
      );
      setProjects(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProject = () => {};
  return (
    <>
      <h1>Project Dashboard</h1>
      <Button as={Link} to="/projects/create" variant="primary">
        Create Project
      </Button>
      <Row className="mt-3">
        {projects.map((project) => (
          <Col key={project._id} md={4} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{project.title}</Card.Title>
                <Card.Text>{project.description}</Card.Text>
                <Button
                  variant="danger"
                  onClick={() => deleteProject(project._id)}
                >
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Dashboard;
