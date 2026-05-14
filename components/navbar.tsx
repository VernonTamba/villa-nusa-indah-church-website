"use client";

import { useEffect, useState } from "react";
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
import AdventistLogo from "@/public/icons/advent.svg";
import Image from "next/image";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

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
        isScrolled
          ? undefined
          : {
              backgroundColor: "transparent",
              backdropFilter: "none",
              WebkitBackdropFilter: "none",
            }
      }
      className={clsx(
        "fixed inset-x-0 top-0 z-9999 border-b transition-colors duration-300",
        isScrolled
          ? "border-divider bg-background/80 shadow-sm"
          : "border-transparent bg-transparent shadow-none backdrop-blur-none",
      )}
      classNames={{
        base: isScrolled
          ? "fixed inset-x-0 top-0 bg-background/80"
          : "fixed inset-x-0 top-0 bg-transparent backdrop-blur-none backdrop-saturate-100",
      }}
    >
      <NavbarContent
        className="basis-1/5 sm:basis-full justify-between"
        justify="start"
      >
        <NavbarBrand
          as="li"
          className={clsx("gap-3 max-w-fit", !isScrolled && "text-white")}
        >
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Image
              src={AdventistLogo}
              alt="Adventist Logo"
              height={36}
              width={36}
            />
            <p className="font-bold text-inherit leading-4">
              GMAHK <br /> Villa Nusa Indah
            </p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:font-medium",
                  isScrolled
                    ? "data-[active=true]:text-primary"
                    : "text-white data-[active=true]:text-secondary",
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
        <NavbarItem className="hidden md:flex">
          <Button
            isExternal
            as={Link}
            className="text-sm font-normal text-default-600 bg-default-100"
            href={siteConfig.links.sponsor}
            startContent={<HeartFilledIcon className="text-danger" />}
            variant="flat"
          >
            Donate
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
