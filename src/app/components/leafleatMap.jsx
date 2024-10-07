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
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading location...</p>
      </div>
    );
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
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4 gap-2">
        <input
          type="text"
          placeholder="Latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          className="border border-gray-300 p-2 rounded mr-2"
        />
        <input
          type="text"
          placeholder="Longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          className="border border-gray-300 p-2 rounded mr-2"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Cari Lokasi
        </button>
      </div>

      <div className="mb-2">
        <strong>Latitude:</strong> {position[0]} <br />
        <strong>Longitude:</strong> {position[1]}
      </div>

      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "30vh", width: "100%" }}
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
