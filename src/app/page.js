"use client";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import CameraCapture from "./components/getPucture";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

const LeafletMap = dynamic(() => import("./components/leafleatMap"), {
  ssr: false,
});

export default function Home() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "auth/login";
    }
  }, [status]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "authenticated") {
    return (
      <>
        <div>Welcome to your dashboard, {session.user.name}</div>

        <button onClick={() => signOut()} style={{ margin: "20px 0" }}>
          Logout
        </button>

        <div>
          <h1>Location Finder</h1>
          <LeafletMap />
          <CameraCapture />
        </div>
      </>
    );
  }

  return null;
}
