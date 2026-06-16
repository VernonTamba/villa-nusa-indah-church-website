"use client";

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
  IconUpload,
  IconUsersGroup,
  IconX,
  IconAlertTriangle,
} from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { addMember, deleteMember, updateMember, updateMemberImage, updateMembersOrder } from "../actions";
import type { MemberRow } from "./page";

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
  if (msg.includes("413") || /too large|entity too large|body.*limit/i.test(msg)) {
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

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className={`pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-2xl backdrop-blur-md ${
              toast.type === "success"
                ? "border-emerald-500/30 bg-slate-900/90 text-emerald-400"
                : "border-red-500/30 bg-slate-900/90 text-red-400"
            }`}
          >
            {toast.type === "success" ? (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20">
                <IconCheck size={12} />
              </span>
            ) : (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20">
                <IconX size={12} />
              </span>
            )}
            {toast.message}
            <button
              onClick={() => onRemove(toast.id)}
              className="ml-1 text-white/30 hover:text-white/70 transition-colors"
              aria-label="Tutup"
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
    <div className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/8 bg-white/4 p-4">
      {/* shimmer overlay */}
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
        }}
      />
      <div className="h-12 w-12 shrink-0 rounded-xl bg-white/8" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-2/3 rounded-full bg-white/8" />
        <div className="h-2.5 w-1/2 rounded-full bg-white/6" />
      </div>
    </div>
  );
}

// ─── Animated Modal Wrapper ───────────────────────────────────────────────────

