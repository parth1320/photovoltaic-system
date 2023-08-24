import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { toast } from "react-toastify";

import axiosInstance from "../../axiosInstance/setHeader";
import CreateProjectForm from "./CreateProjectForm";

const ProjectDetails = () => {
  let formatedCreatedAt;
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);

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

  const handleCreateReport = async (projectId, productId) => {
    // console.log(projectId, productId);
    try {
      const response = await axiosInstance.get(
        `http://localhost:5000/generate-report/${projectId}/${productId}`,
        { responseType: "arraybuffer" },
      );
      // Creates a URL for the Blob data and download the PDF

      const blob = new Blob([response.data], { type: "application/pdf" });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "report.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error creating report:", error);
      toast.error("Error while creating report...");
    }
  };

  const handleEditClick = (id, name, description, products) => {
    console.log(name, description, products);
    setEditMode(true);
    setEditData({ id, name, description, products });
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editData) {
        const response = await axiosInstance.put(
          `http://localhost:5000/edit/${project._id}`,
          {
            name: project.name,
            description: project.description,
            products: project.products.map((prod) => prod._id),
          },
        );
        if (response.statusText === "OK") {
          toast.success("Project edited successfully...");
        }

        setEditMode(false);
        setEditData(null);
      } else {
        console.error("Failed to update project");
        toast.error("Failed to update project..");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating project", error);
    }
  };

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
            <Button
              variant="info"
              size="sm"
              onClick={() =>
                handleEditClick(
                  project._id,
                  project.name,
                  project.description,
                  project.products,
                )
              }
            >
              Edit Project
            </Button>
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
                        onClick={() =>
                          handleCreateReport(project._id, product._id)
                        }
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

        {editMode && (
          <CreateProjectForm
            editMode={editMode}
            initialData={editData}
            onSubmit={handleFormSubmit}
          />
        )}
      </Container>
    </div>
  );
};

export default ProjectDetails;
