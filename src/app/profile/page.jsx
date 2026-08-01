"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateProfile, ensureUserProfile } from "@/app/actions/user";
import { createClient } from "@/utils/supabase/client";

export default function ProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nik: "", fullName: "", phoneNumber: "", addressDetail: "",
    province: "", city: "", district: "", village: "", rt_rw: "", postalCode: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await ensureUserProfile();
      if (res.error) {
        setMessage("Gagal memuat profil: " + res.error);
      } else if (res.profile) {
        setFormData(prev => ({ ...prev, ...res.profile }));
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const res = await updateProfile(formData);
    if (res.error) {
      setMessage("Error: " + res.error);
    } else {
      setMessage("Profil berhasil disimpan!");
      setTimeout(() => router.push("/"), 1500);
    }
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-clayBg"><p className="text-xl font-bold text-clayText animate-pulse">Memuat Data...</p></div>;

  return (
    <div className="flex flex-col items-center w-full pb-20">
      <div className="w-full max-w-3xl shadow-clay rounded-[2.5rem] bg-clayPrimary p-6 md:p-12 transition-all duration-300 relative">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-clayBlue drop-shadow-sm">Profil & Pengaturan</h1>
          <button onClick={handleLogout} className="shadow-clay-btn active:shadow-clay-btn-active bg-clayRed hover:opacity-90 text-white font-bold py-2 px-6 rounded-full transition-all duration-200">
            Logout
          </button>
        </div>
        
        {formData.points !== undefined && (
          <div className="mb-8 p-4 bg-yellow-100 rounded-2xl border-2 border-yellow-300 flex items-center gap-4">
            <div className="text-4xl">🏆</div>
            <div>
              <p className="text-gray-500 font-bold text-sm">Poin Kontribusi</p>
              <p className="text-2xl font-extrabold text-yellow-600">{formData.points} Poin</p>
            </div>
            {formData.badge && (
              <div className="ml-auto bg-yellow-400 text-white font-bold px-4 py-2 rounded-full shadow-sm">
                Lencana: {formData.badge}
              </div>
            )}
          </div>
        )}

        {message && (
          <div className={`p-4 rounded-xl mb-6 font-bold text-center ${message.includes('Error') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-clayText ml-2 mb-2">Nama Lengkap</label>
              <input type="text" name="fullName" value={formData.fullName || ""} onChange={handleChange} required className="w-full shadow-clay-active bg-clayPrimary text-clayText rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-blue-300" />
            </div>
            <div>
              <label className="block text-sm font-bold text-clayText ml-2 mb-2">NIK (KTP)</label>
              <input type="text" name="nik" value={formData.nik || ""} onChange={handleChange} required maxLength="16" className="w-full shadow-clay-active bg-clayPrimary text-clayText rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-blue-300" />
            </div>
            <div>
              <label className="block text-sm font-bold text-clayText ml-2 mb-2">No. HP</label>
              <input type="text" name="phoneNumber" value={formData.phoneNumber || ""} onChange={handleChange} required className="w-full shadow-clay-active bg-clayPrimary text-clayText rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-blue-300" />
            </div>
            <div>
              <label className="block text-sm font-bold text-clayText ml-2 mb-2">Provinsi</label>
              <input type="text" name="province" value={formData.province || ""} onChange={handleChange} required className="w-full shadow-clay-active bg-clayPrimary text-clayText rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-blue-300" />
            </div>
            <div>
              <label className="block text-sm font-bold text-clayText ml-2 mb-2">Kabupaten/Kota</label>
              <input type="text" name="city" value={formData.city || ""} onChange={handleChange} required className="w-full shadow-clay-active bg-clayPrimary text-clayText rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-blue-300" />
            </div>
            <div>
              <label className="block text-sm font-bold text-clayText ml-2 mb-2">Kecamatan</label>
              <input type="text" name="district" value={formData.district || ""} onChange={handleChange} required className="w-full shadow-clay-active bg-clayPrimary text-clayText rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-blue-300" />
            </div>
            <div>
              <label className="block text-sm font-bold text-clayText ml-2 mb-2">Kelurahan/Desa</label>
              <input type="text" name="village" value={formData.village || ""} onChange={handleChange} required className="w-full shadow-clay-active bg-clayPrimary text-clayText rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-blue-300" />
            </div>
            <div>
              <label className="block text-sm font-bold text-clayText ml-2 mb-2">RT / RW</label>
              <input type="text" name="rt_rw" placeholder="001/002" value={formData.rt_rw || ""} onChange={handleChange} required className="w-full shadow-clay-active bg-clayPrimary text-clayText rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-blue-300" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-clayText ml-2 mb-2">Alamat Detail (Jalan, No Rumah)</label>
            <textarea name="addressDetail" value={formData.addressDetail || ""} onChange={handleChange} required rows="3" className="w-full shadow-clay-active bg-clayPrimary text-clayText rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-blue-300"></textarea>
          </div>
          
          <button type="submit" disabled={saving} className="shadow-clay-btn active:shadow-clay-btn-active bg-clayBlue hover:opacity-90 text-white font-bold py-4 rounded-2xl mt-4">
            {saving ? "Menyimpan..." : "Simpan Profil"}
          </button>
        </form>
      </div>
    </div>
  );
}
