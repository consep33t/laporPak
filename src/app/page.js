"use client";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import CameraCapture from "./components/getPucture";

const LeafletMap = dynamic(() => import("./components/leafleatMap"), {
  ssr: false,
});

export default function Home() {
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
