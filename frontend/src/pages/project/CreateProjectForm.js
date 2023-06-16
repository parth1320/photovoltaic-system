import axiosInstance from "../../axiosInstance/setHeader";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

const userId = localStorage.getItem("id");

const CreateProject = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [products, setProducts] = useState("");
  const [customProduct, setCustomProduct] = useState(false);
  const [productParams, setProductParams] = useState({
    powerPeak: "",
    orientation: "",
    inclination: "",
    area: "",
    longitude: "",
    latitude: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        `http://localhost:5000/project/${userId}`,
        { title, description, products },
      );
      console.log(response.statusText);
      if (response.statusText === "OK") {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Project could not added!");
    }
  };

  const handleProductChange = (e) => {
    const selectedProduct = e.target.value;
    setProducts(selectedProduct);
    if (selectedProduct === "custom") {
      setCustomProduct(true);
    } else {
      setCustomProduct(false);
      if (selectedProduct === "product1") {
        setProductParams({
          powerPeak: "100",
          orientation: "North",
          inclination: "30",
          area: "50",
          longitude: "72.831",
          latitude: "21.170",
        });
      } else if (selectedProduct === "product2") {
        setProductParams({
          powerPeak: "200",
          orientation: "South",
          inclination: "20",
          area: "100",
          longitude: "12.922",
          latitude: "50.826",
        });
      }
    }
  };

  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setProductParams((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Container>
      <h1>Create Project</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formProduct">
          <Form.Label>Product</Form.Label>
          <Form.Control
            as="select"
            value={products}
            onChange={handleProductChange}
          >
            <option value="">Select a product</option>
            <option value="product1">Product 1</option>
            <option value="product2">Product 2</option>
            <option value="custom">Custom Product</option>
          </Form.Control>
        </Form.Group>
        {customProduct && (
          <div>
            <h4>Custom Product Parameters</h4>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formPowerPeak">
                  <Form.Label>Power Peak</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter power peak"
                    name="powerPeak"
                    value={productParams.powerPeak}
                    onChange={handleParamChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formOrientation">
                  <Form.Label>Orientation</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter orientation"
                    name="orientation"
                    value={productParams.orientation}
                    onChange={handleParamChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formInclination">
                  <Form.Label>Inclination</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter inclination"
                    name="inclination"
                    value={productParams.inclination}
                    onChange={handleParamChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formArea">
                  <Form.Label>Area</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter area"
                    name="area"
                    value={productParams.area}
                    onChange={handleParamChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formLongitude">
                  <Form.Label>Longitude</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter longitude"
                    name="longitude"
                    value={productParams.longitude}
                    onChange={handleParamChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formLatitude">
                  <Form.Label>Latitude</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter latitude"
                    name="latitude"
                    value={productParams.latitude}
                    onChange={handleParamChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        )}
        <Button variant="primary" type="submit">
          Create
        </Button>
      </Form>
    </Container>
  );
};

export default CreateProject;
