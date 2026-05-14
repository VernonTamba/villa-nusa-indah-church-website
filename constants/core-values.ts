import { IconCompass, IconEye } from "@tabler/icons-react";

export const IDENTITY_PILLARS = [
  {
    number: "01",
    title: "Vision",
    descriptor: "Where we are being led",
    description:
      "Sharing about God's love and salvation through Jesus Christ, and how we are called to be a part of His redemptive work in the world.",
    icon: IconEye,
    cardClassName:
      "bg-[linear-gradient(145deg,rgba(248,167,36,0.14),rgba(255,255,255,0.96),rgba(255,255,255,0.88))] dark:bg-[linear-gradient(145deg,rgba(248,167,36,0.12),rgba(255,255,255,0.08),rgba(255,255,255,0.03))]",
    iconClassName:
      "border-secondary/25 bg-secondary/12 text-secondary dark:border-primary/20 dark:bg-primary/10 dark:text-primary",
    footer: "God leads, we follow.",
  },
  {
    number: "02",
    title: "Mission",
    descriptor: "How we live it out",
    description:
      "Following God's words and teachings in the Bible, and how we are called to live out our faith in practical ways that reflect God's love and grace to others.",
    icon: IconCompass,
    cardClassName:
      "bg-[linear-gradient(145deg,rgba(1,75,63,0.1),rgba(255,255,255,0.97),rgba(248,167,36,0.08))] dark:bg-[linear-gradient(145deg,rgba(1,75,63,0.38),rgba(255,255,255,0.08),rgba(248,167,36,0.08))]",
    iconClassName:
      "border-primary/20 bg-primary/10 text-primary dark:border-secondary/15 dark:bg-secondary/10 dark:text-secondary",
    footer: "Love God, and love others as ourselves.",
  },
] as const;

export type IdentityPillar = (typeof IDENTITY_PILLARS)[number];
