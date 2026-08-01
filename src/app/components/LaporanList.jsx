"use client";
import { useEffect, useState } from "react";
import { getLaporan } from "../actions/laporan";
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
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-8 text-center text-clayBlue drop-shadow-sm">Daftar Semua Laporan</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {laporanList.length === 0 ? (
          <p className="text-center text-gray-500 italic font-medium col-span-2">Belum ada laporan.</p>
        ) : (
          laporanList.map((laporan) => (
            <div key={laporan.id} className="shadow-clay-active rounded-[1.5rem] p-6 bg-clayBg flex flex-col items-center text-center transition-all">
              <h2 className="text-xl font-bold text-clayText mb-2">{laporan.name}</h2>
              <span className="text-sm font-bold text-clayBlue mb-4 bg-white/60 px-3 py-1 rounded-full shadow-sm">
                {formatDate(laporan.date)}
              </span>
              <p className="mb-4 text-gray-700 leading-relaxed font-medium">{laporan.description}</p>
              <div className="flex items-center gap-2 mb-4 bg-white/30 px-4 py-2 rounded-xl shadow-sm text-sm font-semibold text-gray-700">
                <span>📍</span> {formatLocation(laporan.location)}
              </div>
              {laporan.imageUrl && (
                <Image
                  src={laporan.imageUrl}
                  width={300}
                  height={300}
                  alt="Laporan"
                  className="w-full h-48 object-cover rounded-[1.5rem] shadow-sm border-4 border-white/50"
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
