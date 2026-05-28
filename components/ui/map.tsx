"use client";

import { CHURCH_LOCATION } from "@/constants/location";

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
