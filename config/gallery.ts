export type GalleryCategory = "worship" | "activities";

export interface GalleryPhoto {
  id: number;
  src: string;
  category: GalleryCategory;
  /** Key into `t.gallery.captions` in the i18n message files. */
  captionKey: string;
}

export const galleryPhotos: GalleryPhoto[] = [
  // Worship (4 photos)
  {
    id: 1,
    src: "/images/gallery-opt/gallery_1.webp",
    category: "worship",
    captionKey: "photo1",
  },
  {
    id: 2,
    src: "/images/gallery-opt/gallery_2.webp",
    category: "worship",
    captionKey: "photo2",
  },
  {
    id: 3,
    src: "/images/gallery-opt/gallery_3.webp",
    category: "worship",
    captionKey: "photo3",
  },
  {
    id: 4,
    src: "/images/gallery-opt/gallery_4.webp",
    category: "worship",
    captionKey: "photo4",
  },

  // Activities (4 photos)
  {
    id: 5,
    src: "/images/gallery-opt/gallery_5.webp",
    category: "activities",
    captionKey: "photo5",
  },
  {
    id: 6,
    src: "/images/gallery-opt/gallery_6.webp",
    category: "activities",
    captionKey: "photo6",
  },
  {
    id: 7,
    src: "/images/gallery-opt/gallery_7.webp",
    category: "activities",
    captionKey: "photo7",
  },
  {
    id: 8,
    src: "/images/gallery-opt/gallery_8.webp",
    category: "activities",
    captionKey: "photo8",
  },

  // Potluck → Activities (3 photos)
  {
    id: 9,
    src: "/images/gallery-opt/gallery_9.webp",
    category: "activities",
    captionKey: "photo9",
  },
  {
    id: 10,
    src: "/images/gallery-opt/gallery_10.webp",
    category: "activities",
    captionKey: "photo10",
  },
  {
    id: 11,
    src: "/images/gallery-opt/gallery_11.webp",
    category: "activities",
    captionKey: "photo11",
  },

  // Youth → Activities (4 photos)
  {
    id: 12,
    src: "/images/gallery-opt/gallery_12.webp",
    category: "activities",
    captionKey: "photo12",
  },
  {
    id: 13,
    src: "/images/gallery-opt/gallery_13.webp",
    category: "activities",
    captionKey: "photo13",
  },
  {
    id: 14,
    src: "/images/gallery-opt/gallery_14.webp",
    category: "activities",
    captionKey: "photo14",
  },
  {
    id: 15,
    src: "/images/gallery-opt/gallery_15.webp",
    category: "activities",
    captionKey: "photo15",
  },

  // Children → Activities (3 photos)
  {
    id: 16,
    src: "/images/gallery-opt/gallery_16.webp",
    category: "activities",
    captionKey: "photo16",
  },
  {
    id: 17,
    src: "/images/gallery-opt/gallery_17.webp",
    category: "activities",
    captionKey: "photo17",
  },
  {
    id: 18,
    src: "/images/gallery-opt/gallery_18.webp",
    category: "activities",
    captionKey: "photo18",
  },

  // Building → Activities (2 photos)
  {
    id: 19,
    src: "/images/gallery-opt/gallery_19.webp",
    category: "activities",
    captionKey: "photo19",
  },
  {
    id: 20,
    src: "/images/gallery-opt/gallery_20.webp",
    category: "activities",
    captionKey: "photo20",
  },

  // Additional Activities (10 photos)
  {
    id: 21,
    src: "/images/gallery-opt/gallery_21.webp",
    category: "activities",
    captionKey: "photo21",
  },
  {
    id: 22,
    src: "/images/gallery-opt/gallery_22.webp",
    category: "activities",
    captionKey: "photo22",
  },
  {
    id: 23,
    src: "/images/gallery-opt/gallery_23.webp",
    category: "activities",
    captionKey: "photo23",
  },
  {
    id: 24,
    src: "/images/gallery-opt/gallery_24.webp",
    category: "activities",
    captionKey: "photo24",
  },
  {
    id: 25,
    src: "/images/gallery-opt/gallery_25.webp",
    category: "activities",
    captionKey: "photo25",
  },
  {
    id: 26,
    src: "/images/gallery-opt/gallery_26.webp",
    category: "activities",
    captionKey: "photo26",
  },
  {
    id: 27,
    src: "/images/gallery-opt/gallery_27.webp",
    category: "activities",
    captionKey: "photo27",
  },
  {
    id: 28,
    src: "/images/gallery-opt/gallery_28.webp",
    category: "activities",
    captionKey: "photo28",
  },
  {
    id: 29,
    src: "/images/gallery-opt/gallery_29.webp",
    category: "activities",
    captionKey: "photo29",
  },
  {
    id: 30,
    src: "/images/gallery-opt/gallery_30.webp",
    category: "activities",
    captionKey: "photo30",
  },
];
