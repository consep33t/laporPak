"use client";
import { useRouter } from "next/navigation";
import LaporanList from "../components/LaporanList";
import { createClient } from "@/utils/supabase/client";

const AdminPage = () => {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-clayBg py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl mx-auto shadow-clay rounded-[2.5rem] bg-clayPrimary p-8 md:p-12 transition-all duration-300 relative">
        <button
          onClick={handleLogout}
          className="absolute top-8 left-8 shadow-clay-btn active:shadow-clay-btn-active bg-clayRed hover:opacity-90 text-white font-bold py-3 px-8 rounded-full transition-all duration-200"
        >
          Logout
        </button>
        <div className="mt-12">
          <LaporanList />
        </div>
      </div>
    </div>
  );
};
export default AdminPage;
