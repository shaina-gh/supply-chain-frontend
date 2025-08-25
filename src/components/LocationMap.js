import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const LocationMap = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    axios
      .get("https://supply-chain-backend-mf8h.onrender.com/api/locations") // Use your live Render URL
      .then((response) => {
        const validLocations = response.data.filter(
          (loc) => loc.latitude && loc.longitude
        );
        setLocations(validLocations);
      })
      .catch((error) => console.error("Error fetching location data:", error));
  }, []);

  const mapCenter =
    locations.length > 0
      ? [locations[0].latitude, locations[0].longitude]
      : [20.5937, 78.9629];

  return (
    <MapContainer
      center={mapCenter}
      zoom={5}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((loc, index) => (
        <Marker key={index} position={[loc.latitude, loc.longitude]}>
          <Popup>
            <b>{loc.asset_id}</b>
            <br />
            Status: {loc.shipment_status}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LocationMap;
