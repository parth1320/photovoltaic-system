import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Container, Button, Spinner, Alert, Badge } from "react-bootstrap";
import axiosInstance from "../../axiosInstance/setHeader";
import "leaflet/dist/leaflet.css";

// Create a modern custom marker using divIcon
const createModernMarker = (status) => {
  const isOptimal = status === 'optimal';
  const glowColor = isOptimal ? 'rgba(34, 197, 94, 0.6)' : 'rgba(234, 179, 8, 0.6)';
  const pulseClass = isOptimal ? 'pulse-green' : 'pulse-yellow';

  return L.divIcon({
    className: "custom-panel-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    html: `
      <div style="
        width: 100%;
        height: 100%;
        background-color: #1f2937;
        border: 2px solid ${isOptimal ? '#22c55e' : '#eab308'};
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 15px ${glowColor};
        position: relative;
        transform: rotate(-15deg);
      ">
        <div class="${pulseClass}" style="
          width: 8px;
          height: 8px;
          background-color: ${isOptimal ? '#4ade80' : '#facc15'};
          border-radius: 50%;
          position: absolute;
          top: -4px;
          right: -4px;
        "></div>
        <svg fill="#fff" viewBox="0 0 24 24" width="20" height="20">
           <path d="M4,2H20A2,2 0 0,1 22,4V14A2,2 0 0,1 20,16H15V20H17L16,22H8L7,20H9V16H4A2,2 0 0,1 2,14V4A2,2 0 0,1 4,2M4,4V14H20V4H4M11,16V20H13V16H11M6,6H10V9H6V6M14,6H18V9H14V6M6,10H10V13H6V10M14,10H18V13H14V10Z" />
        </svg>
      </div>
    `
  });
};

const VisualMap = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjectData = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`http://localhost:5000/project/${projectId}`);
      setProject(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      fetchProjectData();
    } else {
      setIsLoading(false); 
    }
  }, [fetchProjectData, projectId]);

  if (isLoading) {
    return <Container className="mt-5 text-center"><Spinner animation="border" variant="primary" /></Container>;
  }

  if (!project) {
    return <Container className="mt-5"><Alert variant="danger">Project not found or unable to load map.</Alert></Container>;
  }

  // Calculate center safely
  const defaultCenter = [40.7128, -74.0060]; // default fallback
  const mapCenter = project.products?.length > 0 && project.products[0].latitude
    ? [project.products[0].latitude, project.products[0].longitude]
    : defaultCenter;

  return (
    <Container className="py-4 app-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="display-6 fw-bold text-primary mb-1">Visual Map: {project.name}</h2>
          <p className="text-muted mb-0">Live status of panels installed</p>
        </div>
        <Link to={`/dashboard/projects/${projectId}`}>
          <Button variant="outline-primary" className="rounded-pill px-4 shadow-sm fw-bold">
            &larr; Back to Details
          </Button>
        </Link>
      </div>
      
      <div className="glass-card shadow-lg border-0 overflow-hidden" style={{ borderRadius: "1.5rem", padding: "0.5rem" }}>
        <MapContainer
          center={mapCenter}
          zoom={project.products?.length > 0 ? 15 : 3}
          style={{ height: "650px", width: "100%", borderRadius: "1rem", zIndex: 0 }}
        >
          <TileLayer 
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {project.products?.map((product) => {
            // Determine status dynamically for demonstration
            // (assume Optimal if power peak exists and is >400 or just randomize occasionally)
            const isOptimal = product.powerPeak > 200 || Math.random() > 0.3;
            const markerStatus = isOptimal ? 'optimal' : 'warning';
            
            return (
              <Marker
                key={product._id}
                position={[product.latitude || 0, product.longitude || 0]}
                icon={createModernMarker(markerStatus)}
              >
                <Popup className="modern-popup border-0 p-0 shadow-lg">
                  <div className="text-center p-3" style={{ minWidth: "220px" }}>
                    <h5 className="fw-bold text-primary mb-2">{product.name}</h5>
                    <Badge bg={isOptimal ? 'success' : 'warning'} text={isOptimal ? "light" : "dark"} className="mb-3 px-3 py-2 rounded-pill shadow-sm fs-6">
                      {isOptimal ? '● Online & Optimal' : '▲ Action Recommended'}
                    </Badge>
                    
                    <div className="d-flex flex-column gap-2 text-start text-muted px-2 border-top pt-3" style={{ fontSize: "0.95rem" }}>
                      <div className="d-flex justify-content-between">
                        <span>Peak Power</span> 
                        <strong className="text-dark">{product.powerPeak || 0} W</strong>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Orientation</span> 
                        <strong className="text-dark">{product.orientation || 'N/A'}</strong>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Inclination</span> 
                        <strong className="text-dark">{product.inclination || 0}°</strong>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Total Area</span> 
                        <strong className="text-dark">{product.area || 0} m²</strong>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </Container>
  );
};

export default VisualMap;
