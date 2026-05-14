import { CONTACT_DETAILS } from "@/constants/contact-details";
import { SOCIAL_MEDIA } from "@/constants/contact-us";
import { IconBrandGmail, IconBrandWhatsapp } from "@tabler/icons-react";

export const CONTACT_OPTIONS = [
  {
    label: "Gmail",
    description: "gmahkvni@gmail.com",
    icon: IconBrandGmail,
    href: `mailto:${CONTACT_DETAILS.email}`,
    linkLabel: "Contact us through Gmail",
  },
  {
    label: "WhatsApp",
    description: "(+62) 812-3456-7890",
    icon: IconBrandWhatsapp,
    href: `https://wa.me/${CONTACT_DETAILS.phone.replace(/\D/g, "")}`,
    linkLabel: "Contact us through WhatsApp",
  },
  ...SOCIAL_MEDIA.map(({ title, username, icon, href, linkLabel }) => ({
    label: title,
    description: username,
    icon,
    href,
    linkLabel,
  })),
] as const;

export const CONTACT_MESSAGE_TYPES = [
  "Prayer requests",
  "Questions",
  "Greetings",
] as const;
