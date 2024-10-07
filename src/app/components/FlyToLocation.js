import { useMap } from "react-leaflet";
import { useEffect } from "react";

const FlyToLocation = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 13);
    }
  }, [position, map]);

  return null;
};

export default FlyToLocation;
