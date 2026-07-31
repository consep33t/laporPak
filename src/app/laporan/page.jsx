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
    <div className="flex flex-col items-center justify-center min-h-screen bg-clayBg py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl shadow-clay rounded-[2.5rem] bg-clayPrimary p-8 md:p-12 transition-all duration-300">
        <h1 className="text-3xl font-bold text-center text-clayBlue mb-8 drop-shadow-sm">Buat Laporan Baru</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-clayText text-center">Pilih Lokasi</h2>
          <div className="shadow-clay-active rounded-3xl overflow-hidden bg-white p-2">
            <LeafletMap onLocationUpdate={handleLocationUpdate} />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-clayText text-center">Ambil Foto Bukti</h2>
          <div className="shadow-clay-active rounded-3xl overflow-hidden bg-white p-4">
            <CameraCapture onImageUpload={handleImageUrl} />
          </div>
        </div>

        <div className="mb-8 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 text-clayText">Deskripsi Masalah</h2>
          <textarea
            className="w-full md:w-3/4 h-40 shadow-clay-active bg-clayPrimary text-clayText rounded-[1.5rem] p-6 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all resize-none font-medium"
            placeholder="Tuliskan keluhan atau masalah secara detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-6 mt-10">
          <button
            onClick={() => router.push("/")}
            className="shadow-clay-btn active:shadow-clay-btn-active bg-clayRed hover:opacity-90 text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-200"
          >
            Kembali
          </button>
          <button
            onClick={handleSave}
            className="shadow-clay-btn active:shadow-clay-btn-active bg-clayBlue hover:opacity-90 text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-200"
          >
            Kirim Laporan
          </button>
        </div>
      </div>
    </div>
  );
};

export default LaporanPage;
