"use client";

import type { MemberRow } from "./page";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import {
  IconArrowsSort,
  IconCheck,
  IconDeviceFloppy,
  IconGripVertical,
  IconLoader2,
  IconPencil,
  IconPhoto,
  IconPlus,
  IconSearch,
  IconTrash,
  IconUsersGroup,
  IconX,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import {
  addMember,
  deleteMember,
  updateMember,
  updateMemberImage,
  updateMembersOrder,
} from "../actions";

import { AccessibleDialog } from "@/components/ui/accessible-dialog";

// Position options matching the existing i18n keys
const POSITIONS = [
  { value: "pastor", label: "Pendeta" },
  { value: "headElder", label: "Ketua Jemaat" },
  { value: "secretary", label: "Sekretaris" },
  { value: "treasurer", label: "Bendahara" },
  { value: "sabbathSchoolLeader", label: "Pemimpin Sekolah Sabat" },
  { value: "headDeacon", label: "Ketua Diakon" },
  { value: "headDeaconess", label: "Ketua Diakones" },
  { value: "musicLeader", label: "Pemimpin Musik" },
  { value: "ayLeader", label: "Pemimpin Pemuda Advent" },
  { value: "childrenLeader", label: "Pemimpin Pelayanan Anak" },
  { value: "communicationLeader", label: "Pemimpin Komunikasi" },
  { value: "womenLeader", label: "Pemimpin Pelayanan Wanita" },
  { value: "healthLeader", label: "Pemimpin Kesehatan" },
  { value: "sabbathSchoolTeacher", label: "Guru Sekolah Sabat" },
  { value: "sabbathSchoolTreasurer", label: "Bendahara Sekolah Sabat" },
  { value: "deacon", label: "Diakon" },
  { value: "deaconess", label: "Diakones" },
  { value: "member", label: "Anggota Jemaat" },
];

function getPositionLabel(value: string) {
  return POSITIONS.find((p) => p.value === value)?.label ?? value;
}

// ─── Error Helper ─────────────────────────────────────────────────────────────

const MAX_IMAGE_SIZE_MB = 4;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

/**
 * Converts an error (which may include HTTP status codes) into a
 * user-friendly Indonesian message.
 */
function parseUploadError(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);

  // Match status codes embedded in the error message
  if (
    msg.includes("413") ||
    /too large|entity too large|body.*limit/i.test(msg)
  ) {
    return `Gagal upload: File terlalu besar (413). Maksimal ukuran foto adalah ${MAX_IMAGE_SIZE_MB} MB.`;
  }
  if (msg.includes("400") || /bad request/i.test(msg)) {
    return "Gagal upload: Permintaan tidak valid (400). Pastikan format file didukung dan coba lagi.";
  }
  if (msg.includes("401") || /unauthorized/i.test(msg)) {
    return "Gagal upload: Sesi tidak valid (401). Silakan login ulang.";
  }
  if (msg.includes("403") || /forbidden/i.test(msg)) {
    return "Gagal upload: Akses ditolak (403). Anda tidak memiliki izin.";
  }
  if (msg.includes("404") || /not found/i.test(msg)) {
    return "Gagal upload: Sumber daya tidak ditemukan (404). Hubungi administrator.";
  }
  if (msg.includes("500") || /internal server/i.test(msg)) {
    return "Gagal upload: Terjadi kesalahan di server (500). Coba lagi beberapa saat.";
  }
  if (msg.includes("503") || /service unavailable/i.test(msg)) {
    return "Gagal upload: Server sedang tidak tersedia (503). Coba lagi nanti.";
  }

  // Fall back to the raw message if no code is matched
  return msg || "Terjadi kesalahan yang tidak diketahui.";
}

// ─── Toast System ─────────────────────────────────────────────────────────────

