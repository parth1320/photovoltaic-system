import axiosInstance from "../axiosInstance/setHeader";

const BASE = "http://localhost:5000";

export const productKeys = {
  catalog: () => ["products"],
};

export const fetchProductCatalog = () =>
  axiosInstance.get(`${BASE}/products`).then((r) => r.data);
