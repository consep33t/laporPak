"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function TopNavbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Beranda", path: "/", icon: "🌍" },
    { name: "Riwayat", path: "/history", icon: "📋" },
    { name: "Berita", path: "/berita", icon: "📰" },
    { name: "Profil", path: "/profile", icon: "👤" },
  ];

  return (
    <nav className="hidden md:flex fixed top-0 w-full z-50 bg-clayBg/80 backdrop-blur-md border-b border-white/50 shadow-sm px-8 py-4 justify-between items-center transition-all">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 bg-clayBlue rounded-xl flex items-center justify-center text-white text-xl shadow-clay-active group-hover:scale-110 transition-transform">
          📝
        </div>
        <span className="text-2xl font-bold text-clayBlue drop-shadow-sm">LaporPak</span>
      </Link>

      <div className="flex items-center gap-4 bg-clayPrimary px-6 py-2 rounded-full shadow-clay-active">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
                isActive
                  ? "bg-clayBlue text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-100 hover:text-clayBlue"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div>
        <Link
          href="/laporan"
          className="shadow-clay-btn active:shadow-clay-btn-active bg-clayBlue hover:opacity-90 text-white font-extrabold py-3 px-6 rounded-2xl transition-all duration-200 flex items-center gap-2"
        >
          <span>➕</span>
          <span>Buat Laporan</span>
        </Link>
      </div>
    </nav>
  );
}
