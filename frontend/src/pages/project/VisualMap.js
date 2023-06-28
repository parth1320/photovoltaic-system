import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useParams } from "react-router-dom";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { FaEdit, FaTrash } from "react-icons/fa";

import axiosInstance from "../../axiosInstance/setHeader";

const VisualMap = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axiosInstance.get(
          `http://localhost:5000/project/${projectId}`,
        );
        setProject(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProject();
  }, [projectId]);

  const handleEditProduct = () => {};

  const handleDeleteProduct = () => {};

  if (!project) {
    return <div>Loading....</div>;
  }
  return (
    <div>
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