type Toast = { id: number; message: string; type: "success" | "error" };

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: number) => void;
}) {
  return (
    <div className="pointer-events-none fixed bottom-5 left-5 right-5 sm:left-auto sm:max-w-md z-[100] flex flex-col gap-2 items-end">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            className={`pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-2xl ${
              toast.type === "success"
                ? "border-success bg-background text-success"
                : "border-destructive bg-background text-destructive"
            }`}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            role={toast.type === "error" ? "alert" : "status"}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          >
            {toast.type === "success" ? (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-card">
                <IconCheck size={12} />
              </span>
            ) : (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface">
                <IconX size={12} />
              </span>
            )}
            {toast.message}
            <button
              aria-label="Tutup"
              className="ml-1 flex h-11 w-11 shrink-0 items-center justify-center text-muted-foreground hover:text-muted-foreground transition-colors"
              onClick={() => onRemove(toast.id)}
            >
              <IconX size={13} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Shimmer Skeleton Card ────────────────────────────────────────────────────

function MemberCardSkeleton() {
  return (
    <div className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* shimmer overlay */}
      <div
        className="absolute inset-0 -translate-x-full motion-safe:animate-[shimmer_1.6s_infinite]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
        }}
      />
      <div className="h-12 w-12 shrink-0 rounded-xl bg-surface" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-2/3 rounded-full bg-surface" />
        <div className="h-2.5 w-1/2 rounded-full bg-surface" />
      </div>
    </div>
  );
}

// ─── Animated Modal Wrapper ───────────────────────────────────────────────────

// ─── Add Member Modal ─────────────────────────────────────────────────────────

