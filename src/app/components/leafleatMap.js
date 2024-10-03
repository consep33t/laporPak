"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import FlyToLocation from "./FlyToLocation"; // Import komponen FlyToLocation

const LeafletMap = () => {
  const [position, setPosition] = useState([51.505, -0.09]);
  const [latitude, setLatitude] = useState(""); // State untuk latitude input
  const [longitude, setLongitude] = useState(""); // State untuk longitude input
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState(500); // State untuk radius lingkaran (500 meter)

  useEffect(() => {
    // Get the device's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          const { latitude, longitude } = location.coords;
          setPosition([latitude, longitude]);
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location: ", error);
          setLoading(false); // Set loading to false even if there's an error
        },
        {
          enableHighAccuracy: true, // High accuracy for more precise data
          timeout: 10000, // Maximum time before giving up on location
          maximumAge: 0, // Disable caching of location data
        }
      );
    }
  }, []);

  if (loading) {
    return <p>Loading location...</p>;
  }

  // Custom marker icon menggunakan PNG custom
  const customMarkerIcon = new L.Icon({
    iconUrl: "/icons/pin-map.png", // Path ke file PNG di folder public/icons/
    iconSize: [40, 50], // Sesuaikan ukuran icon (width, height)
    iconAnchor: [20, 40], // Anchor posisi icon (supaya titik anchor berada di ujung bawah icon)
    popupAnchor: [0, -40], // Posisi popup relatif terhadap icon
  });

  // Fungsi untuk memperbarui posisi berdasarkan input latitude dan longitude
  const handleSearch = () => {
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);

      if (!isNaN(lat) && !isNaN(lon)) {
        setPosition([lat, lon]); // Update posisi berdasarkan input
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

      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        {/* Marker dengan custom icon */}
        <Marker position={position} icon={customMarkerIcon} />
        {/* Lingkaran radius sekitar marker */}
        <Circle
          center={position}
          radius={radius} // Radius dalam meter, misalnya 500 meter
          color="red" // Warna garis lingkaran
          fillColor="red" // Warna isi lingkaran
          fillOpacity={0.2}
        />
        <FlyToLocation position={position} />
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
