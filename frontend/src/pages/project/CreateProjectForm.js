import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
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
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <div className="glass-card border-0 shadow-lg p-5">
            <h2 className="mb-4 fw-bold text-primary text-center">
              {editMode ? "Edit Project" : "Create a New Project"}
            </h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="projectName" className="mb-4">
                <Form.Label className="fw-semibold text-muted">Project Name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Solar Installation Alpha"
                  className="p-3"
                  required
                />
              </Form.Group>
              <Form.Group controlId="projectDescription" className="mb-4">
                <Form.Label className="fw-semibold text-muted">Project Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your project goals..."
                  className="p-3"
                />
              </Form.Group>
              <div className="d-grid mt-4">
                <Button variant="primary" type="submit" size="lg" className="rounded-pill p-3 fw-bold shadow-sm">
                  {editMode ? "Save Changes" : "Create Project"}
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateProject;
