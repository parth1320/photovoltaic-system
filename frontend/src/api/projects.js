import axiosInstance from "../axiosInstance/setHeader";

const BASE = "http://localhost:5000";

export const projectKeys = {
  all: (userId) => ["projects", userId],
  detail: (projectId) => ["project", projectId],
};

export const fetchProjects = (userId) =>
  axiosInstance.get(`${BASE}/allproject/${userId}`).then((r) => r.data);

export const fetchProject = (projectId) =>
  axiosInstance.get(`${BASE}/project/${projectId}`).then((r) => r.data);

export const createProject = ({ userId, name, description }) =>
  axiosInstance
    .post(`${BASE}/project/${userId}`, { name, description, createdAt: new Date() })
    .then((r) => r.data);

export const updateProject = ({ projectId, name, description }) =>
  axiosInstance
    .put(`${BASE}/edit/${projectId}`, { name, description })
    .then((r) => r.data);

export const deleteProject = (projectId) =>
  axiosInstance.delete(`${BASE}/${projectId}`).then((r) => r.data);

export const addProduct = ({ projectId, productDetails }) =>
  axiosInstance
    .post(`${BASE}/${projectId}/products`, productDetails)
    .then((r) => r.data);

export const deleteProduct = ({ projectId, productId }) =>
  axiosInstance
    .delete(`${BASE}/${projectId}/products/${productId}`)
    .then((r) => r.data);

export const generateReport = ({ projectId, productId }) =>
  axiosInstance
    .get(`${BASE}/generate-report/${projectId}/${productId}`, {
      responseType: "arraybuffer",
    })
    .then((r) => r.data);
