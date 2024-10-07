"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import FlyToLocation from "./FlyToLocation";

const LeafletMap = ({ onLocationUpdate }) => {
  const [position, setPosition] = useState([51.505, -0.09]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState(500);

  useEffect(() => {
    // Get the device's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          const { latitude, longitude } = location.coords;
          setPosition([latitude, longitude]);
          setLatitude(latitude);
          setLongitude(longitude);
          setLoading(false);

          // Panggil fungsi onLocationUpdate dengan latitude dan longitude
          if (onLocationUpdate) {
            onLocationUpdate(latitude, longitude);
          }
        },
        (error) => {
          console.error("Error getting location: ", error);
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  }, [onLocationUpdate]);

  if (loading) {
    return <p>Loading location...</p>;
  }

  const customMarkerIcon = new L.Icon({
    iconUrl: "/icons/pin-map.png",
    iconSize: [40, 50],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const handleSearch = () => {
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);

      if (!isNaN(lat) && !isNaN(lon)) {
        setPosition([lat, lon]);

        // Panggil fungsi onLocationUpdate dengan latitude dan longitude baru
        if (onLocationUpdate) {
          onLocationUpdate(lat, lon);
        }
      } else {
        alert("Please enter valid latitude and longitude.");
      }
    } else {
      alert("Please enter both latitude and longitude.");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={handleSearch}>Cari Lokasi</button>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <strong>Latitude:</strong> {position[0]} <br />
        <strong>Longitude:</strong> {position[1]}
      </div>

      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        <Marker position={position} icon={customMarkerIcon} />
        <Circle
          center={position}
          radius={radius}
          color="red"
          fillColor="red"
          fillOpacity={0.2}
        />
        <FlyToLocation position={position} />
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
