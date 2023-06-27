import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Container, Row, Col } from "react-bootstrap";
import {
  Typography,
  List,
  Grid,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";

import { styled } from "@mui/system";

import axiosInstance from "../../axiosInstance/setHeader";

const ProductItem = styled(Grid)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: theme.spacing(1),
}));

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axiosInstance.get(
          `http://localhost:5000/project/${projectId}`,
        );
        console.log(response.data);
        setProject(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProject();
  }, [projectId]);

  const handleCreateReport = () => {};

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Typography variant="h2">{project.name}</Typography>
      <Typography variant="body1">{project.description}</Typography>
      <Typography variant="h3">Photovoltaic Products</Typography>
      <List>
        {project.products.map((product, index) => (
          <ListItem key={index}>
            <ProductItem container>
              <Grid item>
                <ListItemText primary={product.name} />
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleCreateReport(product.name)}
                >
                  Create Report
                </Button>
              </Grid>
            </ProductItem>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ProjectDetails;
