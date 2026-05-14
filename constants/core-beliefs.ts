import {
  IconArrowUpRight,
  IconBook2,
  IconCalendarEvent,
  IconCross,
  IconDroplet,
  IconHeartHandshake,
  IconShieldCheck,
} from "@tabler/icons-react";

export const BELIEFS = [
  {
    number: "01",
    title: "Hari Sabat",
    summary:
      "Hari kudus untuk berhenti, beribadah, dan menikmati persekutuan dengan Tuhan serta sesama.",
    highlight: "Rest, worship, renewal",
    icon: IconCalendarEvent,
    className:
      "lg:col-span-2 bg-[linear-gradient(155deg,rgba(248,167,36,0.18),rgba(255,255,255,0.96),rgba(1,75,63,0.08))] dark:bg-[linear-gradient(155deg,rgba(248,167,36,0.14),rgba(255,255,255,0.08),rgba(1,75,63,0.35))]",
  },
  {
    number: "02",
    title: "Kedatangan Yesus Kedua Kali",
    summary:
      "Pengharapan besar gereja bahwa Kristus akan datang kembali secara nyata dan mulia.",
    highlight: "Blessed hope",
    icon: IconArrowUpRight,
    className:
      "bg-[linear-gradient(155deg,rgba(1,75,63,0.12),rgba(255,255,255,0.96),rgba(248,167,36,0.08))] dark:bg-[linear-gradient(155deg,rgba(1,75,63,0.44),rgba(255,255,255,0.06),rgba(248,167,36,0.08))]",
  },
  {
    number: "03",
    title: "Alkitab",
    summary:
      "Firman Allah yang menjadi dasar iman, pengajaran, dan kehidupan orang percaya.",
    highlight: "Authority of Scripture",
    icon: IconBook2,
    className:
      "bg-[linear-gradient(155deg,rgba(255,255,255,0.98),rgba(248,167,36,0.12),rgba(1,75,63,0.08))] dark:bg-[linear-gradient(155deg,rgba(255,255,255,0.08),rgba(248,167,36,0.1),rgba(1,75,63,0.32))]",
  },
  {
    number: "04",
    title: "Baptisan",
    summary:
      "Tanda komitmen kepada Kristus, pertobatan, dan hidup baru di dalam Dia.",
    highlight: "New life in Christ",
    icon: IconDroplet,
    className:
      "bg-[linear-gradient(155deg,rgba(248,167,36,0.12),rgba(255,255,255,0.98),rgba(255,255,255,0.9))] dark:bg-[linear-gradient(155deg,rgba(248,167,36,0.1),rgba(255,255,255,0.08),rgba(255,255,255,0.03))]",
  },
  {
    number: "05",
    title: "Penatalayanan",
    summary:
      "Segala yang kita miliki berasal dari Tuhan dan dipakai dengan setia untuk kemuliaan-Nya.",
    highlight: "Faithful stewardship",
    icon: IconHeartHandshake,
    className:
      "lg:col-span-2 bg-[linear-gradient(155deg,rgba(1,75,63,0.14),rgba(255,255,255,0.97),rgba(248,167,36,0.12))] dark:bg-[linear-gradient(155deg,rgba(1,75,63,0.4),rgba(255,255,255,0.06),rgba(248,167,36,0.1))]",
  },
  {
    number: "06",
    title: "Umat yang Sisa dan Tugasnya",
    summary:
      "Umat Tuhan dipanggil untuk setia, membawa kabar keselamatan, dan hidup sebagai saksi-Nya.",
    highlight: "Called to witness",
    icon: IconShieldCheck,
    className:
      "bg-[linear-gradient(155deg,rgba(255,255,255,0.95),rgba(1,75,63,0.1),rgba(248,167,36,0.12))] dark:bg-[linear-gradient(155deg,rgba(255,255,255,0.06),rgba(1,75,63,0.42),rgba(248,167,36,0.08))]",
  },
] as const;
