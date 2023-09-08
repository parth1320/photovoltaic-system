import React, { useState } from "react";
import { Form, Modal, Button, Row, Col } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

import "./AddProductForm.module.css";

const AddProductForm = ({ show, onHide, productNames, onAddProduct }) => {
  const [selectedProducts, setSelectedProducts] = useState("");

  const [productDetails, setProductDetails] = useState({
    powerPeak: "",
    orientation: "",
    inclination: "",
    area: "",
    latitude: null,
    longitude: null,
  });

  const handleSumbit = (e) => {
    e.preventDefault();
    onAddProduct({ ...productDetails, name: selectedProducts });
    onHide();
  };

  const MapEventHandler = () => {
    const map = useMapEvents({
      click: (e) => {
        setProductDetails({
          ...productDetails,
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        });
      },
    });
    return null;
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="map-container">
          <MapContainer
            center={[
              productDetails.latitude || 0,
              productDetails.longitude || 0,
            ]}
            zoom={10}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapEventHandler />
            {productDetails.latitude && productDetails.longitude && (
              <Marker
                position={[productDetails.latitude, productDetails.longitude]}
              />
            )}
          </MapContainer>
        </div>
        <Form onSubmit={handleSumbit}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="latitude">
                <Form.Label>Latitude</Form.Label>
                <Form.Control
                  type="number"
                  step="any"
                  value={productDetails.latitude || ""}
                  onChange={(e) =>
                    setProductDetails({
                      ...productDetails,
                      latitude: parseFloat(e.target.value),
                    })
                  }
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="longitude">
                <Form.Label>Longitude</Form.Label>
                <Form.Control
                  type="number"
                  step="any"
                  value={productDetails.longitude || ""}
                  onChange={(e) =>
                    setProductDetails({
                      ...productDetails,
                      longitude: parseFloat(e.target.value),
                    })
                  }
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="productName">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              as="select"
              value={selectedProducts}
              onChange={(e) => setSelectedProducts(e.target.value)}
            >
              <option value="">Select a product</option>
              {productNames.map((productName) => (
                <option key={productName.name} value={productName.name}>
                  {productName.name}
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
