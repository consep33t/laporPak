"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Feed", path: "/", icon: "🌍" },
    { name: "Riwayat", path: "/history", icon: "📋" },
    // Tengah kosong untuk tombol Laporan melayang
    { name: "Berita", path: "/berita", icon: "📰" },
    { name: "Profil", path: "/profile", icon: "👤" },
  ];

  return (
    <>
      {/* Tombol Lapor Melayang (Tengah) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[60]">
        <Link
          href="/laporan"
          className="flex items-center justify-center w-16 h-16 bg-clayBlue text-white text-3xl rounded-full shadow-clay-btn active:shadow-clay-btn-active active:scale-95 transition-all duration-200 border-4 border-clayBg"
        >
          +
        </Link>
      </div>

      {/* Navigasi Utama */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 bg-clayPrimary rounded-t-[2rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] px-6 py-3 pb-safe flex justify-between items-center">
        {navItems.map((item, index) => {
          const isActive = pathname === item.path;
          
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex flex-col items-center gap-1 transition-all duration-300 w-16 ${
                isActive ? "text-clayBlue -translate-y-1" : "text-gray-400 hover:text-gray-600"
              } ${index === 1 ? "mr-8" : ""} ${index === 2 ? "ml-8" : ""}`}
            >
              <span className={`text-2xl ${isActive ? 'drop-shadow-sm' : ''}`}>{item.icon}</span>
              <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                {item.name}
              </span>
              {isActive && (
                <div className="w-1 h-1 bg-clayBlue rounded-full mt-1"></div>
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