function AddMemberModal({
  onClose,
  onAdded,
  reduced,
}: {
  onClose: () => void;
  onAdded: (m: MemberRow) => void;
  reduced: boolean;
}) {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("member");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError(
        `Ukuran foto terlalu besar. Maksimal ${MAX_IMAGE_SIZE_MB} MB (file Anda: ${(file.size / 1024 / 1024).toFixed(1)} MB).`,
      );
      e.target.value = "";

      return;
    }
    setError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nama tidak boleh kosong");

      return;
    }
    setError(null);

    const fd = new FormData();

    fd.append("name", name.trim());
    fd.append("position", position);
    if (imageFile) fd.append("image", imageFile);

    startTransition(async () => {
      try {
        const real = await addMember(fd);

        // Use the real DB row so edits immediately after adding work correctly
        onAdded({
          id: real.id,
          name: real.name,
          position: real.position,
          image_url: real.image_url ?? imagePreview,
          display_order: real.display_order,
        });
        onClose();
      } catch (e: unknown) {
        setError(parseUploadError(e));
      }
    });
  };

  return (
    <AccessibleDialog
      open
      className="left-1/2 top-1/2 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl"
      title="Tambah Anggota Baru"
      onClose={onClose}
    >
      <form className="p-6 space-y-4" onSubmit={handleSubmit}>
        {/* Photo upload */}
        <div className="flex flex-col items-center gap-3">
          <button
            aria-label="Pilih gambar"
            className="relative h-24 w-24 overflow-hidden rounded-2xl border-2 border-dashed border-border bg-surface cursor-pointer hover:border-success transition-colors"
            type="button"
            onClick={() => fileRef.current?.click()}
          >
            {imagePreview ? (
              <Image
                fill
                alt="Preview"
                className="object-cover"
                src={imagePreview}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground">
                <IconPhoto size={24} stroke={1.5} />
                <span className="text-sm">Upload foto</span>
              </div>
            )}
          </button>
          <input
            ref={fileRef}
            accept="image/*"
            className="hidden"
            id="new-member-image"
            type="file"
            onChange={handleImageChange}
          />
          <button
            className="ns-secondary"
            type="button"
            onClick={() => fileRef.current?.click()}
          >
            {imagePreview ? "Ganti foto" : "Pilih foto (opsional)"}
          </button>
        </div>

        {/* Name */}
        <div className="space-y-1.5">
          <label className="ns-label" htmlFor="new-member-name">
            Nama Lengkap *
          </label>
          <input
            required
            className="ns-field"
            id="new-member-name"
            placeholder="Masukkan nama"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Position */}
        <div className="space-y-1.5">
          <label className="ns-label" htmlFor="new-member-position">
            Jabatan *
          </label>
          <select
            className="ns-field"
            id="new-member-position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          >
            {POSITIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className="ns-alert"
              data-tone="danger"
              exit={{ opacity: 0, y: -6 }}
              initial={{ opacity: 0, y: -6 }}
              role="alert"
              transition={{ duration: reduced ? 0 : 0.2 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="flex gap-3 pt-2">
          <button
            className="ns-secondary flex-1"
            type="button"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            className="ns-primary flex-1"
            disabled={isPending}
            id="add-member-submit"
            type="submit"
          >
            {isPending ? (
              <IconLoader2 className="animate-spin" size={15} />
            ) : (
              <IconPlus size={15} />
            )}
            {isPending ? "Menyimpan..." : "Tambah"}
          </button>
        </div>
      </form>
    </AccessibleDialog>
  );
}

// ─── Edit Member Modal ────────────────────────────────────────────────────────

function EditMemberModal({
  member,
  onClose,
  onUpdated,
  reduced,
}: {
  member: MemberRow;
  onClose: () => void;
  onUpdated: (m: MemberRow) => void;
  reduced: boolean;
}) {
  const [name, setName] = useState(member.name);
  const [position, setPosition] = useState(member.position);
  const [imagePreview, setImagePreview] = useState<string | null>(
    member.image_url,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError(
        `Ukuran foto terlalu besar. Maksimal ${MAX_IMAGE_SIZE_MB} MB (file Anda: ${(file.size / 1024 / 1024).toFixed(1)} MB).`,
      );
      e.target.value = "";

      return;
    }
    setError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nama tidak boleh kosong");

      return;
    }
    setError(null);

    startTransition(async () => {
      try {
        await updateMember(member.id, { name: name.trim(), position });

        let finalImageUrl = member.image_url; // keep existing URL by default

        if (imageFile) {
          // Must use FormData — Next.js cannot serialize File as a plain argument
          const fd = new FormData();

          fd.append("id", member.id);
          fd.append("image", imageFile);
          const result = await updateMemberImage(fd);

          finalImageUrl = result.publicUrl;
        }

        onUpdated({
          ...member,
          name: name.trim(),
          position,
          image_url: finalImageUrl,
        });
        onClose();
      } catch (e: unknown) {
        setError(parseUploadError(e));
      }
    });
  };

  return (
    <AccessibleDialog
      open
      className="left-1/2 top-1/2 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl"
      title="Edit Anggota"
      onClose={onClose}
    >
      <form className="p-6 space-y-4" onSubmit={handleSubmit}>
        {/* Photo */}
        <div className="flex flex-col items-center gap-3">
          <button
            aria-label="Pilih gambar"
            className="relative h-24 w-24 overflow-hidden rounded-2xl border-2 border-dashed border-border bg-surface cursor-pointer hover:border-success transition-colors"
            type="button"
            onClick={() => fileRef.current?.click()}
          >
            {imagePreview ? (
              <Image
                fill
                alt="Preview"
                className="object-cover"
                src={imagePreview}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground">
                <IconPhoto size={24} stroke={1.5} />
                <span className="text-sm">Upload foto</span>
              </div>
            )}
          </button>
          <input
            ref={fileRef}
            accept="image/*"
            className="hidden"
            id="edit-member-image"
            type="file"
            onChange={handleImageChange}
          />
          <button
            className="ns-secondary"
            type="button"
            onClick={() => fileRef.current?.click()}
          >
            {imagePreview ? "Ganti foto" : "Upload foto"}
          </button>
        </div>

        {/* Name */}
        <div className="space-y-1.5">
          <label className="ns-label" htmlFor="edit-member-name">
            Nama Lengkap
          </label>
          <input
            required
            className="ns-field"
            id="edit-member-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Position */}
        <div className="space-y-1.5">
          <label className="ns-label" htmlFor="edit-member-position">
            Jabatan
          </label>
          <select
            className="ns-field"
            id="edit-member-position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          >
            {POSITIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className="ns-alert"
              data-tone="danger"
              exit={{ opacity: 0, y: -6 }}
              initial={{ opacity: 0, y: -6 }}
              role="alert"
              transition={{ duration: reduced ? 0 : 0.2 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="flex gap-3 pt-2">
          <button
            className="ns-secondary flex-1"
            type="button"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            className="ns-primary flex-1"
            disabled={isPending}
            id="edit-member-submit"
            type="submit"
          >
            {isPending ? (
              <IconLoader2 className="animate-spin" size={15} />
            ) : (
              <IconDeviceFloppy size={15} />
            )}
            {isPending ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </AccessibleDialog>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

let toastCounter = 0;

export default function MembersManager({
  initialMembers,
}: {
  initialMembers: MemberRow[];
}) {
  const [members, setMembers] = useState<MemberRow[]>(initialMembers);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editMember, setEditMember] = useState<MemberRow | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const reduced = useReducedMotion() ?? false;

  // ── Reorder mode state ────────────────────────────────────────────────────
  const [isReordering, setIsReordering] = useState(false);
  const [reorderSaved, setReorderSaved] = useState(false);
  const [reorderError, setReorderError] = useState<string | null>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      getPositionLabel(m.position).toLowerCase().includes(search.toLowerCase()),
  );

  // ── Toast helpers ─────────────────────────────────────────────────────────
  const pushToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    const id = ++toastCounter;

    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3200,
    );
  };

  const removeToast = (id: number) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setConfirmDeleteId(null);
    startTransition(async () => {
      try {
        await deleteMember(id);
        setMembers((prev) => prev.filter((m) => m.id !== id));
        setDeleteError(null);
        pushToast("Anggota berhasil dihapus");
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Gagal menghapus";

        setDeleteError(msg);
        pushToast(msg, "error");
      } finally {
        setDeletingId(null);
      }
    });
  };

  const handleAdded = (m: MemberRow) => {
    setMembers((prev) => [...prev, m]);
    setSavedId(m.id);
    setTimeout(() => setSavedId(null), 2000);
    pushToast(`${m.name} berhasil ditambahkan`);
  };

  const handleUpdated = (m: MemberRow) => {
    setMembers((prev) => prev.map((x) => (x.id === m.id ? m : x)));
    setSavedId(m.id);
    setTimeout(() => setSavedId(null), 2000);
    pushToast(`${m.name} berhasil diperbarui`);
  };

  // ── Drag handlers ─────────────────────────────────────────────────────────
  const handleDragStart = (index: number) => {
    dragItem.current = index;
    setDraggingIndex(index);
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
    if (dragItem.current === null || dragItem.current === index) return;
    setMembers((prev) => {
      const next = [...prev];
      const dragged = next.splice(dragItem.current!, 1)[0];

      next.splice(index, 0, dragged);
      dragItem.current = index;

      return next;
    });
  };

  const handleDragEnd = () => {
    dragItem.current = null;
    dragOverItem.current = null;
    setDraggingIndex(null);
    setReorderSaved(false);
  };

  const handleSaveOrder = () => {
    const updates = members.map((m, i) => ({ id: m.id, display_order: i }));

    startTransition(async () => {
      try {
        setReorderError(null);
        await updateMembersOrder(updates);
        // Update local display_order to match saved values
        setMembers((prev) => prev.map((m, i) => ({ ...m, display_order: i })));
        setReorderSaved(true);
        pushToast("Urutan anggota berhasil disimpan");
        setTimeout(() => setReorderSaved(false), 2500);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Gagal menyimpan urutan";

        setReorderError(msg);
        pushToast(msg, "error");
      }
    });
  };

  const handleToggleReorder = () => {
    setIsReordering((v) => !v);
    setReorderSaved(false);
    setReorderError(null);
    setSearch("");
    setConfirmDeleteId(null);
  };

  // ── Animation variants ────────────────────────────────────────────────────
  const cardIn = (i: number) => ({
    initial: false,
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: reduced ? 0 : Math.min(i * 0.04, 0.5),
        duration: reduced ? 0 : 0.38,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: reduced ? 1 : 0.94,
      transition: { duration: reduced ? 0 : 0.2 },
    },
  });

  return (
    <>
      {/* Toast container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <AnimatePresence>
        {showAdd && (
          <AddMemberModal
            key="add-modal"
            reduced={reduced}
            onAdded={handleAdded}
            onClose={() => setShowAdd(false)}
          />
        )}
        {editMember && (
          <EditMemberModal
            key="edit-modal"
            member={editMember}
            reduced={reduced}
            onClose={() => setEditMember(null)}
            onUpdated={handleUpdated}
          />
        )}
      </AnimatePresence>

      {/* Shimmer keyframe injection */}
      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>

      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between"
          initial={false}
          transition={{ duration: reduced ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <h1 className="ns-title">Kelola Anggota</h1>
            <p className="ns-copy mt-3">
              Tambah, edit, atau hapus anggota jemaat. Total: {members.length}{" "}
              anggota.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className={`ns-secondary ${
                isReordering
                  ? "border-control-border bg-surface text-secondary hover:bg-surface"
                  : "border-border bg-surface text-muted-foreground hover:bg-surface hover:text-foreground"
              }`}
              id="reorder-members-btn"
              onClick={handleToggleReorder}
            >
              <IconArrowsSort size={16} />
              {isReordering ? "Selesai Atur" : "Atur Urutan"}
            </button>
            {!isReordering && (
              <button
                className="ns-primary shrink-0"
                id="add-member-btn"
                onClick={() => setShowAdd(true)}
              >
                <IconPlus size={16} /> Tambah Anggota
              </button>
            )}
            {isReordering && (
              <button
                className="ns-primary"
                disabled={isPending}
                id="save-order-btn"
                onClick={handleSaveOrder}
              >
                {isPending ? (
                  <IconLoader2 className="animate-spin" size={16} />
                ) : reorderSaved ? (
                  <IconCheck size={16} />
                ) : (
                  <IconDeviceFloppy size={16} />
                )}
                {reorderSaved ? "Tersimpan!" : "Simpan Urutan"}
              </button>
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {deleteError && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="ns-alert"
              data-tone="danger"
              exit={{ opacity: 0, y: -8 }}
              initial={{ opacity: 0, y: -8 }}
              role="alert"
              transition={{ duration: reduced ? 0 : 0.2 }}
            >
              {deleteError}
            </motion.div>
          )}
          {reorderError && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="ns-alert"
              data-tone="danger"
              exit={{ opacity: 0, y: -8 }}
              initial={{ opacity: 0, y: -8 }}
              role="alert"
              transition={{ duration: reduced ? 0 : 0.2 }}
            >
              {reorderError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reorder mode banner */}
        <AnimatePresence>
          {isReordering && (
            <motion.div
              animate={{ opacity: 1, height: "auto" }}
              className="overflow-hidden"
              exit={{ opacity: 0, height: 0 }}
              initial={{ opacity: 0, height: 0 }}
              transition={{ duration: reduced ? 0 : 0.25 }}
            >
              <div className="flex items-center gap-3 rounded-xl border border-control-border bg-surface px-4 py-3">
                <IconGripVertical
                  className="shrink-0 text-secondary"
                  size={16}
                />
                <p className="text-sm text-secondary">
                  Seret kartu untuk mengubah urutan tampil. Klik{" "}
                  <strong>Simpan Urutan</strong> untuk menyimpan perubahan.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search — hidden in reorder mode */}
        <AnimatePresence>
          {!isReordering && (
            <motion.div
              animate={{ opacity: 1 }}
              className="relative"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.2 }}
            >
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted-foreground">
                <IconSearch size={16} stroke={1.8} />
              </span>
              <input
                aria-label="Cari nama atau jabatan"
                className="ns-field pl-10"
                id="member-search"
                placeholder="Cari nama atau jabatan..."
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Members grid */}
        {(isReordering ? members : filtered).length === 0 ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-border text-muted-foreground"
            initial={{ opacity: 0 }}
          >
            <IconUsersGroup size={36} stroke={1.4} />
            <p className="mt-3 text-sm">Tidak ada anggota ditemukan</p>
          </motion.div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {(isReordering ? members : filtered).map((member, index) => {
                const anim = cardIn(index);
                const isThisDragging = draggingIndex === index;
                const isConfirmingDelete = confirmDeleteId === member.id;

                return (
                  <motion.div
                    key={member.id}
                    layout
                    {...anim}
                    animate={
                      isThisDragging && isReordering && !reduced
                        ? {
                            opacity: 0.8,
                            scale: 1.03,
                            boxShadow: "0 20px 50px rgba(1,75,63,0.4)",
                            zIndex: 10,
                          }
                        : {
                            ...anim.animate,
                            boxShadow: "none",
                            zIndex: 1,
                          }
                    }
                    className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-surface transition-colors duration-200 ${
                      isReordering
                        ? "cursor-grab border-control-border bg-surface hover:border-control-border active:cursor-grabbing"
                        : savedId === member.id
                          ? "border-success bg-card"
                          : "border-border hover:border-border"
                    }`}
                    draggable={isReordering}
                    onDragEnd={isReordering ? handleDragEnd : undefined}
                    onDragEnter={
                      isReordering ? () => handleDragEnter(index) : undefined
                    }
                    onDragOver={
                      isReordering ? (e) => e.preventDefault() : undefined
                    }
                    onDragStart={
                      isReordering ? () => handleDragStart(index) : undefined
                    }
                  >
                    {/* Main card row */}
                    <div className="grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-3 p-5">
                      {/* Drag handle — only in reorder mode */}
                      {isReordering && (
                        <div className="col-span-2 flex items-center text-secondary">
                          <IconGripVertical size={18} stroke={1.8} />
                        </div>
                      )}

                      {/* Avatar */}
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-surface">
                        {member.image_url ? (
                          <Image
                            fill
                            alt={member.name}
                            className="object-cover"
                            sizes="48px"
                            src={member.image_url}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-lg font-bold text-muted-foreground">
                            {member.name[0]}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0">
                        <p className="break-words text-sm font-semibold text-foreground">
                          {member.name}
                          {savedId === member.id && (
                            <span className="ml-1 inline-flex items-center gap-0.5 text-sm text-success">
                              <IconCheck size={10} /> Tersimpan
                            </span>
                          )}
                        </p>
                        <p className="mt-0.5 break-words text-sm text-muted-foreground">
                          {getPositionLabel(member.position)}
                        </p>
                      </div>

                      {/* Actions — only in normal mode */}
                      {!isReordering && !isConfirmingDelete && (
                        <div className="col-span-2 flex justify-end gap-2 border-t border-border pt-3">
                          <button
                            aria-label={`Edit ${member.name}`}
                            className="flex h-11 w-11 items-center justify-center rounded-lg bg-surface text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
                            id={`edit-member-${member.id}`}
                            onClick={() => setEditMember(member)}
                          >
                            <IconPencil size={14} stroke={1.8} />
                          </button>
                          <button
                            aria-label={`Hapus ${member.name}`}
                            className="flex h-11 w-11 items-center justify-center rounded-lg bg-surface text-destructive hover:bg-surface hover:text-destructive disabled:opacity-50 transition-colors"
                            disabled={isPending && deletingId === member.id}
                            id={`delete-member-${member.id}`}
                            onClick={() => setConfirmDeleteId(member.id)}
                          >
                            {isPending && deletingId === member.id ? (
                              <IconLoader2 className="animate-spin" size={14} />
                            ) : (
                              <IconTrash size={14} stroke={1.8} />
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Inline delete confirmation */}
                    <AnimatePresence>
                      {isConfirmingDelete && (
                        <motion.div
                          animate={{ opacity: 1, height: "auto" }}
                          className="overflow-hidden"
                          exit={{ opacity: 0, height: 0 }}
                          initial={{ opacity: 0, height: 0 }}
                          transition={{
                            duration: reduced ? 0 : 0.22,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          <div className="flex flex-wrap items-center gap-2 border-t border-destructive bg-surface px-4 py-2.5">
                            <IconAlertTriangle
                              className="shrink-0 text-destructive"
                              size={13}
                            />
                            <p className="flex-1 text-sm text-destructive">
                              Hapus{" "}
                              <span className="font-semibold">
                                {member.name}
                              </span>
                              ?
                            </p>
                            <button
                              className="inline-flex min-h-11 items-center gap-1 rounded-lg bg-surface px-2.5 py-1 text-sm font-bold text-destructive hover:bg-surface disabled:opacity-50 transition-colors"
                              disabled={isPending && deletingId === member.id}
                              onClick={() => handleDelete(member.id)}
                            >
                              {isPending && deletingId === member.id ? (
                                <IconLoader2
                                  className="animate-spin"
                                  size={11}
                                />
                              ) : (
                                <IconCheck size={11} />
                              )}
                              Ya, hapus
                            </button>
                            <button
                              className="inline-flex min-h-11 items-center gap-1 rounded-lg bg-surface px-2.5 py-1 text-sm font-semibold text-muted-foreground hover:bg-surface transition-colors"
                              onClick={() => setConfirmDeleteId(null)}
                            >
                              <IconX size={11} /> Batal
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Skeleton placeholders — shown while a transition is pending */}
            <AnimatePresence>
              {isPending && !isReordering && (
                <>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={`skel-${i}`}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      initial={{ opacity: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <MemberCardSkeleton />
                    </motion.div>
                  ))}
                </>
              )}
            </AnimatePresence>
          </div>
        )}

        <p className="text-center text-sm text-muted-foreground pb-4">
          Perubahan akan langsung tampil di halaman direktori anggota
        </p>
      </div>
    </>
  );
}
