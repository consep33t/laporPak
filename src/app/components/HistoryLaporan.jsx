"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { getHistoryLaporanUser } from "../actions/laporan";
import Image from "next/image";
import ImageCarousel from "./ImageCarousel";

const HistoryLaporan = () => {
  const [session, setSession] = useState(null);
  const [historyLaporan, setHistoryLaporan] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    fetchSession();
  }, [supabase.auth]);

  useEffect(() => {
    const fetchHistoryLaporan = async () => {
      if (session) {
        const userEmail = session.user.email;

        try {
          const laporanData = await getHistoryLaporanUser(userEmail);

          if (Array.isArray(laporanData)) {
            setHistoryLaporan(laporanData);
          } else {
            console.error("Laporan data is not an array:", laporanData);
            setHistoryLaporan([]);
          }
        } catch (error) {
          console.error("Error fetching history laporan: ", error);
          setHistoryLaporan([]);
        }
      }
      setLoading(false);
    };

    if (session) {
      fetchHistoryLaporan();
    } else {
      setLoading(false);
    }
  }, [session]);

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

  return (
    <div className="w-full">
      {historyLaporan.length === 0 ? (
        <p className="text-center text-gray-500 italic font-medium">Belum ada laporan.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {historyLaporan.map((laporan) => {
            let statusColor = "bg-gray-200 text-gray-700";
            if (laporan.status === "Terkirim") statusColor = "bg-blue-100 text-blue-700";
            if (laporan.status === "Ditinjau") statusColor = "bg-yellow-100 text-yellow-700";
            if (laporan.status === "Diproses") statusColor = "bg-purple-100 text-purple-700";
            if (laporan.status === "Selesai") statusColor = "bg-green-100 text-green-700";
            if (laporan.status === "Ditolak") statusColor = "bg-red-100 text-red-700";

            return (
              <div key={laporan.id} className="shadow-clay-active rounded-[1.5rem] p-6 bg-clayBg flex flex-col items-center text-center transition-all relative overflow-hidden">
                {laporan.isEmergency && (
                  <div className="absolute top-0 left-0 w-full bg-red-500 text-white text-xs font-bold text-center py-1">
                    DARURAT
                  </div>
                )}
                
                <span className={`mt-2 font-bold px-4 py-1 rounded-full text-xs shadow-sm mb-4 ${statusColor}`}>
                  {laporan.status}
                </span>

                <h2 className="text-xl font-bold text-clayText mb-1">{laporan.title}</h2>
                <span className="text-sm font-bold text-clayBlue mb-2 bg-white/60 px-3 py-1 rounded-full shadow-sm">
                  {laporan.category}
                </span>
                
                <p className="text-xs text-gray-400 font-bold mb-4">
                  {formatDate(laporan.createdAt)}
                </p>

                <p className="mb-4 text-gray-600 leading-relaxed font-medium line-clamp-3">{laporan.description}</p>
                
                {laporan.fullAddress && (
                  <div className="flex items-center gap-2 mb-4 bg-white/50 px-4 py-2 rounded-xl shadow-sm text-xs font-semibold text-gray-700">
                    <span>📍</span> {laporan.fullAddress}
                  </div>
                )}
                
                {/* Multi-Image Carousel */}
                <div className="w-full mt-2">
                  <ImageCarousel 
                    images={laporan.imageUrls && laporan.imageUrls.length > 0 ? laporan.imageUrls : [laporan.imageUrl]} 
                    altText="Laporan" 
                  />
                </div>

                {laporan.status === "Diproses" && laporan.estimatedDays && (
                  <div className="mt-4 p-3 bg-purple-50 rounded-xl w-full">
                    <p className="text-purple-700 font-bold text-sm">⏱️ Estimasi: {laporan.estimatedDays} Hari Kerja</p>
                  </div>
                )}

                {laporan.status === "Selesai" && laporan.afterImageUrl && (
                  <div className="mt-4 w-full">
                    <p className="text-green-600 font-bold text-sm mb-2">✅ Bukti Perbaikan:</p>
                    <Image
                      src={laporan.afterImageUrl}
                      width={300}
                      height={300}
                      alt="Selesai"
                      className="w-full h-48 object-cover rounded-[1.5rem] shadow-sm border-4 border-green-200"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryLaporan;
