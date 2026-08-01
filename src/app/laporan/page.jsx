"use client";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import CameraCapture from "../components/cameraCapture";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveLaporan } from "../actions/laporan";
import { createClient } from "@/utils/supabase/client";
import { ensureUserProfile } from "@/app/actions/user";
import { useCustomAlert } from "../components/AlertProvider";

const LeafletMap = dynamic(() => import("../components/leafleatMap"), {
  ssr: false,
});

const LaporanPage = () => {
  const [session, setSession] = useState(null);
  const router = useRouter();
  const supabase = createClient();
  const { showAlert, showError, showConfirm } = useCustomAlert();
  
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Infrastruktur");
  const [description, setDescription] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [fullAddress, setFullAddress] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/auth/login");
      
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      // Ensure profile exists
      const res = await ensureUserProfile();
      if (res.needsCompletion) {
        router.push("/profile");
      }
    };
    fetchSession();
  }, [supabase.auth, router]);

  const handleLocationUpdate = async (latitude, longitude) => {
    setLat(latitude);
    setLng(longitude);
    
    // Reverse Geocoding
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
      const data = await res.json();
      if (data && data.display_name) {
        setFullAddress(data.display_name);
      }
    } catch (e) {
      console.error("Geocoding error", e);
    }
  };

  const handleSave = async (emergency = false) => {
    if (!session) return;
    if (imageUrls.length === 0 || !lat || !lng || !title || !description) {
      if(typeof window !== "undefined" && window.showError) window.showError("Mohon lengkapi Judul, Kategori, Foto (minimal 1), Lokasi, dan Deskripsi.");
      return;
    }
    
    setSaving(true);
    const { user } = session;
    const data = {
      title,
      category,
      description,
      userEmail: user.email,
      isAnonymous,
      imageUrl: imageUrls[0], // backward compatibility
      imageUrls: imageUrls,
      lat,
      lng,
      fullAddress,
      isEmergency: emergency || isEmergency,
    };
    
    try {
      const response = await saveLaporan(data);
      if (!response.success) throw new Error(response.error);
      showAlert(emergency ? "🚨 LAPORAN DARURAT TERKIRIM!" : "Laporan berhasil dikirim!");
      router.push("/");
    } catch (error) {
      console.error("Error saving data: ", error);
      showError("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-clayBg py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="w-full max-w-4xl shadow-clay rounded-[2.5rem] bg-clayPrimary p-8 md:p-12 transition-all duration-300 relative z-20 mt-16 md:mt-0">
        <button onClick={() => router.push("/")} className="absolute top-8 left-8 shadow-clay-btn active:shadow-clay-btn-active bg-white hover:bg-gray-50 text-gray-700 font-bold py-2 px-6 rounded-full transition-all duration-200">
          ⬅ Kembali
        </button>
        
        <h1 className="text-3xl font-bold text-center text-clayBlue mt-12 mb-2 drop-shadow-sm">Buat Laporan Baru</h1>
        <p className="text-center text-clayText font-medium mb-10">Mohon isi detail laporan dengan akurat agar mudah ditindaklanjuti.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-bold text-clayText ml-2 mb-2">Judul Laporan</label>
              <input type="text" placeholder="Contoh: Jalan Berlubang Parah" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full shadow-clay-active bg-clayPrimary text-clayText rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all font-medium" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-clayText ml-2 mb-2">Kategori Masalah</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full shadow-clay-active bg-clayPrimary text-clayText rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all font-medium">
                <option value="Infrastruktur">Infrastruktur (Jalan, Jembatan)</option>
                <option value="Kebersihan">Kebersihan (Sampah, Selokan)</option>
                <option value="Keamanan">Keamanan (Maling, Premanisme)</option>
                <option value="Fasilitas Umum">Fasilitas Umum (Taman, Penerangan)</option>
                <option value="Bencana Alam">Bencana Alam (Banjir, Longsor)</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-clayText ml-2 mb-2">Pilih Lokasi Kejadian</label>
              <div className="shadow-clay-active rounded-3xl overflow-hidden bg-white p-2">
                <LeafletMap onLocationUpdate={handleLocationUpdate} />
              </div>
              {fullAddress && (
                <p className="mt-4 p-3 bg-blue-50 text-clayBlue font-medium rounded-xl text-sm shadow-inner text-center">
                  📍 {fullAddress}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-bold text-clayText ml-2 mb-2">Pilih/Ambil Foto Bukti (Maks. 5)</label>
              <div className="shadow-clay-active rounded-3xl overflow-hidden bg-white p-4">
                <CameraCapture onImagesUpdate={setImageUrls} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-clayText ml-2 mb-2">Deskripsi Masalah</label>
              <textarea
                className="w-full h-32 shadow-clay-active bg-clayPrimary text-clayText rounded-[1.5rem] p-6 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all resize-none font-medium"
                placeholder="Ceritakan detail masalah yang terjadi..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl shadow-inner border border-gray-100">
              <input type="checkbox" id="anon" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="w-5 h-5 accent-clayBlue rounded" />
              <label htmlFor="anon" className="text-sm font-bold text-gray-700 cursor-pointer">
                Kirim sebagai Anonim (Sembunyikan Nama Saya)
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-6 border-t-2 border-gray-100 pt-8">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="shadow-clay-btn active:shadow-clay-btn-active bg-clayBlue hover:opacity-90 text-white font-bold text-lg py-4 px-12 rounded-full transition-all duration-200"
          >
            {saving ? "Mengirim..." : "Kirim Laporan"}
          </button>
          
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="shadow-clay-btn active:shadow-clay-btn-active bg-red-600 hover:opacity-90 text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-200 animate-pulse border-4 border-red-200"
          >
            🚨 SOS DARURAT
          </button>
        </div>
      </div>
    </div>
  );
};

export default LaporanPage;
