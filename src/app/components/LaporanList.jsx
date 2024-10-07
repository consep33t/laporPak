"use client";
import { useEffect, useState } from "react";
import { getLaporan } from "../utils/firestoreutils";
import Image from "next/image";

const LaporanList = () => {
  const [laporanList, setLaporanList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        const laporanData = await getLaporan();
        if (Array.isArray(laporanData)) {
          setLaporanList(laporanData);
        } else {
          console.error("Laporan data is not an array:", laporanData);
          setLaporanList([]);
        }
      } catch (error) {
        console.error("Error fetching laporan: ", error);
        setLaporanList([]);
      }
      setLoading(false);
    };

    fetchLaporan();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatLocation = (location) => {
    if (location && typeof location === "object") {
      return `Lat: ${location._lat}, Long: ${location._long}`;
    }
    return location || "Unknown location";
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Daftar Laporan</h1>
      <div className="flex gap-4 grid grid-cols-1 md:grid-cols-2">
        {laporanList.length === 0 ? (
          <p className="text-center text-gray-600">No laporan found.</p>
        ) : (
          laporanList.map((laporan) => (
            <div key={laporan.id} className="mb-4 p-4 border rounded shadow-md">
              <h2 className="text-lg font-semibold">Nama: {laporan.name}</h2>
              <p className="text-sm text-gray-600">
                Tanggal: {formatDate(laporan.date)}
              </p>
              <p className="mt-2">Deskripsi: {laporan.description}</p>
              <p className="mt-2">
                <strong>Lokasi:</strong> {formatLocation(laporan.location)}
              </p>
              {laporan.imageUrl && (
                <Image
                  src={laporan.imageUrl}
                  width={300}
                  height={300}
                  alt="Laporan"
                  className="mt-2 w-full max-w-sm h-auto rounded-md"
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LaporanList;
