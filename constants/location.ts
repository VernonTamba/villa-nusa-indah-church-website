const churchAddress =
  "Ruko Maison Avenue, Jl. Raya Narogong, Limus Nunggal, Kec. Cileungsi, Kabupaten Bogor, Jawa Barat 16820";

const encodedChurchAddress = encodeURIComponent(churchAddress);

export const CHURCH_LOCATION = {
  address: churchAddress,
  googleMapsEmbedUrl: `https://www.google.com/maps?q=${encodedChurchAddress}&output=embed`,
  googleMapsDirectionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodedChurchAddress}`,
} as const;
