"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HistoryLaporan from "./components/HistoryLaporan";
import { createClient } from "@/utils/supabase/client";

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
      } else {
        setUser(user);
      }
    };
    checkUser();
  }, [router, supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full p-8 md:p-12 gap-10">
      <div className="w-full max-w-4xl shadow-clay rounded-[2rem] p-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-clayBg transition-all duration-300">
        <h1 className="text-3xl md:text-4xl font-bold text-clayBlue drop-shadow-sm text-center md:text-left">
          Selamat Datang di LaporPak, <span className="text-clayText">{user?.user_metadata?.name || user?.email}</span>
        </h1>
        <button
          onClick={handleLogout}
          className="shadow-clay-btn active:shadow-clay-btn-active bg-clayRed hover:opacity-90 text-white font-bold py-3 px-8 rounded-full transition-all duration-200"
        >
          Logout
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8 w-full max-w-4xl">
        <div className="shadow-clay rounded-[2rem] p-10 flex-1 flex flex-col items-center justify-center bg-clayBg gap-6 text-center">
          <div className="text-6xl">📝</div>
          <h2 className="text-2xl font-bold">Punya Keluhan?</h2>
          <p className="text-gray-500 font-medium">Laporkan masalah infrastruktur atau fasilitas desa di sini.</p>
          <button
            className="shadow-clay-btn active:shadow-clay-btn-active bg-clayBlue hover:opacity-90 text-white font-extrabold text-lg py-4 px-10 rounded-full transition-all duration-200 mt-2"
            onClick={() => router.push("/laporan")}
          >
            Buat Laporan Baru
          </button>
        </div>
      </div>

      <div className="w-full max-w-4xl mt-4">
        <h2 className="text-2xl font-bold mb-6 px-2 text-clayText">Riwayat Laporan Kamu</h2>
        <div className="shadow-clay rounded-[2rem] p-6 md:p-10 bg-clayBg">
          <HistoryLaporan />
        </div>
      </div>
    </div>
  );
}
