"use client";

import { useState, useTransition } from "react";
import {
  IconBook2,
  IconCalendarEvent,
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconCoffee,
  IconDeviceFloppy,
  IconLoader2,
  IconMicrophone2,
  IconMusic,
  IconPackage,
  IconScanPosition,
  IconSparkles,
  IconUser,
  IconUsersGroup,
} from "@tabler/icons-react";
import type { Icon as TablerIcon } from "@tabler/icons-react";
import { upsertAllRundownParticipants } from "../actions";
import type { RUNDOWN_ITEMS } from "@/constants/rundown";

/** Map from the serializable string key stored in RUNDOWN_ITEMS to the actual icon component. */
const RUNDOWN_ICON_MAP: Record<string, TablerIcon> = {
  IconBook2,
  IconCoffee,
  IconMicrophone2,
  IconMusic,
  IconPackage,
  IconScanPosition,
  IconSparkles,
  IconUsersGroup,
};

// Derive a stable snake_case key from a title/string
function toKey(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

type Props = {
  rundownItems: typeof RUNDOWN_ITEMS;
  dbLookup: Record<string, Record<string, string>>;
};

type ServiceState = {
  [serviceKey: string]: {
    [roleKey: string]: string;
  };
};

export default function RundownForm({ rundownItems, dbLookup }: Props) {
  // Initialize local state from DB (fall back to constants participant name)
  const [state, setState] = useState<ServiceState>(() => {
    const init: ServiceState = {};
    for (const item of rundownItems) {
      const sk = toKey(item.title);
      init[sk] = {};
      for (const p of item.participants) {
        const rk = toKey(p.rundown);
        init[sk][rk] = dbLookup[sk]?.[rk] ?? p.participant;
      }
    }
    return init;
  });

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    // First section open by default
    const init: Record<string, boolean> = {};
    rundownItems.forEach((item, i) => {
      init[toKey(item.title)] = i === 0;
    });
    return init;
  });

  const [savedSections, setSavedSections] = useState<Record<string, boolean>>({});
  const [globalSaved, setGlobalSaved] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (serviceKey: string, roleKey: string, value: string) => {
    setState((prev) => ({
      ...prev,
      [serviceKey]: { ...prev[serviceKey], [roleKey]: value },
    }));
    setSavedSections((prev) => ({ ...prev, [serviceKey]: false }));
    setGlobalSaved(false);
  };

  const handleSaveSection = (serviceKey: string) => {
    const section = state[serviceKey];
    const payload = Object.entries(section).map(([roleKey, participantName]) => ({
      service_key: serviceKey,
      role_key: roleKey,
      participant_name: participantName,
    }));

    startTransition(async () => {
      try {
        await upsertAllRundownParticipants(payload);
        setSavedSections((prev) => ({ ...prev, [serviceKey]: true }));
        setTimeout(() => setSavedSections((prev) => ({ ...prev, [serviceKey]: false })), 2500);
      } catch (e: unknown) {
        setGlobalError(e instanceof Error ? e.message : "Terjadi kesalahan");
      }
    });
  };

  const handleSaveAll = () => {
    const payload = Object.entries(state).flatMap(([serviceKey, roles]) =>
      Object.entries(roles).map(([roleKey, participantName]) => ({
        service_key: serviceKey,
        role_key: roleKey,
        participant_name: participantName,
      })),
    );

    startTransition(async () => {
      try {
        setGlobalError(null);
        await upsertAllRundownParticipants(payload);
        setGlobalSaved(true);
        setTimeout(() => setGlobalSaved(false), 2500);
      } catch (e: unknown) {
        setGlobalError(e instanceof Error ? e.message : "Terjadi kesalahan");
      }
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-emerald-400">
            <IconCalendarEvent size={20} stroke={1.8} />
            <span className="text-xs font-semibold uppercase tracking-[0.22em]">
              Worship Rundown
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-white">
            Peserta Ibadah
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Edit nama peserta untuk setiap bagian ibadah. Perubahan akan langsung tampil di website.
          </p>
        </div>
        <button
          id="save-all-rundown"
          onClick={handleSaveAll}
          disabled={isPending}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(1,75,63,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(1,75,63,0.45)] disabled:opacity-60 disabled:translate-y-0"
        >
          {isPending ? (
            <IconLoader2 size={16} className="animate-spin" />
          ) : globalSaved ? (
            <IconCheck size={16} />
          ) : (
            <IconDeviceFloppy size={16} />
          )}
          {globalSaved ? "Tersimpan!" : "Simpan Semua"}
        </button>
      </div>

      {/* Error */}
      {globalError && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {globalError}
        </div>
      )}

      {/* Sections */}
      <div className="space-y-3">
        {rundownItems.map((item) => {
          const sk = toKey(item.title);
          const isOpen = openSections[sk];
          const isSaved = savedSections[sk];
          const Icon = RUNDOWN_ICON_MAP[item.icon] ?? IconUser;

          return (
            <div
              key={sk}
              className="overflow-hidden rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm"
            >
              {/* Section header */}
              <button
                type="button"
                id={`section-${sk}`}
                onClick={() => toggleSection(sk)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-white/4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700/20 text-emerald-400">
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-white/40">{item.time} · {item.participants.length} peserta</p>
                </div>
                <div className="flex items-center gap-2">
                  {isSaved && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                      <IconCheck size={10} /> Tersimpan
                    </span>
                  )}
                  {isOpen ? (
                    <IconChevronUp size={18} className="text-white/40" />
                  ) : (
                    <IconChevronDown size={18} className="text-white/40" />
                  )}
                </div>
              </button>

              {/* Section body */}
              {isOpen && (
                <div className="border-t border-white/8 px-5 py-4">
                  <div className="space-y-3">
                    {item.participants.map((p) => {
                      const rk = toKey(p.rundown);
                      return (
                        <div key={rk} className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/6 text-white/30">
                            <IconUser size={14} stroke={1.8} />
                          </div>
                          <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                            <label
                              htmlFor={`participant-${sk}-${rk}`}
                              className="w-full text-xs font-medium text-white/50 sm:w-44 sm:shrink-0"
                            >
                              {p.rundown}
                            </label>
                            <input
                              id={`participant-${sk}-${rk}`}
                              type="text"
                              value={state[sk]?.[rk] ?? ""}
                              onChange={(e) => handleChange(sk, rk, e.target.value)}
                              placeholder={p.participant}
                              className="flex-1 rounded-xl border border-white/10 bg-white/6 px-3 py-2 text-sm text-white placeholder-white/25 outline-none transition-all focus:border-emerald-500/50 focus:bg-white/10 focus:ring-2 focus:ring-emerald-500/15"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 flex justify-end">
                    <button
                      id={`save-section-${sk}`}
                      type="button"
                      onClick={() => handleSaveSection(sk)}
                      disabled={isPending}
                      className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-400 transition-all hover:bg-emerald-500/20 disabled:opacity-50"
                    >
                      {isPending ? (
                        <IconLoader2 size={13} className="animate-spin" />
                      ) : isSaved ? (
                        <IconCheck size={13} />
                      ) : (
                        <IconDeviceFloppy size={13} />
                      )}
                      {isSaved ? "Tersimpan!" : "Simpan bagian ini"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-white/25 pb-4">
        Perubahan akan langsung tampil di halaman utama website
      </p>
    </div>
  );
}
