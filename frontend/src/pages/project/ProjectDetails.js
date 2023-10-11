import React, { useState, useEffect, useCallback } from "react";
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
// import VisualMap from "./VisualMap";
import AddProductForm from "../product/AddProductForm";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState([]);
  const [productNames, setProductNames] = useState([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  let formatedCreatedAt;

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

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:5000/products`,
      );
      setProductNames(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProject();
    fetchProducts();
  }, [fetchProject, fetchProducts]);

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
        {
          name,
          powerPeak,
          orientation,
          inclination,
          area,
          latitude,
          longitude,
        },
      );

      if (response.statusText === "Created") {
        toast.success("Product has been added successfully");
        fetchProducts();
      }
    } catch (error) {
      console.error(`Product not added ${error}`);
      toast.error("Product not added!");
    }
  };

  const deleteProductHandler = () => {};

  const editProductHandler = () => {};

  let noProductMessage = null;

  if (project.products) {
    if (project.products.length === 0) {
      noProductMessage = (
        <Alert variant="info">
          No products added. Please click "Add Product" to add products to this
          project.
        </Alert>
      );
    }
  }

  return (
    <Container>
      <h1>Project: {project.name}</h1>
      <h4>Project description: {project.description}</h4>

      <Button onClick={() => setShowAddProductModal(true)}>Add Product</Button>
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
                        onClick={deleteProductHandler}
                      />
                      <Pencil
                        className="me-4"
                        color="blue"
                        onClick={editProductHandler}
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
        onHide={() => setShowAddProductModal(false)}
        onAddProduct={handleAddProduct}
        productNames={productNames}
      />
    </Container>
  );
};

export default ProjectDetails;

// import { useState, useEffect, useCallback } from "react";
// import { useParams, Link } from "react-router-dom";
// import { Container, Row, Col, Table, Button, Modal } from "react-bootstrap";
// import { toast } from "react-toastify";

// import axiosInstance from "../../axiosInstance/setHeader";
// import CreateProjectForm from "./CreateProjectForm";

// const ProjectDetails = () => {
//   let formatedCreatedAt;
//   const { projectId } = useParams();
//   const [project, setProject] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [editData, setEditData] = useState(null);

//   const fetchProject = useCallback(async () => {
//     try {
//       const response = await axiosInstance.get(
//         `http://localhost:5000/project/${projectId}`,
//       );
//       setProject(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   }, [projectId]);

//   useEffect(() => {
//     fetchProject();
//   }, [fetchProject]);

//   if (project) {
//     const { createdAt } = project;

//     const newdate = new Date(createdAt).toLocaleDateString("en-US", {
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     });

//     formatedCreatedAt = newdate;
//   }

//   const handleCreateReport = async (projectId, productId) => {
//     // console.log(projectId, productId);
//     try {
//       const response = await axiosInstance.get(
//         `http://localhost:5000/generate-report/${projectId}/${productId}`,
//         { responseType: "arraybuffer" },
//       );
//       // Creates a URL for the Blob data and download the PDF

//       const blob = new Blob([response.data], { type: "application/pdf" });

//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", "report.pdf");
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error("Error creating report:", error);
//       toast.error("Error while creating report...");
//     }
//   };

//   const handleEditClick = (id, name, description, products) => {
//     console.log(name, description, products);
//     setEditMode(true);
//     setEditData({ id, name, description, products });
//   };

//   const handleProjectUpdate = async (formData) => {
//     console.log(`Updated Data: ${formData}`);
//     fetchProject();
//     setEditMode(false);
//     setEditData(null);
//   };

//   if (!project) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <Container>
//         <Row className="mb-3">
//           <Col>
//             <h2>{project.name}</h2>
//             <p>{project.description}</p>
//             <Button
//               variant="info"
//               size="sm"
//               onClick={() =>
//                 handleEditClick(
//                   project._id,
//                   project.name,
//                   project.description,
//                   project.products,
//                 )
//               }
//             >
//               Edit Project
//             </Button>
//           </Col>
//         </Row>
//         <Row>
//           <Col>
//             <h3>Photovoltaic Products</h3>
//             <Table striped bordered hover>
//               <thead>
//                 <tr>
//                   <th>Product Name</th>
//                   <th>createdAt</th>
//                   <th style={{ width: "150px" }}>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {project.products.map((product, index) => (
//                   <tr key={index}>
//                     <td>
//                       <div>
//                         <strong>{product.name}</strong>
//                       </div>
//                       <div style={{ fontSize: "12px" }}>
//                         Area: {product.area} m² | Inclination:{" "}
//                         {product.inclination}° | Orientation:{" "}
//                         <strong>{product.orientation}</strong>
//                       </div>
//                     </td>
//                     <td>{formatedCreatedAt}</td>
//                     <td>
//                       <Button
//                         variant="primary"
//                         onClick={() =>
//                           handleCreateReport(project._id, product._id)
//                         }
//                       >
//                         Create Report
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </Col>
//         </Row>

//         <Row>
//           <Link
//             to={`/dashboard/visualmap/${project._id}`}
//             className="btn btn-primary mt-3"
//           >
//             View Products on Visual Map
//           </Link>
//         </Row>

//         <Modal show={editMode} onHide={() => setEditMode(false)}>
//           <Modal.Header>
//             <Modal.Title>Edit Project</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <CreateProjectForm
//               editMode={editMode}
//               initialData={editData}
//               onSubmit={handleProjectUpdate}
//             />
//           </Modal.Body>
//         </Modal>

//         {/* {editMode && (
//           <CreateProjectForm
//             editMode={editMode}
//             initialData={editData}
//             onSubmit={handleProjectUpdate}
//           />
//         )} */}
//       </Container>
//     </div>
//   );
// };

// export default ProjectDetails;
