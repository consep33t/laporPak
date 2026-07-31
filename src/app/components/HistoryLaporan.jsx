"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getHistoryLaporanUser } from "../utils/firestoreutils";
import Image from "next/image";

const HistoryLaporan = () => {
  const { data: session } = useSession();
  const [historyLaporan, setHistoryLaporan] = useState([]);
  const [loading, setLoading] = useState(true);

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

    fetchHistoryLaporan();
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
          {historyLaporan.map((laporan) => (
            <div key={laporan.id} className="shadow-clay-active rounded-[1.5rem] p-6 bg-clayBg flex flex-col items-center text-center transition-all">
              <h2 className="text-xl font-bold text-clayText mb-2">{laporan.name}</h2>
              <span className="text-sm font-bold text-clayBlue mb-4 bg-white/60 px-3 py-1 rounded-full shadow-sm">
                {formatDate(laporan.date)}
              </span>
              <p className="mb-4 text-gray-600 leading-relaxed font-medium">{laporan.description}</p>
              <div className="flex items-center gap-2 mb-4 bg-white/50 px-4 py-2 rounded-xl shadow-sm text-sm font-semibold text-gray-700">
                <span>📍</span> {laporan.location}
              </div>
              <Image
                src={laporan.imageUrl}
                width={300}
                height={300}
                alt="Laporan"
                className="w-full h-48 object-cover rounded-[1.5rem] shadow-sm border-4 border-white/50"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryLaporan;
