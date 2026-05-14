import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandYoutube,
} from "@tabler/icons-react";

const PRIMARY_CARD_HOVER_CLASS =
  "hover:border-primary hover:bg-primary/10 hover:text-primary hover:shadow-[0_18px_45px_rgba(1,75,63,0.16)] dark:hover:bg-primary/15 dark:hover:shadow-[0_18px_45px_rgba(248,167,36,0.16)]";

const PRIMARY_ICON_HOVER_CLASS =
  "group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground";

export const SOCIAL_MEDIA = [
  {
    title: "YouTube",
    username: "GMAHKvillanusaindah",
    icon: IconBrandYoutube,
    cardHoverClass: PRIMARY_CARD_HOVER_CLASS,
    iconHoverClass: PRIMARY_ICON_HOVER_CLASS,
    href: "https://www.youtube.com/@GMAHKvillanusaindah",
    linkLabel: "Visit YouTube",
  },
  {
    title: "Facebook",
    username: "Gmahk Villa Nusa Indah",
    icon: IconBrandFacebook,
    cardHoverClass: PRIMARY_CARD_HOVER_CLASS,
    iconHoverClass: PRIMARY_ICON_HOVER_CLASS,
    href: "https://www.facebook.com/GmahkVillaNusaIndah",
    linkLabel: "Visit Facebook",
  },
  {
    title: "Instagram",
    username: "@gmahkvni",
    icon: IconBrandInstagram,
    cardHoverClass: PRIMARY_CARD_HOVER_CLASS,
    iconHoverClass: PRIMARY_ICON_HOVER_CLASS,
    href: "https://www.instagram.com/gmahkvni/",
    linkLabel: "Visit Instagram",
  },
  {
    title: "Instagram",
    username: "@vniyouth",
    icon: IconBrandInstagram,
    cardHoverClass: PRIMARY_CARD_HOVER_CLASS,
    iconHoverClass: PRIMARY_ICON_HOVER_CLASS,
    href: "https://www.instagram.com/vniyouth/",
    linkLabel: "Visit Instagram",
    classNames: "xl:col-span-1.5",
  },
  {
    title: "Instagram",
    username: "@podcastkeju",
    icon: IconBrandInstagram,
    cardHoverClass: PRIMARY_CARD_HOVER_CLASS,
    iconHoverClass: PRIMARY_ICON_HOVER_CLASS,
    href: "https://www.instagram.com/podcastkeju/",
    linkLabel: "Visit Instagram",
    classNames: "xl:col-span-1.5",
  },
];
