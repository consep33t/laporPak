import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import CameraCapture from "./components/getPucture";

// Import the map dynamically to avoid SSR issues
const LeafletMap = dynamic(() => import("./components/leafleatMap"), {
  ssr: false,
});

export default function Home() {
  return (
    <div>
      <h1>Location Finder</h1>
      <LeafletMap />
      <CameraCapture />
    </div>
  );
}
