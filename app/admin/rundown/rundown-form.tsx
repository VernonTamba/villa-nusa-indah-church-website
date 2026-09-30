"use client";

import type { Icon as TablerIcon } from "@tabler/icons-react";
import type { RUNDOWN_ITEMS } from "@/constants/rundown";

import { useState, useTransition } from "react";
import {
  IconBook2,
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
  IconTag,
  IconUser,
  IconUsersGroup,
} from "@tabler/icons-react";

import { upsertAllRundownParticipants } from "../actions";

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
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

type Props = {
  rundownItems: typeof RUNDOWN_ITEMS;
  dbLookup: Record<string, Record<string, string>>;
  labelLookup: Record<string, Record<string, string>>;
};

type RoleState = {
  participantName: string;
  roleLabel: string;
};

type ServiceState = {
  [serviceKey: string]: {
    [roleKey: string]: RoleState;
  };
};

export default function RundownForm({
  rundownItems,
  dbLookup,
  labelLookup,
}: Props) {
  // Initialize local state from DB (fall back to constants participant name / role label)
  const [state, setState] = useState<ServiceState>(() => {
    const init: ServiceState = {};

    for (const item of rundownItems) {
      const sk = toKey(item.title);

      init[sk] = {};
      for (const p of item.participants) {
        const rk = toKey(p.rundown);

        init[sk][rk] = {
          participantName: dbLookup[sk]?.[rk] ?? p.participant,
          roleLabel: labelLookup[sk]?.[rk] ?? p.rundown,
        };
      }
    }

    return init;
  });

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () => {
      // First section open by default
      const init: Record<string, boolean> = {};

      rundownItems.forEach((item, i) => {
        init[toKey(item.title)] = i === 0;
      });

      return init;
    },
  );

  const [savedSections, setSavedSections] = useState<Record<string, boolean>>(
    {},
  );
  const [globalSaved, setGlobalSaved] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleParticipantChange = (
    serviceKey: string,
    roleKey: string,
    value: string,
  ) => {
    setState((prev) => ({
      ...prev,
      [serviceKey]: {
        ...prev[serviceKey],
        [roleKey]: { ...prev[serviceKey][roleKey], participantName: value },
      },
    }));
    setSavedSections((prev) => ({ ...prev, [serviceKey]: false }));
    setGlobalSaved(false);
  };

  const handleRoleLabelChange = (
    serviceKey: string,
    roleKey: string,
    value: string,
  ) => {
    setState((prev) => ({
      ...prev,
      [serviceKey]: {
        ...prev[serviceKey],
        [roleKey]: { ...prev[serviceKey][roleKey], roleLabel: value },
      },
    }));
    setSavedSections((prev) => ({ ...prev, [serviceKey]: false }));
    setGlobalSaved(false);
  };

  const buildPayload = (serviceKey: string) => {
    return Object.entries(state[serviceKey]).map(([roleKey, role]) => ({
      service_key: serviceKey,
      role_key: roleKey,
      participant_name: role.participantName,
      role_label: role.roleLabel,
    }));
  };

  const handleSaveSection = (serviceKey: string) => {
    const payload = buildPayload(serviceKey);

    startTransition(async () => {
      try {
        await upsertAllRundownParticipants(payload);
        setSavedSections((prev) => ({ ...prev, [serviceKey]: true }));
        setTimeout(
          () => setSavedSections((prev) => ({ ...prev, [serviceKey]: false })),
          2500,
        );
      } catch (e: unknown) {
        setGlobalError(e instanceof Error ? e.message : "Terjadi kesalahan");
      }
    });
  };

  const handleSaveAll = () => {
    const payload = Object.keys(state).flatMap((serviceKey) =>
      buildPayload(serviceKey),
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
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="ns-title">Peserta Ibadah</h1>
          <p className="ns-copy mt-3">
            Edit nama peran dan peserta untuk setiap bagian ibadah. Perubahan
            akan langsung tampil di website.
          </p>
        </div>
        <button
          aria-live="polite"
          className="ns-primary shrink-0"
          disabled={isPending}
          id="save-all-rundown"
          onClick={handleSaveAll}
        >
          {isPending ? (
            <IconLoader2 className="animate-spin" size={16} />
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
        <div className="ns-alert" data-tone="danger" role="alert">
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
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              {/* Section header */}
              <button
                aria-controls={`section-body-${sk}`}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-surface"
                id={`section-${sk}`}
                type="button"
                onClick={() => toggleSection(sk)}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card text-success">
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.time} · {item.participants.length} peserta
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {isSaved && (
                    <span className="flex items-center gap-1 rounded-full bg-card px-2 py-0.5 text-sm font-semibold text-success">
                      <IconCheck size={10} /> Tersimpan
                    </span>
                  )}
                  {isOpen ? (
                    <IconChevronUp
                      className="text-muted-foreground"
                      size={18}
                    />
                  ) : (
                    <IconChevronDown
                      className="text-muted-foreground"
                      size={18}
                    />
                  )}
                </div>
              </button>

              {/* Section body */}
              {isOpen && (
                <div
                  className="border-t border-border px-5 py-6"
                  id={`section-body-${sk}`}
                >
                  {/* Column headers */}
                  <div className="mb-2 hidden sm:grid sm:grid-cols-2 sm:gap-3 sm:pl-11">
                    <span className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                      <IconTag size={10} /> Nama Peran
                    </span>
                    <span className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                      <IconUser size={10} /> Peserta
                    </span>
                  </div>
                  <div className="space-y-3">
                    {item.participants.map((p) => {
                      const rk = toKey(p.rundown);
                      const roleState = state[sk]?.[rk];

                      return (
                        <div key={rk} className="flex items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-muted-foreground mt-1.5">
                            <IconUser size={14} stroke={1.8} />
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col gap-2 sm:grid sm:grid-cols-2 sm:gap-3">
                            {/* Role label input */}
                            <div className="flex flex-col gap-1">
                              <label
                                className="ns-label sm:sr-only"
                                htmlFor={`role-label-${sk}-${rk}`}
                              >
                                Nama Peran
                              </label>
                              <input
                                className="ns-field"
                                id={`role-label-${sk}-${rk}`}
                                placeholder={p.rundown}
                                type="text"
                                value={roleState?.roleLabel ?? ""}
                                onChange={(e) =>
                                  handleRoleLabelChange(sk, rk, e.target.value)
                                }
                              />
                            </div>
                            {/* Participant name input */}
                            <div className="flex flex-col gap-1">
                              <label
                                className="ns-label sm:sr-only"
                                htmlFor={`participant-${sk}-${rk}`}
                              >
                                Peserta
                              </label>
                              <input
                                className="ns-field"
                                id={`participant-${sk}-${rk}`}
                                placeholder={p.participant}
                                type="text"
                                value={roleState?.participantName ?? ""}
                                onChange={(e) =>
                                  handleParticipantChange(
                                    sk,
                                    rk,
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 flex justify-end">
                    <button
                      className="ns-secondary"
                      disabled={isPending}
                      id={`save-section-${sk}`}
                      type="button"
                      onClick={() => handleSaveSection(sk)}
                    >
                      {isPending ? (
                        <IconLoader2 className="animate-spin" size={13} />
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

      <p className="text-center text-sm text-muted-foreground pb-4">
        Perubahan akan langsung tampil di halaman utama website
      </p>
    </div>
  );
}
