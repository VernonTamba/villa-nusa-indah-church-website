import { IconCross, IconPray } from "@tabler/icons-react";

export const WORSHIP_SCHEDULES = [
  {
    title: "Kebaktian Sabat",
    time: "Sabtu, 08:30 - 12:00 WIB",
    icon: <IconCross className="w-6 h-6 text-primary my-auto" />,
  },
  {
    title: "Rabu Malam",
    time: "Rabu, 19:00 - 20:00 WIB",
    icon: <IconPray className="w-6 h-6 text-primary my-auto" />,
  },
] as const;
