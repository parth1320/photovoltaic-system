import { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useParams } from "react-router-dom";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";

import axiosInstance from "../../axiosInstance/setHeader";
import EditProductForm from "../product/EditProductForm";

const VisualMap = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [editProduct, setEditProduct] = useState({
    isOpen: false,
    product: null,
  });

  const fetchProject = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:5000/project/${projectId}`,
      );
      setProject(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleEditProduct = (productId) => {
    const product = project.products.find(
      (product) => product._id === productId,
    );
    console.log(product);
    setEditProduct({
      isOpen: true,
      product: product,
    });
    console.log(editProduct);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await axiosInstance.delete(
        `http://localhost:5000/${projectId}/products/${productId}`,
      );
      if (response.statusText === "OK") {
        console.log(`Deleted product ${productId}`);
        toast.error("Product Deleted Successfully!");
        fetchProject();
      } else {
        console.error("Failed to delete product");
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.error(error);
      toast.error("an error occured");
    }
  };

  const handleProductUpdate = async (updatedProduct) => {
    const {
      _id,
      powerPeak,
      orientation,
      inclination,
      area,
      longitude,
      latitude,
    } = updatedProduct;
    try {
      const response = await axiosInstance.put(
        `http://localhost:5000/products/${_id}`,
        { powerPeak, orientation, inclination, area, longitude, latitude },
      );

      if (response.statusText === "OK") {
        console.log(`Updated Product ${response.data}`);
        toast.success("Product Updated Successfully");
        fetchProject();
      }
    } catch (error) {
      console.error(error);
      toast.error("an error occured");
    }
  };

  const handleEditFormClose = () => {
    setEditProduct({
      isOpen: false,
      product: null,
    });
  };

  if (!project) {
    return <div>Loading....</div>;
  }

  return (
    <div>
      {editProduct.isOpen && (
        <EditProductForm
          product={editProduct.product}
          onSave={handleProductUpdate}
          onClose={handleEditFormClose}
        />
      )}
      <h2>Visual Map</h2>
      <MapContainer center={[0, 0]} zoom={3} style={{ height: "500px" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {project.products.map((product) => (
          <Marker
            key={product._id}
            position={[product.latitude, product.longitude]}
          >
            <Popup>
              <div>
                <h5>{product.name}</h5>
                <p>Power Peak: {product.powerPeak}</p>
                <p>Orientation: {product.orientation}</p>
                <p>Inclination: {product.inclination}</p>
                <p>Area: {product.area}</p>
                <div className="popup-actions">
                  <button
                    className="edit-button"
                    onClick={() => handleEditProduct(product._id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default VisualMap;
