import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createProject, updateProject, projectKeys } from "../../api/projects";
import useAuth from "../../hooks/useAuth";

const CreateProject = ({ editMode, initialData, onSubmit }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  const createMutation = useMutation({
    mutationFn: () => createProject({ userId, name, description }),
    onSuccess: () => {
      toast.success("Project has been created successfully");
      queryClient.invalidateQueries({ queryKey: projectKeys.all(userId) });
      navigate("/dashboard");
    },
    onError: () => toast.error("Error Occurred!"),
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      updateProject({ projectId: initialData.id, name, description }),
    onSuccess: () => {
      toast.success("Project edited successfully...");
      onSubmit();
    },
    onError: () => toast.error("Failed to update project.."),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  return (
    <Container>
      <h2>{editMode ? "" : "Create Project"}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="projectName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="projectDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
