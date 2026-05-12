// src/components/shared/InteractiveMap.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

// Fix Leaflet's default marker icons - TypeScript safe way
const DefaultIcon = L.Icon.Default as any;
delete DefaultIcon.prototype._getIconUrl;
DefaultIcon.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface InteractiveMapProps {
  latitude: number;
  longitude: number;
  clinicName: string;
  address?: string;
  zoom?: number;
  height?: string;
}

export const InteractiveMap = ({
  latitude,
  longitude,
  clinicName,
  address,
  zoom = 15,
  height = "300px",
}: InteractiveMapProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !latitude || !longitude) {
    return (
      <div
        className="bg-gray-100 dark:bg-white/5 animate-pulse rounded-xl"
        style={{ height }}
      />
    );
  }

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={zoom}
      style={{ height, width: "100%", borderRadius: "0.75rem" }}
      className="z-0 rounded-xl overflow-hidden"
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[latitude, longitude]}>
        <Popup>
          <div className="p-1">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">
              {clinicName}
            </h3>
            {address && (
              <p className="text-xs text-gray-600 dark:text-white/60 mt-1">
                {address}
              </p>
            )}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-steel-blue text-xs mt-2 inline-block hover:underline"
            >
              Get Directions →
            </a>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

//calling the component
{
  /* <InteractiveMap
  latitude={vet.latitude}
  longitude={vet.longitude}
  clinicName={vet.clinicName}
  address={vet.address}
/>; */
}
