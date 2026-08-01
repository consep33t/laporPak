"use client";
import { useEffect, useState } from "react";
import { getAdminLaporan, updateLaporanStatus } from "../actions/admin";
import Image from "next/image";
import ImageCarousel from "./ImageCarousel";

const LaporanList = () => {
  const [laporanList, setLaporanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // State for extra data when updating status
  const [extraData, setExtraData] = useState({});

  useEffect(() => {
    fetchLaporan();
  }, []);

  const fetchLaporan = async () => {
    setLoading(true);
    try {
      const data = await getAdminLaporan();
      setLaporanList(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdating(true);
    const data = extraData[id] || {};
    
    if (newStatus === "Diproses" && !data.estimatedDays) {
      if(typeof window !== "undefined" && window.showError) window.showError("Harap masukkan Estimasi Hari Kerja sebelum mengubah status ke Diproses!");
      setUpdating(false);
      return;
    }
    
    if (newStatus === "Selesai" && !data.afterImageUrl) {
      if(typeof window !== "undefined" && window.showError) window.showError("Harap masukkan URL Foto Bukti Perbaikan sebelum menyelesaikan laporan!");
      setUpdating(false);
      return;
    }

    const res = await updateLaporanStatus(id, newStatus, data);
    if (res.success) {
      if(typeof window !== "undefined" && window.showAlert) window.showAlert(`Status berhasil diubah ke ${newStatus}`);
      fetchLaporan();
    } else {
      if(typeof window !== "undefined" && window.showError) window.showError("Gagal merubah status");
    }
    setUpdating(false);
  };

  if (loading) {
    return <div className="text-xl text-center font-bold text-clayText animate-pulse">Memuat Data Laporan Warga...</div>;
  }

  const getUrgency = (likes, isEmergency) => {
    if (isEmergency) return { label: "SOS DARURAT", color: "bg-red-500 text-white animate-pulse" };
    if (likes > 10) return { label: "URGENT (10+ Likes)", color: "bg-orange-500 text-white" };
    if (likes > 5) return { label: "MENENGAH (5+ Likes)", color: "bg-yellow-500 text-white" };
    return { label: "BIASA", color: "bg-green-500 text-white" };
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-8 text-center text-clayBlue drop-shadow-sm">Panel Verifikasi Laporan</h1>
      
      <div className="grid gap-8">
        {laporanList.length === 0 ? (
          <p className="text-center text-gray-500 italic font-medium">Belum ada laporan masuk.</p>
        ) : (
          laporanList.map((laporan) => {
            const urgency = getUrgency(laporan.likes.length, laporan.isEmergency);
            
            return (
              <div key={laporan.id} className={`shadow-clay-active rounded-[2rem] p-6 bg-white flex flex-col lg:flex-row gap-6 relative overflow-hidden ${laporan.isEmergency ? 'border-4 border-red-500' : ''}`}>
                
                {/* Left side: Content & Image */}
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1 rounded-full text-xs font-bold shadow-sm ${urgency.color}`}>
                      {urgency.label}
                    </span>
                    <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs font-bold">
                      Status: {laporan.status}
                    </span>
                    <span className="text-xs font-bold text-gray-400">
                      {new Date(laporan.createdAt).toLocaleString('id-ID')}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-clayText">{laporan.title}</h2>
                  
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm">
                    <p className="font-bold text-gray-700 mb-1">Detail Pelapor:</p>
                    {laporan.isAnonymous ? (
                      <p className="text-gray-500 italic">Disembunyikan (Anonim)</p>
                    ) : (
                      <>
                        <p>Nama: <b>{laporan.user?.fullName}</b></p>
                        <p>NIK: <b>{laporan.user?.nik}</b></p>
                        <p>No HP: <b>{laporan.user?.phoneNumber}</b></p>
                        <p>Alamat: <b>{laporan.user?.addressDetail}</b></p>
                      </>
                    )}
                  </div>

                  <p className="text-gray-700 font-medium whitespace-pre-line">{laporan.description}</p>
                  
                  {laporan.fullAddress && (
                    <p className="text-sm font-bold text-gray-500">📍 Lokasi Kejadian: {laporan.fullAddress}</p>
                  )}

                  {/* Multi-Image Carousel */}
                  <div className="w-full mt-2">
                    <ImageCarousel 
                      images={laporan.imageUrls && laporan.imageUrls.length > 0 ? laporan.imageUrls : [laporan.imageUrl]} 
                      altText="Bukti" 
                    />
                  </div>
                </div>

                {/* Right side: Admin Action Panel */}
                <div className="w-full lg:w-80 bg-clayBg rounded-2xl p-6 shadow-inner flex flex-col gap-4">
                  <h3 className="font-bold text-clayBlue border-b-2 border-gray-200 pb-2">Aksi Admin</h3>
                  
                  {laporan.status === "Terkirim" && (
                    <button 
                      onClick={() => handleStatusChange(laporan.id, "Ditinjau")}
                      disabled={updating}
                      className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-2 rounded-xl shadow-sm transition-all"
                    >
                      Mulai Tinjau Laporan
                    </button>
                  )}

                  {laporan.status === "Ditinjau" && (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-gray-700">Estimasi Hari Kerja:</label>
                      <input 
                        type="number" 
                        placeholder="Contoh: 3"
                        className="p-2 rounded-xl border border-gray-200 outline-none focus:border-blue-400"
                        onChange={(e) => setExtraData({...extraData, [laporan.id]: { ...extraData[laporan.id], estimatedDays: e.target.value }})}
                      />
                      <button 
                        onClick={() => handleStatusChange(laporan.id, "Diproses")}
                        disabled={updating}
                        className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 rounded-xl shadow-sm mt-2 transition-all"
                      >
                        Tandai Sedang Diproses
                      </button>
                    </div>
                  )}

                  {laporan.status === "Diproses" && (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-gray-700">URL Foto Hasil Perbaikan:</label>
                      <input 
                        type="text" 
                        placeholder="https://..."
                        className="p-2 rounded-xl border border-gray-200 outline-none focus:border-blue-400"
                        onChange={(e) => setExtraData({...extraData, [laporan.id]: { ...extraData[laporan.id], afterImageUrl: e.target.value }})}
                      />
                      <label className="text-sm font-bold text-gray-700 mt-2">Catatan Admin (Opsional):</label>
                      <textarea
                        placeholder="Masalah sudah kami tangani..."
                        className="p-2 rounded-xl border border-gray-200 outline-none focus:border-blue-400 text-sm"
                        onChange={(e) => setExtraData({...extraData, [laporan.id]: { ...extraData[laporan.id], adminResponse: e.target.value }})}
                      ></textarea>
                      <button 
                        onClick={() => handleStatusChange(laporan.id, "Selesai")}
                        disabled={updating}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-xl shadow-sm mt-2 transition-all"
                      >
                        Selesaikan Laporan
                      </button>
                    </div>
                  )}

                  {laporan.status !== "Ditolak" && laporan.status !== "Selesai" && (
                    <button 
                      onClick={() => handleStatusChange(laporan.id, "Ditolak")}
                      disabled={updating}
                      className="bg-red-100 hover:bg-red-200 text-red-600 font-bold py-2 rounded-xl mt-auto transition-all"
                    >
                      Tolak Laporan
                    </button>
                  )}
                  
                  {laporan.status === "Selesai" && (
                    <div className="bg-green-100 text-green-800 p-3 rounded-xl text-center font-bold text-sm">
                      Laporan ini telah selesai dan ditutup.
                    </div>
                  )}
                  {laporan.status === "Ditolak" && (
                    <div className="bg-red-100 text-red-800 p-3 rounded-xl text-center font-bold text-sm">
                      Laporan ini telah ditolak.
                    </div>
                  )}

                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default LaporanList;
