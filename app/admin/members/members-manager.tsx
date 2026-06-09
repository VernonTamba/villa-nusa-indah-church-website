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
} from "@tabler/icons-react";
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

// ─── Add Member Modal ─────────────────────────────────────────────────────────

function AddMemberModal({ onClose, onAdded }: { onClose: () => void; onAdded: (m: MemberRow) => void }) {
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
        setError(e instanceof Error ? e.message : "Terjadi kesalahan");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/12 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
          <h2 className="font-bold text-white">Tambah Anggota Baru</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white" aria-label="Tutup">
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

          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-white/60 hover:bg-white/6">
              Batal
            </button>
            <button
              id="add-member-submit"
              type="submit"
              disabled={isPending}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 py-2.5 text-sm font-bold text-white disabled:opacity-60"
            >
              {isPending ? <IconLoader2 size={15} className="animate-spin" /> : <IconPlus size={15} />}
              {isPending ? "Menyimpan..." : "Tambah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Edit Member Modal ────────────────────────────────────────────────────────

function EditMemberModal({
  member,
  onClose,
  onUpdated,
}: {
  member: MemberRow;
  onClose: () => void;
  onUpdated: (m: MemberRow) => void;
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
        if (imageFile) await updateMemberImage(member.id, imageFile);
        onUpdated({ ...member, name: name.trim(), position, image_url: imagePreview });
        onClose();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Terjadi kesalahan");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/12 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
          <h2 className="font-bold text-white">Edit Anggota</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white" aria-label="Tutup">
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

          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-white/60 hover:bg-white/6">Batal</button>
            <button
              id="edit-member-submit"
              type="submit"
              disabled={isPending}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 py-2.5 text-sm font-bold text-white disabled:opacity-60"
            >
              {isPending ? <IconLoader2 size={15} className="animate-spin" /> : <IconDeviceFloppy size={15} />}
              {isPending ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MembersManager({ initialMembers }: { initialMembers: MemberRow[] }) {
  const [members, setMembers] = useState<MemberRow[]>(initialMembers);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editMember, setEditMember] = useState<MemberRow | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  // ── Reorder mode state ────────────────────────────────────────────────────
  const [isReordering, setIsReordering] = useState(false);
  const [reorderSaved, setReorderSaved] = useState(false);
  const [reorderError, setReorderError] = useState<string | null>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      getPositionLabel(m.position).toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = (id: string) => {
    setDeletingId(id);
    startTransition(async () => {
      try {
        await deleteMember(id);
        setMembers((prev) => prev.filter((m) => m.id !== id));
        setDeleteError(null);
      } catch (e: unknown) {
        setDeleteError(e instanceof Error ? e.message : "Gagal menghapus");
      } finally {
        setDeletingId(null);
      }
    });
  };

  const handleAdded = (m: MemberRow) => {
    setMembers((prev) => [...prev, m]);
    setSavedId(m.id);
    setTimeout(() => setSavedId(null), 2000);
  };

  const handleUpdated = (m: MemberRow) => {
    setMembers((prev) => prev.map((x) => (x.id === m.id ? m : x)));
    setSavedId(m.id);
    setTimeout(() => setSavedId(null), 2000);
  };

  // ── Drag handlers ─────────────────────────────────────────────────────────
  const handleDragStart = (index: number) => {
    dragItem.current = index;
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
        setTimeout(() => setReorderSaved(false), 2500);
      } catch (e: unknown) {
        setReorderError(e instanceof Error ? e.message : "Gagal menyimpan urutan");
      }
    });
  };

  const handleToggleReorder = () => {
    setIsReordering((v) => !v);
    setReorderSaved(false);
    setReorderError(null);
    setSearch("");
  };

  return (
    <>
      {showAdd && (
        <AddMemberModal onClose={() => setShowAdd(false)} onAdded={handleAdded} />
      )}
      {editMember && (
        <EditMemberModal
          member={editMember}
          onClose={() => setEditMember(null)}
          onUpdated={handleUpdated}
        />
      )}

      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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
        </div>

        {deleteError && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{deleteError}</div>
        )}

        {reorderError && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{reorderError}</div>
        )}

        {/* Reorder mode banner */}
        {isReordering && (
          <div className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/8 px-4 py-3">
            <IconGripVertical size={16} className="shrink-0 text-amber-400" />
            <p className="text-sm text-amber-300/80">
              Seret kartu untuk mengubah urutan tampil. Klik <strong>Simpan Urutan</strong> untuk menyimpan perubahan.
            </p>
          </div>
        )}

        {/* Search — hidden in reorder mode */}
        {!isReordering && (
          <div className="relative">
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
          </div>
        )}

        {/* Members grid */}
        {(isReordering ? members : filtered).length === 0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 text-white/30">
            <IconUsersGroup size={36} stroke={1.4} />
            <p className="mt-3 text-sm">Tidak ada anggota ditemukan</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(isReordering ? members : filtered).map((member, index) => (
              <div
                key={member.id}
                draggable={isReordering}
                onDragStart={isReordering ? () => handleDragStart(index) : undefined}
                onDragEnter={isReordering ? () => handleDragEnter(index) : undefined}
                onDragEnd={isReordering ? handleDragEnd : undefined}
                onDragOver={isReordering ? (e) => e.preventDefault() : undefined}
                className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl border bg-white/4 p-4 transition-all duration-200 ${
                  isReordering
                    ? "cursor-grab border-amber-500/20 bg-amber-500/4 hover:border-amber-500/40 active:cursor-grabbing active:scale-[0.98] active:opacity-70"
                    : savedId === member.id
                    ? "border-emerald-500/40 bg-emerald-500/8"
                    : "border-white/8 hover:border-white/16"
                }`}
              >
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
                {!isReordering && (
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
                      onClick={() => handleDelete(member.id)}
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
            ))}
          </div>
        )}

        <p className="text-center text-xs text-white/25 pb-4">
          Perubahan akan langsung tampil di halaman direktori anggota
        </p>
      </div>
    </>
  );
}
