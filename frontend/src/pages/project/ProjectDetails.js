import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Table, Button } from "react-bootstrap";

import axiosInstance from "../../axiosInstance/setHeader";

const ProjectDetails = () => {
  let formatedCreatedAt;
  const { projectId } = useParams();
  const [project, setProject] = useState(null);

  const fetchProject = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:5000/project/${projectId}`,
      );
      setProject(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  if (project) {
    const { createdAt } = project;

    const newdate = new Date(createdAt).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    formatedCreatedAt = newdate;
  }

  const handleCreateReport = () => {};

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Container>
        <Row className="mb-3">
          <Col>
            <h2>{project.name}</h2>
            <p>{project.description}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <h3>Photovoltaic Products</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>createdAt</th>
                  <th style={{ width: "150px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {project.products.map((product, index) => (
                  <tr key={index}>
                    <td>
                      <div>
                        <strong>{product.name}</strong>
                      </div>
                      <div style={{ fontSize: "12px" }}>
                        Area: {product.area} m² | Inclination:{" "}
                        {product.inclination}° | Orientation:{" "}
                        <strong>{product.orientation}</strong>
                      </div>
                    </td>
                    <td>{formatedCreatedAt}</td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => handleCreateReport(product.name)}
                      >
                        Create Report
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>

        <Row>
          <Link
            to={`/dashboard/visualmap/${project._id}`}
            className="btn btn-primary mt-3"
          >
            View Products on Visual Map
          </Link>
        </Row>
      </Container>
    </div>
  );
};

export default ProjectDetails;
