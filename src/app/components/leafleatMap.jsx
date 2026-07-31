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
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          className="flex-1 shadow-clay-active bg-clayPrimary text-clayText rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all font-medium"
        />
        <input
          type="text"
          placeholder="Longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          className="flex-1 shadow-clay-active bg-clayPrimary text-clayText rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all font-medium"
        />
        <button
          onClick={handleSearch}
          className="shadow-clay-btn active:shadow-clay-btn-active bg-clayBlue hover:opacity-90 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200"
        >
          Cari
        </button>
      </div>

      <div className="mb-4 bg-white/60 px-4 py-2 rounded-xl shadow-sm text-sm font-semibold text-clayText text-center flex justify-center gap-4">
        <span><strong className="text-clayBlue">Lat:</strong> {position[0]}</span>
        <span><strong className="text-clayBlue">Long:</strong> {position[1]}</span>
      </div>

      <div className="rounded-[2rem] overflow-hidden shadow-sm border-4 border-white/50">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "350px", width: "100%", zIndex: 0 }}
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
    </div>
  );
};

export default LeafletMap;
