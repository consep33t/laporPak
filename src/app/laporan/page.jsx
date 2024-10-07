"use client";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import CameraCapture from "../components/cameraCapture";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveDataToFirestore } from "../utils/firestoreutils";

const LeafletMap = dynamic(() => import("../components/leafleatMap"), {
  ssr: false,
});

const LaporanPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(null);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState(""); // Tambahkan state untuk deskripsi

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
    if (session && imageUrl && location && description) {
      const { user } = session;
      const data = {
        name: user.name,
        email: user.email,
        imageUrl: imageUrl,
        location: location,
        date: new Date().toISOString(),
        description: description,
      };
      try {
        await saveDataToFirestore(data);
        alert("Data berhasil disimpan!");
        router.push("/");
      } catch (error) {
        console.error("Error saving data: ", error);
        alert("Terjadi kesalahan saat menyimpan data.");
      }
    } else {
      alert("Lengkapi semua data sebelum menyimpan.");
    }
  };

  return (
    <div className="w-full flex justify-center items-center flex-col">
      <h2>Pencarian Lokasi</h2>
      <LeafletMap onLocationUpdate={handleLocationUpdate} />
      <CameraCapture onImageUpload={handleImageUrl} />
      <h2>Deskripsi</h2>
      <textarea
        className="w-64 h-32 border border-gray-300 rounded p-2"
        placeholder="Deskripsi..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Simpan Data
        </button>
        <button
          onClick={() => router.push("/")}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Kembali
        </button>
      </div>
    </div>
  );
};

export default LaporanPage;
