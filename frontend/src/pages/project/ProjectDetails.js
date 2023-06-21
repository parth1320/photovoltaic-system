import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Container, Row, Col } from "react-bootstrap";

import axiosInstance from "../../axiosInstance/setHeader";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axiosInstance.get(
          `http://localhost:5000/project/${projectId}`,
        );
        console.log(response.data);
        setProject(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProject();
  }, [projectId]);

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Container>
        <h2 className="mb-4">Project Details</h2>
        <Card>
          <Card.Body>
            <Card.Title>{project.name}</Card.Title>
            <Card.Text>{project.description}</Card.Text>
          </Card.Body>
        </Card>
        <h3 className="mt-4">Associated Photovoltaic Products</h3>
        <Row>
          {project.products.map((product) => (
            <Col key={product._id} lg={4} md={6} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>
                    <strong>Power Peak:</strong> {product.powerPeak}
                  </Card.Text>
                  <Card.Text>
                    <strong>Orientation:</strong> {product.orientation}
                  </Card.Text>
                  <Card.Text>
                    <strong>Inclination:</strong> {product.inclination}
                  </Card.Text>
                  <Card.Text>
                    <strong>Area:</strong> {product.area}
                  </Card.Text>
                  <Card.Text>
                    <strong>Longitude:</strong> {product.longitude}
                  </Card.Text>
                  <Card.Text>
                    <strong>Latitude:</strong> {product.latitude}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
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
