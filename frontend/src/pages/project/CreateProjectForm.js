import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import Select from "react-select";

import axiosInstance from "../../axiosInstance/setHeader";

const userId = localStorage.getItem("id");

const CreateProject = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(
          "http://localhost:5000/products",
        );

        setProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleProductChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    console.log(selectedOptions);
    setSelectedProducts(selectedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        `http://localhost:5000/project/${userId}`,
        { name, description, products: selectedProducts },
      );
      console.log(response.statusText);
      if (response.statusText === "OK") {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Project could not added!");
    }
  };

  const productOptions = products.map((product) => ({
    value: product._id,
    Label: product.name,
  }));

  return (
    <Container>
      <h2>Create Project</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="projectName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" value={name} onChange={handleNameChange} />
        </Form.Group>
        <Form.Group controlId="projectDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={handleDescriptionChange}
          />
        </Form.Group>
        <Form.Group controlId="productSelect">
          <Form.Label>Select Solar Products</Form.Label>
          <Select
            options={productOptions}
            isMulti
            value={selectedProducts}
            onChange={handleProductChange}
            placeholder="Select products"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Create
        </Button>
      </Form>
    </Container>
  );
};

export default CreateProject;
