import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Trash, Pencil } from "react-bootstrap-icons";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import AddProductForm from "../product/AddProductForm";
import {
  fetchProject,
  addProduct,
  deleteProduct,
  generateReport,
  projectKeys,
} from "../../api/projects";
import { fetchProductCatalog, productKeys } from "../../api/products";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const queryClient = useQueryClient();
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const {
    data: project = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => fetchProject(projectId),
  });

  const { data: productNames = [] } = useQuery({
    queryKey: productKeys.catalog(),
    queryFn: fetchProductCatalog,
  });

  const addProductMutation = useMutation({
    mutationFn: (productDetails) =>
      addProduct({ projectId: project._id, productDetails }),
    onSuccess: () => {
      toast.success("Product has been added successfully");
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
      setShowAddProductModal(false);
    },
    onError: () => toast.error("Product not added!"),
  });

  const deleteProductMutation = useMutation({
    mutationFn: ({ projectId: pid, productId }) =>
      deleteProduct({ projectId: pid, productId }),
    onSuccess: () => {
      toast.success("Product has been deleted successfully");
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
    },
    onError: () => toast.error("Product not deleted"),
  });

  const reportMutation = useMutation({
    mutationFn: ({ projectId: pid, productId }) =>
      generateReport({ projectId: pid, productId }),
    onSuccess: (data) => {
      const blob = new Blob([data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "report.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    onError: (error) => {
      console.error("Error creating report:", error);
      toast.error("Error while creating report...");
    },
  });

  if (isLoading) return <Spinner animation="border" />;
  if (isError) return <Alert variant="danger">Failed to load project.</Alert>;

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="display-5 fw-bold text-primary mb-2">{project.name}</h1>
          <h4 className="text-muted fw-normal">{project.description}</h4>
        </div>
        <Button 
          onClick={() => setShowAddProductModal(true)} 
          variant="primary" 
          size="lg" 
          className="rounded-pill shadow-sm px-4"
        >
          + Add Product
        </Button>
      </div>

      <Row>
        <Col>
          {project.products?.length === 0 && (
            <Alert variant="info" className="glass-card border-0 shadow-sm mt-3">
              No products added yet. Click <strong>"Add Product"</strong> to add photovoltaic products to this project.
            </Alert>
          )}
        </Col>
      </Row>

      {project.products?.length > 0 && (
        <Row className="mt-4">
          <Col>
            <div className="glass-card border-0 p-4">
              <h3 className="fw-bold mb-4 text-primary">Photovoltaic Products</h3>
              <div className="table-responsive">
                <Table hover className="align-middle border-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 rounded-start px-4">Product Content</th>
                      <th className="border-0">Actions</th>
                      <th className="border-0 rounded-end">Reports</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.products?.map((product, index) => (
                      <tr key={index} className="border-bottom">
                        <td className="px-4 py-3">
                          <div className="mb-1">
                            <strong className="fs-5">{product.name}</strong>
                          </div>
                          <div className="text-muted" style={{ fontSize: "14px" }}>
                            <span className="me-3"><i className="bi bi-aspect-ratio me-1"></i> Area: <strong>{product.area} m²</strong></span>
                            <span className="me-3"><i className="bi bi-arrow-up-right-square me-1"></i> Inclination: <strong>{product.inclination}°</strong></span>
                            <span><i className="bi bi-compass me-1"></i> Orientation: <strong>{product.orientation}</strong></span>
                          </div>
                        </td>
                        <td className="py-3">
                          <Button variant="light" className="text-danger border-0 me-2 p-2 shadow-sm rounded-circle" onClick={() => deleteProductMutation.mutate({ projectId: project._id, productId: product._id })}>
                            <Trash size={18} />
                          </Button>
                          <Button variant="light" className="text-primary border-0 p-2 shadow-sm rounded-circle">
                            <Pencil size={18} />
                          </Button>
                        </td>
                        <td className="py-3">
                          <Button
                            variant="primary"
                            className="rounded-pill rounded"
                            onClick={() => reportMutation.mutate({ projectId: project._id, productId: product._id })}
                          >
                            Generate Report
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </Col>
        </Row>
      )}

      <AddProductForm
        show={showAddProductModal}
        onHide={() => setShowAddProductModal(false)}
        onAddProduct={(productDetails) =>
          addProductMutation.mutate(productDetails)
        }
        productNames={productNames}
      />
    </Container>
  );
};

export default ProjectDetails;
