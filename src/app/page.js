"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import HistoryLaporan from "./components/HistoryLaporan";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogout = () => {
    router.push("/auth/login");
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  return (
    <>
      <div className="flex items-center h-screen w-full flex-col p-10 gap-10">
        <h1 className="text-4xl font-bold mb-10 flex">
          Selamat Datang Di aplikasi LaporPak, {session?.user?.name}
          <p
            onClick={handleLogout}
            className="cursor-pointer text-sm text-red-500 hover:text-red-700"
          >
            logOut
          </p>
        </h1>
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push("/laporan")}
          >
            Buat Laporan
          </button>
        </div>
        <HistoryLaporan />
      </div>
    </>
  );
}
