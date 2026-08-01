"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PublicFeed from "./components/PublicFeed";
import { createClient } from "@/utils/supabase/client";
import { ensureUserProfile } from "@/app/actions/user";

// haha

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const res = await ensureUserProfile();
        if (res.error) {
          console.error("Profile check error:", res.error);
        } else if (res.needsCompletion) {
          router.push("/profile");
        }
      }
    };
    fetchSessionAndProfile();
  }, [supabase.auth, router]);

  return (
    <div className="flex flex-col items-center w-full p-4 md:p-8">
      <div className="w-full max-w-4xl mt-4">
        <div className="mb-8 px-2 text-center md:text-left z-10 relative">
          <h1
            className="text-4xl md:text-5xl font-extrabold text-clayBlue mb-4"
            style={{
              textShadow: '3px 3px 0 #a3bffa, 6px 6px 0 #e0e7ff, 4px 4px 10px rgba(0,0,0,0.15)',
              letterSpacing: '-1px'
            }}
          >
            🌍 Suara Warga
          </h1>
          <p className="text-gray-500 font-bold text-lg md:text-xl max-w-2xl bg-white/50 backdrop-blur-md inline-block p-3 rounded-2xl shadow-sm border border-white">
            Feed interaktif transparansi laporan infrastruktur dan pelayanan publik.
          </p>
        </div>

        <div className="w-full">
          <PublicFeed currentUser={user} />
        </div>
      </div>
    </div>
  );
}
