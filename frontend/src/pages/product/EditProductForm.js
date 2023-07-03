import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditProductForm = ({ product, onSave, onClose }) => {
  const [updatedProduct, setUpdatedProduct] = useState(product);

  const handleChange = (e) => {
    setUpdatedProduct({ ...updatedProduct, [e.target.value]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(updatedProduct);
    onClose();
  };

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formPowerPeak">
            <Form.Label>Power Peak</Form.Label>
            <Form.Control
              type="text"
              name="powerPeak"
              value={updatedProduct.powerPeak}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formOrientation">
            <Form.Label>Orientation</Form.Label>
            <Form.Control
              type="text"
              name="orientation"
              value={updatedProduct.orientation}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formInclination">
            <Form.Label>Inclination</Form.Label>
            <Form.Control
              type="text"
              name="inclination"
              value={updatedProduct.inclination}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formArea">
            <Form.Label>Area</Form.Label>
            <Form.Control
              type="text"
              name="area"
              value={updatedProduct.area}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProductForm;
