"use client";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import CameraCapture from "./components/cameraCapture";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveDataToFirestore } from "./utils/firestoreutils";

const LeafletMap = dynamic(() => import("./components/leafleatMap"), {
  ssr: false,
});

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(null);
  const [location, setLocation] = useState("");

  const handleLocationUpdate = (lat, lon) => {
    const formattedLocation = `${Math.abs(lat).toFixed(7)}° ${
      lat >= 0 ? "N" : "S"
    }, ${Math.abs(lon).toFixed(7)}° ${lon >= 0 ? "E" : "W"}`;
    setLocation(formattedLocation);
  };

  const handleImageUrl = (url) => {
    setImageUrl(url);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const handleSave = async () => {
    if (session && imageUrl && location) {
      const { user } = session;
      const data = {
        name: user.name,
        email: user.email,
        imageUrl: imageUrl,
        location: location,
      };
      try {
        await saveDataToFirestore(data);
        alert("Data berhasil disimpan!");
      } catch (error) {
        console.error("Error saving data: ", error);
        alert("Terjadi kesalahan saat menyimpan data.");
      }
    } else {
      alert("Lengkapi semua data sebelum menyimpan.");
    }
  };

  return (
    <>
      <div>
        <h1>Welcome, {session?.user?.name}</h1>
        <h1>{session?.user?.email}</h1>
        <h2>Location Finder</h2>
        <LeafletMap onLocationUpdate={handleLocationUpdate} />
        <CameraCapture onImageUpload={handleImageUrl} />
        <button onClick={handleSave} style={{ marginTop: "20px" }}>
          Simpan Data
        </button>
      </div>
    </>
  );
}
