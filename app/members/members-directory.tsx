"use client";

import { useMemo, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { Input } from "@heroui/input";
import { IconSearch, IconUserOff, IconUsersGroup } from "@tabler/icons-react";

import memberPlaceholder from "@/public/images/member-placeholder.svg";

type Member = {
  id: number;
  name: string;
  position: string;
  image: StaticImageData;
};

const MEMBERS: Member[] = [
  {
    id: 1,
    name: "Daniel Manurung",
    position: "Pendeta",
    image: memberPlaceholder,
  },
  {
    id: 2,
    name: "Ruth Siahaan",
    position: "Ketua Jemaat",
    image: memberPlaceholder,
  },
  {
    id: 3,
    name: "Samuel Hutabarat",
    position: "Sekretaris",
    image: memberPlaceholder,
  },
  {
    id: 4,
    name: "Martha Simanjuntak",
    position: "Bendahara",
    image: memberPlaceholder,
  },
  {
    id: 5,
    name: "Yosua Tampubolon",
    position: "Pemimpin Sekolah Sabat",
    image: memberPlaceholder,
  },
  {
    id: 6,
    name: "Debora Lumbantoruan",
    position: "Ketua Diakon",
    image: memberPlaceholder,
  },
  {
    id: 7,
    name: "Elia Pasaribu",
    position: "Ketua Diakones",
    image: memberPlaceholder,
  },
  {
    id: 8,
    name: "Maria Sinaga",
    position: "Pemimpin Musik",
    image: memberPlaceholder,
  },
  {
    id: 9,
    name: "Paulus Nababan",
    position: "Pemimpin Pemuda Advent",
    image: memberPlaceholder,
  },
  {
    id: 10,
    name: "Hanna Sitohang",
    position: "Pemimpin Pelayanan Anak",
    image: memberPlaceholder,
  },
  {
    id: 11,
    name: "Andreas Sitorus",
    position: "Pemimpin Komunikasi",
    image: memberPlaceholder,
  },
  {
    id: 12,
    name: "Naomi Silalahi",
    position: "Pemimpin Pelayanan Wanita",
    image: memberPlaceholder,
  },
  {
    id: 13,
    name: "Timotius Purba",
    position: "Pemimpin Kesehatan",
    image: memberPlaceholder,
  },
  {
    id: 14,
    name: "Ester Gultom",
    position: "Guru Sekolah Sabat",
    image: memberPlaceholder,
  },
  {
    id: 15,
    name: "Jonathan Saragih",
    position: "Guru Sekolah Sabat",
    image: memberPlaceholder,
  },
  {
    id: 16,
    name: "Lydia Nainggolan",
    position: "Bendahara Sekolah Sabat",
    image: memberPlaceholder,
  },
  {
    id: 17,
    name: "Mikael Tampubolon",
    position: "Diakon",
    image: memberPlaceholder,
  },
  {
    id: 18,
    name: "Sarah Pardede",
    position: "Diakones",
    image: memberPlaceholder,
  },
  {
    id: 19,
    name: "Gabriel Simbolon",
    position: "Diakon",
    image: memberPlaceholder,
  },
  {
    id: 20,
    name: "Rachel Sihombing",
    position: "Diakones",
    image: memberPlaceholder,
  },
  {
    id: 21,
    name: "Yakobus Marpaung",
    position: "Anggota Jemaat",
    image: memberPlaceholder,
  },
  {
    id: 22,
    name: "Lea Tarigan",
    position: "Anggota Jemaat",
    image: memberPlaceholder,
  },
  {
    id: 23,
    name: "Petrus Manalu",
    position: "Anggota Jemaat",
    image: memberPlaceholder,
  },
  {
    id: 24,
    name: "Miriam Tobing",
    position: "Anggota Jemaat",
    image: memberPlaceholder,
  },
  {
    id: 25,
    name: "Markus Hasibuan",
    position: "Anggota Jemaat",
    image: memberPlaceholder,
  },
  {
    id: 26,
    name: "Elisabeth Panggabean",
    position: "Anggota Jemaat",
    image: memberPlaceholder,
  },
  {
    id: 27,
    name: "Filipus Pakpahan",
    position: "Anggota Jemaat",
    image: memberPlaceholder,
  },
  {
    id: 28,
    name: "Kezia Hutapea",
    position: "Anggota Jemaat",
    image: memberPlaceholder,
  },
  {
    id: 29,
    name: "Stefanus Siregar",
    position: "Anggota Jemaat",
    image: memberPlaceholder,
  },
  {
    id: 30,
    name: "Priskila Hutasoit",
    position: "Anggota Jemaat",
    image: memberPlaceholder,
  },
  {
    id: 31,
    name: "Yeremia Tambunan",
    position: "Anggota Jemaat",
    image: memberPlaceholder,
  },
  {
    id: 32,
    name: "Abigail Sagala",
    position: "Anggota Jemaat",
    image: memberPlaceholder,
  },
  {
    id: 33,
    name: "Natanael Malau",
    position: "Anggota Jemaat",
    image: memberPlaceholder,
  },
  {
    id: 34,
    name: "Yohana Damanik",
    position: "Anggota Jemaat",
    image: memberPlaceholder,
  },
  {
    id: 35,
    name: "Barnabas Lubis",
    position: "Anggota Jemaat",
    image: memberPlaceholder,
  },
  {
    id: 36,
    name: "Clara Sitanggang",
    position: "Anggota Jemaat",
    image: memberPlaceholder,
  },
  {
    id: 37,
    name: "Yusuf Panjaitan",
    position: "Anggota Jemaat",
    image: memberPlaceholder,
  },
  {
    id: 38,
    name: "Febe Munthe",
    position: "Anggota Jemaat",
    image: memberPlaceholder,
  },
  {
    id: 39,
    name: "Titus Samosir",
    position: "Anggota Jemaat",
    image: memberPlaceholder,
  },
  {
    id: 40,
    name: "Agnes Rumapea",
    position: "Anggota Jemaat",
    image: memberPlaceholder,
  },
  {
    id: 41,
    name: "Lukas Siagian",
    position: "Anggota Jemaat",
    image: memberPlaceholder,
  },
  {
    id: 42,
    name: "Dina Pakpahan",
    position: "Anggota Jemaat",
    image: memberPlaceholder,
  },
  {
    id: 43,
    name: "Natan Sibarani",
    position: "Anggota Jemaat",
    image: memberPlaceholder,
  },
  {
    id: 44,
    name: "Grace Butarbutar",
    position: "Anggota Jemaat",
    image: memberPlaceholder,
  },
  {
    id: 45,
    name: "Rafael Simarmata",
    position: "Anggota Jemaat",
    image: memberPlaceholder,
  },
  {
    id: 46,
    name: "Irene Sinambela",
    position: "Anggota Jemaat",
    image: memberPlaceholder,
  },
  {
    id: 47,
    name: "Matias Situmeang",
    position: "Anggota Jemaat",
    image: memberPlaceholder,
  },
  {
    id: 48,
    name: "Teresa Lumbanraja",
    position: "Anggota Jemaat",
    image: memberPlaceholder,
  },
];

const MembersDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return MEMBERS;
    }

    return MEMBERS.filter((member) =>
      member.name.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  return (
    <section
      aria-labelledby="members-heading"
      className="px-4 py-12 sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/80 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-primary/70 backdrop-blur-sm dark:border-white/10 dark:bg-white/8 dark:text-white/70">
              <IconUsersGroup size={16} stroke={1.8} />
              Direktori Jemaat
            </span>
            <h1
              id="members-heading"
              className="mt-6 text-4xl font-black tracking-tight text-primary sm:text-5xl dark:text-white"
            >
              Anggota<span className="text-secondary"> Jemaat </span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground sm:text-base dark:text-white">
              Daftar anggota dan pelayan GMAHK Villa Nusa Indah tersusun dalam
              grid yang mudah dipindai. Gunakan pencarian untuk menemukan nama
              anggota tertentu.
            </p>
          </div>

          <div className="w-full lg:max-w-md">
            <Input
              aria-label="Cari nama anggota"
              classNames={{
                input: "text-sm",
                inputWrapper:
                  "h-14 border border-primary/10 bg-white/90 shadow-[0_16px_40px_rgba(1,75,63,0.08)] dark:border-white/10 dark:bg-white/10",
              }}
              isClearable
              placeholder="Cari nama anggota..."
              radius="full"
              size="lg"
              startContent={
                <IconSearch
                  className="text-primary/55 dark:text-white/60"
                  size={20}
                  stroke={1.8}
                />
              }
              type="search"
              value={searchQuery}
              onClear={() => setSearchQuery("")}
              onValueChange={setSearchQuery}
            />
            <p className="mt-3 text-right text-xs font-medium text-foreground dark:text-white">
              {filteredMembers.length} dari {MEMBERS.length} anggota
            </p>
          </div>
        </div>

        {filteredMembers.length > 0 ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {filteredMembers.map((member) => (
              <article
                key={member.id}
                className="group flex flex-col items-center overflow-hidden rounded-[26px] border border-primary/10 bg-white/80 p-5 text-center shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_60px_rgba(1,75,63,0.14)] dark:border-white/10 dark:bg-white/8 dark:shadow-[0_22px_55px_rgba(2,6,23,0.26)]"
              >
                <div className="relative h-28 w-28 overflow-hidden rounded-[20px] bg-primary-muted shadow-[0_12px_28px_rgba(1,75,63,0.12)] sm:h-32 sm:w-32 dark:bg-white/10">
                  <Image
                    fill
                    alt={`Foto ${member.name}`}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={member.id <= 8}
                    sizes="(min-width: 640px) 8rem, 7rem"
                    src={member.image}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary/18 to-transparent dark:from-black/24" />
                </div>

                <div className="px-1 pt-4">
                  <h2 className="text-lg font-bold leading-tight text-primary dark:text-white">
                    {member.name}
                  </h2>
                  <p className="mt-2 inline-flex rounded-full border border-primary/10 bg-secondary-muted px-3 py-1 text-xs font-semibold text-primary dark:border-white/10 dark:bg-secondary/12 dark:text-secondary">
                    {member.position}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-10 flex min-h-80 flex-col items-center justify-center rounded-[26px] border border-dashed border-primary/20 bg-white/70 px-6 text-center dark:border-white/16 dark:bg-white/8">
            <IconUserOff
              className="text-primary/50 dark:text-white/54"
              size={48}
              stroke={1.6}
            />
            <h2 className="mt-5 text-xl font-bold text-primary dark:text-white">
              Anggota tidak ditemukan
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-foreground dark:text-white">
              Coba gunakan ejaan nama lain atau hapus kata kunci pencarian.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MembersDirectory;
