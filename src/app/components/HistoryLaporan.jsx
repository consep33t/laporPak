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
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">History Laporan</h1>
      {historyLaporan.length === 0 ? (
        <p className="text-center text-gray-600">No laporan found.</p>
      ) : (
        historyLaporan.map((laporan) => (
          <div key={laporan.id} className="mb-4 p-4 border rounded shadow-md">
            <h2 className="text-lg font-semibold">Nama: {laporan.name}</h2>
            <p className="text-sm text-gray-600">
              Tanggal: {formatDate(laporan.date)}
            </p>
            <p className="mt-2">Deskripsi: {laporan.description}</p>
            <p className="mt-2">
              <strong>Lokasi:</strong> {laporan.location}
            </p>
            <Image
              src={laporan.imageUrl}
              width={300}
              height={300}
              alt="Laporan"
              className="mt-2 w-full max-w-sm h-auto rounded-md"
            />
          </div>
        ))
      )}
    </div>
  );
};

export default HistoryLaporan;
