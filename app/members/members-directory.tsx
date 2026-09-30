"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { Input } from "@heroui/input";
import { IconSearch, IconUserOff, IconX } from "@tabler/icons-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import memberPlaceholder from "@/public/images/member-placeholder.svg";

type DbMember = {
  id: string;
  name: string;
  position: string;
  image_url: string | null;
};

type Member = {
  id: string | number;
  name: string;
  position: string;
  image: StaticImageData | string;
};

const STATIC_MEMBERS: Member[] = [
  {
    id: 1,
    name: "Daniel Manurung",
    position: "pastor",
    image: memberPlaceholder,
  },
  {
    id: 2,
    name: "Ruth Siahaan",
    position: "headElder",
    image: memberPlaceholder,
  },
  {
    id: 3,
    name: "Samuel Hutabarat",
    position: "secretary",
    image: memberPlaceholder,
  },
  {
    id: 4,
    name: "Martha Simanjuntak",
    position: "treasurer",
    image: memberPlaceholder,
  },
  {
    id: 5,
    name: "Yosua Tampubolon",
    position: "sabbathSchoolLeader",
    image: memberPlaceholder,
  },
  {
    id: 6,
    name: "Debora Lumbantoruan",
    position: "headDeacon",
    image: memberPlaceholder,
  },
  {
    id: 7,
    name: "Elia Pasaribu",
    position: "headDeaconess",
    image: memberPlaceholder,
  },
  {
    id: 8,
    name: "Maria Sinaga",
    position: "musicLeader",
    image: memberPlaceholder,
  },
  {
    id: 9,
    name: "Paulus Nababan",
    position: "ayLeader",
    image: memberPlaceholder,
  },
  {
    id: 10,
    name: "Hanna Sitohang",
    position: "childrenLeader",
    image: memberPlaceholder,
  },
  {
    id: 11,
    name: "Andreas Sitorus",
    position: "communicationLeader",
    image: memberPlaceholder,
  },
  {
    id: 12,
    name: "Naomi Silalahi",
    position: "womenLeader",
    image: memberPlaceholder,
  },
  {
    id: 13,
    name: "Timotius Purba",
    position: "healthLeader",
    image: memberPlaceholder,
  },
  {
    id: 14,
    name: "Ester Gultom",
    position: "sabbathSchoolTeacher",
    image: memberPlaceholder,
  },
  {
    id: 15,
    name: "Jonathan Saragih",
    position: "sabbathSchoolTeacher",
    image: memberPlaceholder,
  },
  {
    id: 16,
    name: "Lydia Nainggolan",
    position: "sabbathSchoolTreasurer",
    image: memberPlaceholder,
  },
  {
    id: 17,
    name: "Mikael Tampubolon",
    position: "deacon",
    image: memberPlaceholder,
  },
  {
    id: 18,
    name: "Sarah Pardede",
    position: "deaconess",
    image: memberPlaceholder,
  },
  {
    id: 19,
    name: "Gabriel Simbolon",
    position: "deacon",
    image: memberPlaceholder,
  },
  {
    id: 20,
    name: "Rachel Sihombing",
    position: "deaconess",
    image: memberPlaceholder,
  },
  {
    id: 21,
    name: "Yakobus Marpaung",
    position: "member",
    image: memberPlaceholder,
  },
  { id: 22, name: "Lea Tarigan", position: "member", image: memberPlaceholder },
  {
    id: 23,
    name: "Petrus Manalu",
    position: "member",
    image: memberPlaceholder,
  },
  {
    id: 24,
    name: "Miriam Tobing",
    position: "member",
    image: memberPlaceholder,
  },
  {
    id: 25,
    name: "Markus Hasibuan",
    position: "member",
    image: memberPlaceholder,
  },
  {
    id: 26,
    name: "Elisabeth Panggabean",
    position: "member",
    image: memberPlaceholder,
  },
  {
    id: 27,
    name: "Filipus Pakpahan",
    position: "member",
    image: memberPlaceholder,
  },
  {
    id: 28,
    name: "Kezia Hutapea",
    position: "member",
    image: memberPlaceholder,
  },
  {
    id: 29,
    name: "Stefanus Siregar",
    position: "member",
    image: memberPlaceholder,
  },
  {
    id: 30,
    name: "Priskila Hutasoit",
    position: "member",
    image: memberPlaceholder,
  },
  {
    id: 31,
    name: "Yeremia Tambunan",
    position: "member",
    image: memberPlaceholder,
  },
  {
    id: 32,
    name: "Abigail Sagala",
    position: "member",
    image: memberPlaceholder,
  },
  {
    id: 33,
    name: "Natanael Malau",
    position: "member",
    image: memberPlaceholder,
  },
  {
    id: 34,
    name: "Yohana Damanik",
    position: "member",
    image: memberPlaceholder,
  },
  {
    id: 35,
    name: "Barnabas Lubis",
    position: "member",
    image: memberPlaceholder,
  },
  {
    id: 36,
    name: "Clara Sitanggang",
    position: "member",
    image: memberPlaceholder,
  },
  {
    id: 37,
    name: "Yusuf Panjaitan",
    position: "member",
    image: memberPlaceholder,
  },
  { id: 38, name: "Febe Munthe", position: "member", image: memberPlaceholder },
  {
    id: 39,
    name: "Titus Samosir",
    position: "member",
    image: memberPlaceholder,
  },
  {
    id: 40,
    name: "Agnes Rumapea",
    position: "member",
    image: memberPlaceholder,
  },
  {
    id: 41,
    name: "Lukas Siagian",
    position: "member",
    image: memberPlaceholder,
  },
  {
    id: 42,
    name: "Dina Pakpahan",
    position: "member",
    image: memberPlaceholder,
  },
  {
    id: 43,
    name: "Natan Sibarani",
    position: "member",
    image: memberPlaceholder,
  },
  {
    id: 44,
    name: "Grace Butarbutar",
    position: "member",
    image: memberPlaceholder,
  },
  {
    id: 45,
    name: "Rafael Simarmata",
    position: "member",
    image: memberPlaceholder,
  },
  {
    id: 46,
    name: "Irene Sinambela",
    position: "member",
    image: memberPlaceholder,
  },
  {
    id: 47,
    name: "Matias Situmeang",
    position: "member",
    image: memberPlaceholder,
  },
  {
    id: 48,
    name: "Teresa Lumbanraja",
    position: "member",
    image: memberPlaceholder,
  },
];

