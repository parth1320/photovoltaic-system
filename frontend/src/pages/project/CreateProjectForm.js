import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";

import axiosInstance from "../../axiosInstance/setHeader";

const userId = localStorage.getItem("id");

const CreateProject = ({ editMode, initialData, onSubmit }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [product, setProduct] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (editMode && initialData) {
      console.log(initialData);
      setName(initialData.name);
      setDescription(initialData.description);
      const selectedProductIds = initialData.products.map((prod) => prod._id);
      // console.log(selectedProductIds);
      setSelectedProducts(selectedProductIds);
    }
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(
          "http://localhost:5000/products",
        );
        setProduct(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, [editMode, initialData]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleProductChange = (selectedOptions) => {
    const selectedProductIds = selectedOptions.map((option) => option.value);
    console.log(selectedProductIds);
    setSelectedProducts(selectedProductIds);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name,
      description,
      products: selectedProducts,
    };

    if (editMode) {
      try {
        const response = await axiosInstance.put(
          `http://localhost:5000/edit/${initialData.id}`,
          formData,
        );
        if (response.statusText === "OK") {
          toast.success("Project edited successfully...");
          onSubmit();
        } else {
          console.error("Failed to update project");
          toast.error("Failed to update project..");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error updating project", error);
      }
    } else {
      try {
        const response = await axiosInstance.post(
          `http://localhost:5000/project/${userId}`,
          {
            name,
            description,
            createdAt: new Date(),
            products: selectedProducts,
          },
        );
        console.log(response.statusText);
        if (response.statusText === "OK") {
          navigate("/dashboard");
          toast.success("Project has been created successfully");
        }
      } catch (error) {
        console.error("Project could not added!");
        toast.error("Error Occured!");
      }
    }
  };

  const productOptions = product.map((p) => ({
    value: p._id,
    label: p.name,
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
            value={productOptions.filter((option) =>
              selectedProducts.includes(option.value),
            )}
            onChange={handleProductChange}
            placeholder="Select products"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          {editMode ? "Save Changes" : "Create Report"}
        </Button>
      </Form>
    </Container>
  );
};

export default CreateProject;