function ModalWrapper({ onClose, children, reduced }: { onClose: () => void; children: React.ReactNode; reduced: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduced ? 0 : 0.2 }}
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, scale: reduced ? 1 : 0.92, y: reduced ? 0 : 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: reduced ? 1 : 0.92, y: reduced ? 0 : 16 }}
        transition={{ duration: reduced ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

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
      setError(`Ukuran foto terlalu besar. Maksimal ${MAX_IMAGE_SIZE_MB} MB (file Anda: ${(file.size / 1024 / 1024).toFixed(1)} MB).`);
      e.target.value = "";
      return;
    }
    setError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Nama tidak boleh kosong"); return; }
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
    <ModalWrapper onClose={onClose} reduced={reduced}>
      <div className="overflow-hidden rounded-2xl border border-white/12 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
          <h2 className="font-bold text-white">Tambah Anggota Baru</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors" aria-label="Tutup">
            <IconX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Photo upload */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="relative h-24 w-24 overflow-hidden rounded-2xl border-2 border-dashed border-white/20 bg-white/6 cursor-pointer hover:border-emerald-500/50 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              {imagePreview ? (
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-white/30">
                  <IconPhoto size={24} stroke={1.5} />
                  <span className="text-[10px]">Upload foto</span>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              id="new-member-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-xs text-emerald-400 hover:underline"
            >
              {imagePreview ? "Ganti foto" : "Pilih foto (opsional)"}
            </button>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <label htmlFor="new-member-name" className="block text-xs font-semibold text-white/60 uppercase tracking-wide">
              Nama Lengkap *
            </label>
            <input
              id="new-member-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama"
              required
              className="w-full rounded-xl border border-white/10 bg-white/6 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/15"
            />
          </div>

          {/* Position */}
          <div className="space-y-1.5">
            <label htmlFor="new-member-position" className="block text-xs font-semibold text-white/60 uppercase tracking-wide">
              Jabatan *
            </label>
            <select
              id="new-member-position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/15"
            >
              {POSITIONS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: reduced ? 0 : 0.2 }}
                className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-white/60 hover:bg-white/6 transition-colors">
              Batal
            </button>
            <button
              id="add-member-submit"
              type="submit"
              disabled={isPending}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 py-2.5 text-sm font-bold text-white disabled:opacity-60 transition-opacity"
            >
              {isPending ? <IconLoader2 size={15} className="animate-spin" /> : <IconPlus size={15} />}
              {isPending ? "Menyimpan..." : "Tambah"}
            </button>
          </div>
        </form>
      </div>
    </ModalWrapper>
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
  const [imagePreview, setImagePreview] = useState<string | null>(member.image_url);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError(`Ukuran foto terlalu besar. Maksimal ${MAX_IMAGE_SIZE_MB} MB (file Anda: ${(file.size / 1024 / 1024).toFixed(1)} MB).`);
      e.target.value = "";
      return;
    }
    setError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Nama tidak boleh kosong"); return; }
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

        onUpdated({ ...member, name: name.trim(), position, image_url: finalImageUrl });
        onClose();
      } catch (e: unknown) {
        setError(parseUploadError(e));
      }
    });
  };

  return (
    <ModalWrapper onClose={onClose} reduced={reduced}>
      <div className="overflow-hidden rounded-2xl border border-white/12 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
          <h2 className="font-bold text-white">Edit Anggota</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors" aria-label="Tutup">
            <IconX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Photo */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="relative h-24 w-24 overflow-hidden rounded-2xl border-2 border-dashed border-white/20 bg-white/6 cursor-pointer hover:border-emerald-500/50 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              {imagePreview ? (
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-white/30">
                  <IconPhoto size={24} stroke={1.5} />
                  <span className="text-[10px]">Upload foto</span>
                </div>
              )}
            </div>
            <input ref={fileRef} id="edit-member-image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            <button type="button" onClick={() => fileRef.current?.click()} className="text-xs text-emerald-400 hover:underline">
              {imagePreview ? "Ganti foto" : "Upload foto"}
            </button>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <label htmlFor="edit-member-name" className="block text-xs font-semibold text-white/60 uppercase tracking-wide">Nama Lengkap</label>
            <input
              id="edit-member-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-white/6 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/15"
            />
          </div>

          {/* Position */}
          <div className="space-y-1.5">
            <label htmlFor="edit-member-position" className="block text-xs font-semibold text-white/60 uppercase tracking-wide">Jabatan</label>
            <select
              id="edit-member-position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50"
            >
              {POSITIONS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: reduced ? 0 : 0.2 }}
                className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-white/60 hover:bg-white/6 transition-colors">Batal</button>
            <button
              id="edit-member-submit"
              type="submit"
              disabled={isPending}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 py-2.5 text-sm font-bold text-white disabled:opacity-60 transition-opacity"
            >
              {isPending ? <IconLoader2 size={15} className="animate-spin" /> : <IconDeviceFloppy size={15} />}
              {isPending ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

let toastCounter = 0;

export default function MembersManager({ initialMembers }: { initialMembers: MemberRow[] }) {
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
  const pushToast = (message: string, type: "success" | "error" = "success") => {
    const id = ++toastCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  };

  const removeToast = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

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
    initial: { opacity: 0, y: reduced ? 0 : 22, scale: reduced ? 1 : 0.97 },
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
            onClose={() => setShowAdd(false)}
            onAdded={handleAdded}
            reduced={reduced}
          />
        )}
        {editMember && (
          <EditMemberModal
            key="edit-modal"
            member={editMember}
            onClose={() => setEditMember(null)}
            onUpdated={handleUpdated}
            reduced={reduced}
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

      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="flex items-center gap-2 text-emerald-400">
              <IconUsersGroup size={20} stroke={1.8} />
              <span className="text-xs font-semibold uppercase tracking-[0.22em]">Anggota Jemaat</span>
            </div>
            <h1 className="mt-1 text-2xl font-black text-white">Kelola Anggota</h1>
            <p className="mt-1 text-sm text-white/50">
              Tambah, edit, atau hapus anggota jemaat. Total: {members.length} anggota.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              id="reorder-members-btn"
              onClick={handleToggleReorder}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                isReordering
                  ? "border-amber-500/40 bg-amber-500/15 text-amber-400 hover:bg-amber-500/25"
                  : "border-white/12 bg-white/6 text-white/60 hover:bg-white/12 hover:text-white"
              }`}
            >
              <IconArrowsSort size={16} />
              {isReordering ? "Selesai Atur" : "Atur Urutan"}
            </button>
            {!isReordering && (
              <button
                id="add-member-btn"
                onClick={() => setShowAdd(true)}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(1,75,63,0.35)] transition-all hover:-translate-y-0.5"
              >
                <IconPlus size={16} /> Tambah Anggota
              </button>
            )}
            {isReordering && (
              <button
                id="save-order-btn"
                onClick={handleSaveOrder}
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(1,75,63,0.35)] transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
              >
                {isPending ? (
                  <IconLoader2 size={16} className="animate-spin" />
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
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: reduced ? 0 : 0.2 }}
              className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
            >
              {deleteError}
            </motion.div>
          )}
          {reorderError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: reduced ? 0 : 0.2 }}
              className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
            >
              {reorderError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reorder mode banner */}
        <AnimatePresence>
          {isReordering && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: reduced ? 0 : 0.25 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/8 px-4 py-3">
                <IconGripVertical size={16} className="shrink-0 text-amber-400" />
                <p className="text-sm text-amber-300/80">
                  Seret kartu untuk mengubah urutan tampil. Klik <strong>Simpan Urutan</strong> untuk menyimpan perubahan.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search — hidden in reorder mode */}
        <AnimatePresence>
          {!isReordering && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.2 }}
              className="relative"
            >
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-white/30">
                <IconSearch size={16} stroke={1.8} />
              </span>
              <input
                id="member-search"
                type="search"
                placeholder="Cari nama atau jabatan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-white/25 outline-none focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/15"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Members grid */}
        {(isReordering ? members : filtered).length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 text-white/30"
          >
            <IconUsersGroup size={36} stroke={1.4} />
            <p className="mt-3 text-sm">Tidak ada anggota ditemukan</p>
          </motion.div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                    draggable={isReordering}
                    onDragStart={isReordering ? () => handleDragStart(index) : undefined}
                    onDragEnter={isReordering ? () => handleDragEnter(index) : undefined}
                    onDragEnd={isReordering ? handleDragEnd : undefined}
                    onDragOver={isReordering ? (e) => e.preventDefault() : undefined}
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
                    className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white/4 transition-colors duration-200 ${
                      isReordering
                        ? "cursor-grab border-amber-500/20 bg-amber-500/4 hover:border-amber-500/40 active:cursor-grabbing"
                        : savedId === member.id
                        ? "border-emerald-500/40 bg-emerald-500/8"
                        : "border-white/8 hover:border-white/16"
                    }`}
                  >
                    {/* Main card row */}
                    <div className="flex items-center gap-3 p-4">
                      {/* Drag handle — only in reorder mode */}
                      {isReordering && (
                        <div className="flex shrink-0 items-center text-amber-400/60">
                          <IconGripVertical size={18} stroke={1.8} />
                        </div>
                      )}

                      {/* Avatar */}
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white/8">
                        {member.image_url ? (
                          <Image
                            src={member.image_url}
                            alt={member.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-lg font-bold text-white/30">
                            {member.name[0]}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">
                          {member.name}
                          {savedId === member.id && (
                            <span className="ml-1 inline-flex items-center gap-0.5 text-[10px] text-emerald-400">
                              <IconCheck size={10} /> Tersimpan
                            </span>
                          )}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-white/40">
                          {getPositionLabel(member.position)}
                        </p>
                      </div>

                      {/* Actions — only in normal mode */}
                      {!isReordering && !isConfirmingDelete && (
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            id={`edit-member-${member.id}`}
                            onClick={() => setEditMember(member)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/8 text-white/50 hover:bg-white/16 hover:text-white transition-colors"
                            aria-label={`Edit ${member.name}`}
                          >
                            <IconPencil size={14} stroke={1.8} />
                          </button>
                          <button
                            id={`delete-member-${member.id}`}
                            onClick={() => setConfirmDeleteId(member.id)}
                            disabled={isPending && deletingId === member.id}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400/70 hover:bg-red-500/20 hover:text-red-400 disabled:opacity-50 transition-colors"
                            aria-label={`Hapus ${member.name}`}
                          >
                            {isPending && deletingId === member.id ? (
                              <IconLoader2 size={14} className="animate-spin" />
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
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: reduced ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="flex items-center gap-2 border-t border-red-500/15 bg-red-500/8 px-4 py-2.5">
                            <IconAlertTriangle size={13} className="shrink-0 text-red-400" />
                            <p className="flex-1 text-[11px] text-red-300/80">
                              Hapus <span className="font-semibold">{member.name}</span>?
                            </p>
                            <button
                              onClick={() => handleDelete(member.id)}
                              disabled={isPending && deletingId === member.id}
                              className="inline-flex items-center gap-1 rounded-lg bg-red-500/25 px-2.5 py-1 text-[11px] font-bold text-red-300 hover:bg-red-500/40 disabled:opacity-50 transition-colors"
                            >
                              {isPending && deletingId === member.id ? (
                                <IconLoader2 size={11} className="animate-spin" />
                              ) : (
                                <IconCheck size={11} />
                              )}
                              Ya, hapus
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="inline-flex items-center gap-1 rounded-lg bg-white/8 px-2.5 py-1 text-[11px] font-semibold text-white/50 hover:bg-white/14 transition-colors"
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
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
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

        <p className="text-center text-xs text-white/25 pb-4">
          Perubahan akan langsung tampil di halaman direktori anggota
        </p>
      </div>
    </>
  );
}
