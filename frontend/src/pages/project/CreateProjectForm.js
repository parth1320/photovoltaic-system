import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import { toast } from "react-toastify";

import axiosInstance from "../../axiosInstance/setHeader";

const userId = localStorage.getItem("id");

const CreateProject = ({ editMode, initialData, onSubmit }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name,
      description,
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

  return (
    <Container>
      <h2>{editMode ? "" : "Create Project"}</h2>
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

        <Button variant="primary" type="submit">
          {editMode ? "Save Changes" : "Create Report"}
        </Button>
      </Form>
    </Container>
  );
};

export default CreateProject;
