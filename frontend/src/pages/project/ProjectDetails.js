import React, { useReducer, useEffect, useCallback } from "react";
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

import axiosInstance from "../../axiosInstance/setHeader";
import AddProductForm from "../product/AddProductForm";

const initialState = {
  project: {},
  productNames: [],
  showAddProductModal: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_PROJECT":
      return { ...state, project: action.payload };
    case "SET_PRODUCT_NAMES":
      return { ...state, productNames: action.payload };
    case "SHOW_ADD_MODAL":
      return { ...state, showAddProductModal: true };
    case "HIDE_ADD_MODAL":
      return { ...state, showAddProductModal: false };
    default:
      return state;
  }
}

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { project, productNames, showAddProductModal } = state;

  const fetchProject = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:5000/project/${projectId}`,
      );
      dispatch({ type: "SET_PROJECT", payload: response.data });
    } catch (error) {
      console.error(error);
    }
  }, [projectId]);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`http://localhost:5000/products`);
      dispatch({ type: "SET_PRODUCT_NAMES", payload: response.data });
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchProject();
    fetchProducts();
  }, [fetchProject, fetchProducts]);

  const handleCreateReport = async (projectId, productId) => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:5000/generate-report/${projectId}/${productId}`,
        { responseType: "arraybuffer" },
      );
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

  const handleAddProduct = async (productDetails) => {
    try {
      const {
        name,
        powerPeak,
        orientation,
        inclination,
        area,
        latitude,
        longitude,
      } = productDetails;
      const response = await axiosInstance.post(
        `http://localhost:5000/${project._id}/products`,
        { name, powerPeak, orientation, inclination, area, latitude, longitude },
      );
      if (response.statusText === "Created") {
        toast.success("Product has been added successfully");
        fetchProducts();
      } else {
        toast.error("Product not added!");
      }
    } catch (error) {
      console.error(`Product not added ${error}`);
      toast.error("Product not added!");
    }
  };

  const deleteProductHandler = async (projectId, productId) => {
    try {
      const response = await axiosInstance.delete(
        `http://localhost:5000/${projectId}/products/${productId}`,
      );
      if (response.statusText === "OK") {
        toast.success("Product has been deleted successfully");
        fetchProducts();
      } else {
        toast.error("Product Not deleted..");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const editProductHandler = () => {};

  let noProductMessage = null;
  if (project.products && project.products.length === 0) {
    noProductMessage = (
      <Alert variant="info">
        No products added. Please click "Add Product" to add products to this
        project.
      </Alert>
    );
  }

  return (
    <Container>
      <h1>Project: {project.name}</h1>
      <h4>Project description: {project.description}</h4>

      <Button onClick={() => dispatch({ type: "SHOW_ADD_MODAL" })}>
        Add Product
      </Button>
      <Row>
        <Col>{noProductMessage}</Col>
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
              {project.products ? (
                project.products.map((product, index) => (
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
                          deleteProductHandler(project._id, product._id)
                        }
                      />
                      <Pencil
                        className="me-4"
                        color="blue"
                        onClick={() => editProductHandler(product)}
                      />
                    </td>
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
                ))
              ) : (
                <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

      <AddProductForm
        show={showAddProductModal}
        onHide={() => dispatch({ type: "HIDE_ADD_MODAL" })}
        onAddProduct={handleAddProduct}
        productNames={productNames}
      />
    </Container>
  );
};

export default ProjectDetails;
