"use client";

import { CHURCH_LOCATION } from "@/constants/location";

/*
Previous Leaflet implementation kept for reference:

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import L from "leaflet";

const churchPosition: L.LatLngExpression = [-6.2088, 106.8456];

function ChurchLeafletMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current).setView(churchPosition, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    L.circleMarker(churchPosition, {
      radius: 10,
      color: "#f97316",
      fillColor: "#f97316",
      fillOpacity: 0.9,
      weight: 2,
    })
      .addTo(map)
      .bindPopup("Jakarta");

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-[320px] w-full overflow-hidden rounded-2xl lg:h-full lg:min-h-[400px]"
    />
  );
}
*/

export default function ChurchMap() {
  return (
    <div className="h-[320px] w-full overflow-hidden rounded-2xl lg:h-full lg:min-h-[400px]">
      <iframe
        title="VNI Church location on Google Maps"
        src={CHURCH_LOCATION.googleMapsEmbedUrl}
        className="h-full w-full border-0"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
