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
      <h1>Project: {project.name}</h1>
      <h4>Project description: {project.description}</h4>

      <Button onClick={() => setShowAddProductModal(true)}>Add Product</Button>
      <Row>
        <Col>
          {project.products?.length === 0 && (
            <Alert variant="info">
              No products added. Please click "Add Product" to add products to
              this project.
            </Alert>
          )}
        </Col>
      </Row>

      <Row>
        <Col>
          <h3>Photovoltaic Products</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product Name</th>
                <th style={{ width: "150px" }}>Delete & Edit</th>
                <th style={{ width: "150px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {project.products?.map((product, index) => (
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
                  <td>
                    <Trash
                      className="me-4"
                      color="red"
                      onClick={() =>
                        deleteProductMutation.mutate({
                          projectId: project._id,
                          productId: product._id,
                        })
                      }
                    />
                    <Pencil className="me-4" color="blue" />
                  </td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() =>
                        reportMutation.mutate({
                          projectId: project._id,
                          productId: product._id,
                        })
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
