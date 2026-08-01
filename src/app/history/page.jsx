"use client";
import HistoryLaporan from "../components/HistoryLaporan";

export default function HistoryPage() {
  return (
    <div className="flex flex-col items-center w-full p-4 md:p-8">
      <div className="w-full max-w-4xl mt-4">
        <div className="mb-8 px-2 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-clayBlue drop-shadow-sm mb-2">
            📋 Riwayat Laporan Saya
          </h1>
          <p className="text-gray-500 font-medium">
            Pantau status laporan yang telah Anda ajukan.
          </p>
        </div>
        
        <div className="shadow-clay rounded-[2rem] p-6 md:p-10 bg-clayBg w-full">
          <HistoryLaporan />
        </div>
      </div>
    </div>
  );
}