const PAGE_SIZE = 12;

// ─── Animation Variants ──────────────────────────────────────────────────────

const cardVariant = (reduced: boolean) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: reduced ? 0 : 0.35, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: reduced ? 0 : 0.15 },
  },
});

// ─── Member Card Component ─────────────────────────────────────────────────

function MemberCard({
  member,
  positionLabel,
  photoAlt,
  index,
  reduced,
}: {
  member: Member;
  positionLabel: string;
  photoAlt: string;
  index: number;
  reduced: boolean;
}) {
  return (
    <motion.article
      animate="visible"
      aria-label={member.name + " - " + positionLabel}
      className="ns-surface flex min-w-0 flex-col items-center text-center"
      exit="exit"
      initial={false}
      variants={cardVariant(reduced)}
    >
      <div className="relative aspect-square w-28 max-w-full overflow-hidden rounded-2xl bg-surface sm:w-32">
        <Image
          fill
          alt={photoAlt}
          className="object-cover"
          priority={index < 6}
          sizes="(min-width: 640px) 8rem, 7rem"
          src={member.image}
          unoptimized={
            typeof member.image === "string" && member.image.startsWith("http")
          }
        />
      </div>
      <h2 className="ns-card-title mt-4">{member.name}</h2>
      <p className="mt-2 text-sm leading-6 text-secondary">{positionLabel}</p>
    </motion.article>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const MembersDirectory = ({ dbMembers }: { dbMembers: DbMember[] }) => {
  // Use DB members if available; fall back to static members
  const MEMBERS: Member[] =
    dbMembers.length > 0
      ? dbMembers.map((m) => ({
          id: m.id,
          name: m.name,
          position: m.position,
          image: m.image_url ?? memberPlaceholder,
        }))
      : STATIC_MEMBERS;

  const { messages: t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const searchRef = useRef<HTMLInputElement>(null);
  const reduced = useReducedMotion() ?? false;

  const filteredMembers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return MEMBERS;

    return MEMBERS.filter((member) =>
      member.name.toLowerCase().includes(query),
    );
  }, [searchQuery, MEMBERS]);

  // Reset visible count when search changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery]);

  const visibleMembers = filteredMembers.slice(0, visibleCount);
  const remainingCount = filteredMembers.length - visibleCount;
  const hasMore = remainingCount > 0;

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  }, []);

  return (
    <section
      aria-labelledby="members-heading"
      className="ns-section ns-container"
    >
      <div>
        <div className="flex flex-col gap-8">
          <header className="max-w-3xl">
            <h1 className="ns-title" id="members-heading">
              {t.members.titleStart}
              <span className="text-secondary">{t.members.titleEmphasis}</span>
            </h1>
            <p className="ns-copy mt-4">{t.members.description}</p>
          </header>

          <div className="w-full max-w-2xl">
            <label className="ns-label mb-2" htmlFor="members-search">
              {t.members.searchAria}
            </label>
            <Input
              ref={searchRef}
              aria-describedby="members-count"
              aria-label={t.members.searchAria}
              classNames={{
                input:
                  "text-base outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:appearance-none",
                inputWrapper:
                  "min-h-12 rounded-xl border border-control-border bg-surface shadow-none data-[hover=true]:bg-card group-data-[focus=true]:bg-surface group-data-[focus=true]:outline-2 group-data-[focus=true]:outline-ring group-data-[focus=true]:outline-offset-4",
              }}
              endContent={
                searchQuery ? (
                  <Button
                    aria-label={t.members.clearSearch}
                    className="text-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-ring focus-visible:outline-offset-4"
                    size="public-icon"
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setSearchQuery("");
                      searchRef.current?.focus();
                    }}
                  >
                    <IconX aria-hidden="true" className="size-5" />
                  </Button>
                ) : null
              }
              id="members-search"
              placeholder={t.members.searchPlaceholder}
              radius="lg"
              size="lg"
              startContent={
                <IconSearch
                  aria-hidden="true"
                  className="shrink-0 text-secondary"
                  size={20}
                  stroke={1.8}
                />
              }
              type="search"
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <p className="ns-caption mt-3" id="members-count" role="status">
              {t.members.count
                .replace("{filtered}", String(filteredMembers.length))
                .replace("{total}", String(MEMBERS.length))}
            </p>
          </div>
        </div>

        {/* ── Members Grid ── */}
        <AnimatePresence mode="wait">
          {visibleMembers.length > 0 ? (
            <motion.div
              key="grid"
              animate={{ opacity: 1 }}
              className="mt-6 grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3"
              exit={{ opacity: 0 }}
              initial={false}
              transition={{ duration: reduced ? 0 : 0.2 }}
            >
              {visibleMembers.map((member, index) => (
                <MemberCard
                  key={member.id}
                  index={index}
                  member={member}
                  photoAlt={t.members.photoAlt.replace("{name}", member.name)}
                  positionLabel={
                    t.members.positions[
                      member.position as keyof typeof t.members.positions
                    ] ?? member.position
                  }
                  reduced={reduced}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              animate={{ opacity: 1, y: 0 }}
              className="ns-empty mt-6 flex min-h-60 flex-col items-center justify-center rounded-2xl border border-border bg-surface"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0, y: reduced ? 0 : 20 }}
              transition={{ duration: reduced ? 0 : 0.3 }}
            >
              <IconUserOff
                aria-hidden="true"
                className="text-secondary"
                size={48}
                stroke={1.6}
              />
              <h2 className="ns-card-title mt-4">{t.members.notFoundTitle}</h2>
              <p className="ns-copy mt-2">{t.members.notFoundDescription}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Load More button ── */}
        {hasMore && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex flex-col items-center gap-3 text-center"
            initial={false}
            transition={{ duration: reduced ? 0 : 0.2 }}
          >
            <button
              className="ns-secondary flex-wrap"
              id="members-load-more"
              type="button"
              onClick={handleLoadMore}
            >
              {t.common.loadMore.replace(
                "{count}",
                String(Math.min(PAGE_SIZE, remainingCount)),
              )}
              <span className="text-sm">
                ({t.common.remaining.replace("{count}", String(remainingCount))}
                )
              </span>
            </button>
            <p className="ns-caption" role="status">
              {t.common.showingMembers
                .replace("{count}", String(visibleMembers.length))
                .replace("{total}", String(filteredMembers.length))}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default MembersDirectory;
