import axiosInstance from "../axiosInstance/setHeader";

const BASE = "http://localhost:5000";

export const userKeys = {
  detail: (userId) => ["user", userId],
};

export const fetchUser = (userId) =>
  axiosInstance.get(`${BASE}/user/${userId}`).then((r) => r.data);

export const updateUser = ({ userId, name, email }) =>
  axiosInstance
    .put(`${BASE}/userUpdate/${userId}`, { name, email })
    .then((r) => r.data);

export const deleteUser = (userId) =>
  axiosInstance.delete(`${BASE}/delete/${userId}`).then((r) => r.data);
