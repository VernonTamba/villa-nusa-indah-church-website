"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { HeartFilledIcon } from "@/components/icons";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/lib/i18n";
import AdventistLogo from "@/public/icons/advent.svg";
import Image from "next/image";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { messages: t } = useLanguage();

  // Only show the transparent/white-text hero style on the home page.
  // All other pages (members, donate, etc.) always use the opaque navbar.
  const isHomePage = pathname === "/";
  const isTransparent = isHomePage && !isScrolled;

  const navItems = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.members, href: "/members" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <HeroUINavbar
      isBlurred={isScrolled}
      maxWidth="2xl"
      position="static"
      style={
        isTransparent
          ? {
              backgroundColor: "transparent",
              backdropFilter: "none",
              WebkitBackdropFilter: "none",
            }
          : undefined
      }
      className={clsx(
        "fixed inset-x-0 top-0 z-9999 border-b transition-colors duration-300",
        isTransparent
          ? "border-transparent bg-transparent shadow-none backdrop-blur-none"
          : "border-divider bg-background/80 shadow-sm",
      )}
      classNames={{
        base: isTransparent
          ? "fixed inset-x-0 top-0 bg-transparent backdrop-blur-none backdrop-saturate-100"
          : "fixed inset-x-0 top-0 bg-background/80",
      }}
    >
      <NavbarContent
        className="basis-1/5 sm:basis-full justify-between"
        justify="start"
      >
        <NavbarBrand
          as="li"
          className={clsx("gap-3 max-w-fit", isTransparent && "text-white")}
        >
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <span className="flex items-center justify-center rounded-md bg-white p-1">
              <Image
                src={AdventistLogo}
                alt="Adventist Logo"
                height={30}
                width={30}
              />
            </span>
            <p className="ml-3 font-bold text-inherit leading-4">
              GMAHK <br /> Villa Nusa Indah
            </p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:font-medium",
                  isTransparent
                    ? "text-white data-[active=true]:text-secondary"
                    : "data-[active=true]:text-primary",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden sm:flex">
          <LanguageToggle />
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          <Button
            as={Link}
            className="text-sm font-normal text-default-600 bg-default-100"
            href={siteConfig.links.donate}
            startContent={<HeartFilledIcon className="text-danger" />}
            variant="flat"
          >
            {t.nav.donate}
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <LanguageToggle />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {navItems.map((item, index) => (
            <NavbarMenuItem key={`${item.href}-${index}`}>
              <Link
                color="foreground"
                href={item.href}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
          <NavbarMenuItem>
            <Link
              color="foreground"
              href={siteConfig.links.donate}
              size="lg"
            >
              {t.nav.donate}
            </Link>
          </NavbarMenuItem>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
