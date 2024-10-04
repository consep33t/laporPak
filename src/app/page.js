"use client";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import CameraCapture from "./components/getPucture";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LeafletMap = dynamic(() => import("./components/leafleatMap"), {
  ssr: false,
});

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  return (
    <>
      <div>
        <h1>Location Finder</h1>
        <LeafletMap />
        <CameraCapture />
      </div>
    </>
  );
}
