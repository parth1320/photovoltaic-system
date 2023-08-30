import React, { useState } from "react";
import { Form, Modal } from "react-bootstrap";

const AddProductForm = ({ show, onHide, productNames, onAddProduct }) => {
  const [selectedProducts, setSelectedProducts] = useState("");
  const [productDetails, setProductDetails] = useState({
    powerPeak: "",
    orientation: "",
    inclination: "",
    area: "",
  });

  const handleSumbit = (e) => {
    e.preventDefault();
    onAddProduct({ ...productDetails, name: selectedProducts });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSumbit}>
          <Form.Group controlId="productName">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              as="select"
              value={selectedProductName}
              onChange={(e) => setSelectedProductName(e.target.value)}
            >
              <option value="">Select a product</option>
              {productNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="productPowerPeak">
            <Form.Label>Power Peak</Form.Label>
            <Form.Control
              type="text"
              name="powerPeak"
              value={productDetails.powerPeak}
              onChange={(e) =>
                setProductDetails({
                  ...productDetails,
                  powerPeak: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group controlId="productOrientation">
            <Form.Label>Orientation</Form.Label>
            <Form.Control
              type="text"
              name="orientation"
              value={productDetails.orientation}
              onChange={(e) =>
                setProductDetails({
                  ...productDetails,
                  orientation: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group controlId="productInclination">
            <Form.Label>Inclination</Form.Label>
            <Form.Control
              type="text"
              name="inclination"
              value={productDetails.inclination}
              onChange={(e) =>
                setProductDetails({
                  ...productDetails,
                  inclination: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group controlId="productArea">
            <Form.Label>Area (m²)</Form.Label>
            <Form.Control
              type="text"
              name="area"
              value={productDetails.area}
              onChange={(e) =>
                setProductDetails({ ...productDetails, area: e.target.value })
              }
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Add Product
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddProductForm;
