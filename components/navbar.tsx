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
import Image from "next/image";

import { siteConfig } from "@/config/site";
// ThemeSwitch import removed — dark mode is forced, toggle hidden for now
import { HeartFilledIcon } from "@/components/icons";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/lib/i18n";
import AdventistLogo from "@/public/icons/advent.svg";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { messages: t } = useLanguage();

  // Only show the transparent/white-text hero style on the home page.
  // Wait until mounted to avoid hydration mismatch between SSR and client scroll state.
  const isHomePage = pathname === "/";
  const isTransparent = mounted && isHomePage && !isScrolled;

  const navItems = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.members, href: "/members" },
    { label: t.gallery.nav, href: "/gallery" },
  ];

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <HeroUINavbar
      className={clsx(
        // z-[9999] — bracket syntax is required by Tailwind v4 for arbitrary z-index values.
        // Without brackets, z-9999 is silently ignored causing the navbar to have no z-index.
        "fixed inset-x-0 top-0 z-[9999] border-b transition-colors duration-300 motion-reduce:transition-none",
        isTransparent
          ? "border-transparent bg-transparent shadow-none backdrop-blur-none"
          : "border-divider bg-background shadow-sm",
      )}
      classNames={{
        // Do NOT add position/layout classes here — the className above already handles
        // the fixed positioning. Duplicating `fixed` on the inner <nav> (classNames.base)
        // causes a double-fixed nesting bug on mobile browsers.
        base: isTransparent
          ? "bg-transparent backdrop-blur-none backdrop-saturate-100"
          : "bg-background",
        // The mobile menu overlay must have a very high z-index so it renders above
        // the hero section's transform stacking context.
        menu: "newskin z-[9999] bg-background pt-6",
        wrapper: "max-w-[1200px] px-5 md:px-8 gap-2",
      }}
      isBlurred={false}
      isMenuOpen={isMenuOpen}
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
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="min-w-0 flex-1 justify-between" justify="start">
        <NavbarBrand
          as="li"
          className={clsx(
            "gap-2 min-w-0 max-w-fit",
            isTransparent && "text-white",
          )}
        >
          <NextLink
            className="flex min-h-11 min-w-0 justify-start items-center gap-1 rounded-lg"
            href="/"
          >
            <span className="flex shrink-0 items-center justify-center rounded-lg bg-white p-1.5">
              <Image
                alt="Adventist Logo"
                className="h-5 w-5"
                height={20}
                src={AdventistLogo}
                width={20}
              />
            </span>
            <p className="ml-1 text-sm sm:text-base font-bold text-inherit leading-tight">
              GMAHK <br /> Villa Nusa Indah
            </p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                aria-current={pathname === item.href ? "page" : undefined}
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "inline-flex min-h-11 items-center px-2 rounded-lg hover:bg-surface",
                  isTransparent
                    ? "text-white data-[active=true]:text-secondary"
                    : "data-[active=true]:text-primary",
                  pathname === item.href &&
                    "font-semibold underline decoration-secondary underline-offset-8",
                )}
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent className="hidden lg:flex shrink-0" justify="end">
        {/* ThemeSwitch hidden — dark mode locked */}
        <NavbarItem className="hidden sm:flex">
          <LanguageToggle />
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          <Button
            as={Link}
            className="ns-primary bg-primary text-primary-foreground"
            href={siteConfig.links.donate}
            startContent={<HeartFilledIcon className="text-current" />}
            variant="flat"
          >
            {t.nav.donate}
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="lg:hidden shrink-0 gap-1" justify="end">
        <div className="hidden sm:block">
          <LanguageToggle />
        </div>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? t.common.closeMenu : t.common.menu}
          className="min-w-11 min-h-11"
        />
      </NavbarContent>

      <NavbarMenu>
        <div className="ns-container mt-2 flex flex-col gap-2 pb-8">
          <div className="mb-4 sm:hidden">
            <LanguageToggle />
          </div>
          {navItems.map((item, index) => (
            <NavbarMenuItem key={`${item.href}-${index}`}>
              <Link
                aria-current={pathname === item.href ? "page" : undefined}
                className={clsx(
                  "w-full min-h-12 rounded-xl px-4 py-3",
                  pathname === item.href &&
                    "bg-surface font-semibold underline underline-offset-4",
                )}
                color={pathname === item.href ? "primary" : "foreground"}
                href={item.href}
                size="lg"
                onPress={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
          <NavbarMenuItem>
            <Link
              aria-current={
                pathname === siteConfig.links.donate ? "page" : undefined
              }
              className={clsx(
                "ns-primary mt-4 w-full bg-primary text-primary-foreground",
                pathname === siteConfig.links.donate && "font-semibold",
              )}
              color={
                pathname === siteConfig.links.donate ? "primary" : "foreground"
              }
              href={siteConfig.links.donate}
              size="lg"
              onPress={() => setIsMenuOpen(false)}
            >
              {t.nav.donate}
            </Link>
          </NavbarMenuItem>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
