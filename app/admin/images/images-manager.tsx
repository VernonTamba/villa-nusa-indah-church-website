"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import {
  IconCheck,
  IconDeviceFloppy,
  IconLoader2,
  IconPencil,
  IconPhoto,
  IconPlus,
  IconTrash,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import {
  addHeroImage,
  addSabbathMoment,
  deleteHeroImage,
  deleteSabbathMoment,
  updateSabbathMoment,
} from "../actions";
import type { HeroImageRow, SabbathMomentRow } from "./page";

// ─── Tab ─────────────────────────────────────────────────────────────────────

type Tab = "hero" | "sabbath";

// ─── Hero Images Section ───────────────────────────────────────────────────────

function HeroImagesSection({ initialImages }: { initialImages: HeroImageRow[] }) {
  const [images, setImages] = useState<HeroImageRow[]>(initialImages);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFile(file);
    setUploadPreview(URL.createObjectURL(file));
  };

  const handleUpload = () => {
    if (!uploadFile) return;
    const fd = new FormData();
    fd.append("image", uploadFile);

    startTransition(async () => {
      try {
        setError(null);
        await addHeroImage(fd);
        // Optimistic add
        setImages((prev) => [
          ...prev,
          {
            id: `temp-${Date.now()}`,
            storage_path: "",
            public_url: uploadPreview ?? "",
            display_order: prev.length,
          },
        ]);
        setUploadFile(null);
        setUploadPreview(null);
        if (fileRef.current) fileRef.current.value = "";
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Gagal mengupload");
      }
    });
  };

  const handleDelete = (id: string, path: string) => {
    setDeletingId(id);
    startTransition(async () => {
      try {
        await deleteHeroImage(id, path);
        setImages((prev) => prev.filter((img) => img.id !== id));
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Gagal menghapus");
      } finally {
        setDeletingId(null);
      }
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-bold text-white">Hero Carousel</h2>
        <p className="text-sm text-white/50">
          Gambar latar hero section di halaman utama. Akan berganti otomatis setiap 5,6 detik.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      {/* Upload area */}
      <div className="rounded-2xl border border-dashed border-white/16 bg-white/4 p-5">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div
            className="relative h-32 w-48 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/6 cursor-pointer hover:border-emerald-500/50 transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            {uploadPreview ? (
              <Image src={uploadPreview} alt="Preview" fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-white/25">
                <IconUpload size={28} stroke={1.4} />
                <span className="text-xs">Klik untuk pilih gambar</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 flex-1">
            <input
              ref={fileRef}
              id="hero-upload-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/6 px-4 py-2.5 text-sm text-white/70 hover:bg-white/12 hover:text-white transition-colors"
            >
              <IconPhoto size={16} /> Pilih gambar hero
            </button>
            {uploadFile && (
              <div className="space-y-2">
                <p className="text-xs text-white/40 truncate">{uploadFile.name}</p>
                <button
                  id="hero-upload-confirm"
                  type="button"
                  onClick={handleUpload}
                  disabled={isPending}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
                >
                  {isPending ? <IconLoader2 size={15} className="animate-spin" /> : <IconUpload size={15} />}
                  {isPending ? "Mengupload..." : "Upload Gambar"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image grid */}
      {images.length === 0 ? (
        <div className="flex min-h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 text-white/25">
          <IconPhoto size={32} stroke={1.4} />
          <p className="mt-2 text-sm">Belum ada gambar hero</p>
          <p className="text-xs">Upload gambar pertama di atas</p>
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img, i) => (
            <div
              key={img.id}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/4"
            >
              <Image
                src={img.public_url}
                alt={`Hero image ${i + 1}`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              />
              {/* Order badge */}
              <div className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                #{i + 1}
              </div>
              {/* Delete button */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  id={`delete-hero-${img.id}`}
                  onClick={() => handleDelete(img.id, img.storage_path)}
                  disabled={isPending && deletingId === img.id}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/80 text-white hover:bg-red-500 disabled:opacity-50 transition-colors"
                  aria-label="Hapus gambar"
                >
                  {isPending && deletingId === img.id ? (
                    <IconLoader2 size={16} className="animate-spin" />
                  ) : (
                    <IconTrash size={16} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Sabbath Moments Section ───────────────────────────────────────────────────

function EditMomentModal({
  moment,
  onClose,
  onUpdated,
}: {
  moment: SabbathMomentRow;
  onClose: () => void;
  onUpdated: (m: SabbathMomentRow) => void;
}) {
  const [label, setLabel] = useState(moment.label);
  const [title, setTitle] = useState(moment.title);
  const [description, setDescription] = useState(moment.description);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await updateSabbathMoment(moment.id, { label, title, description });
        onUpdated({ ...moment, label, title, description });
        onClose();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Gagal menyimpan");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/12 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
          <h2 className="font-bold text-white">Edit Sabbath Moment</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white" aria-label="Tutup"><IconX size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="edit-moment-label" className="block text-xs font-semibold text-white/60 uppercase tracking-wide">Label</label>
            <input id="edit-moment-label" type="text" value={label} onChange={(e) => setLabel(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/6 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="edit-moment-title" className="block text-xs font-semibold text-white/60 uppercase tracking-wide">Judul</label>
            <input id="edit-moment-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/6 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="edit-moment-desc" className="block text-xs font-semibold text-white/60 uppercase tracking-wide">Deskripsi</label>
            <textarea id="edit-moment-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-xl border border-white/10 bg-white/6 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50 resize-none" />
          </div>
          {error && <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-white/60 hover:bg-white/6">Batal</button>
            <button id="edit-moment-submit" type="submit" disabled={isPending} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 py-2.5 text-sm font-bold text-white disabled:opacity-60">
              {isPending ? <IconLoader2 size={15} className="animate-spin" /> : <IconDeviceFloppy size={15} />}
              {isPending ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SabbathMomentsSection({ initialMoments }: { initialMoments: SabbathMomentRow[] }) {
  const [moments, setMoments] = useState<SabbathMomentRow[]>(initialMoments);
  const [editMoment, setEditMoment] = useState<SabbathMomentRow | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  // Add form state
  const [newLabel, setNewLabel] = useState(`Moment ${String(moments.length + 1).padStart(2, "0")}`);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPreview, setNewPreview] = useState<string | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewFile(file);
    setNewPreview(URL.createObjectURL(file));
  };

  const handleAdd = () => {
    if (!newFile || !newTitle.trim()) { setError("Gambar dan judul wajib diisi"); return; }
    const fd = new FormData();
    fd.append("image", newFile);
    fd.append("label", newLabel);
    fd.append("title", newTitle);
    fd.append("description", newDescription);

    startTransition(async () => {
      try {
        setError(null);
        await addSabbathMoment(fd);
        const newMoment: SabbathMomentRow = {
          id: `temp-${Date.now()}`,
          storage_path: "",
          public_url: newPreview ?? "",
          label: newLabel,
          title: newTitle,
          description: newDescription,
          display_order: moments.length,
        };
        setMoments((prev) => [...prev, newMoment]);
        setShowAdd(false);
        setNewFile(null);
        setNewPreview(null);
        setNewTitle("");
        setNewDescription("");
        setNewLabel(`Moment ${String(moments.length + 2).padStart(2, "0")}`);
        if (fileRef.current) fileRef.current.value = "";
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Gagal mengupload");
      }
    });
  };

  const handleDelete = (id: string, path: string) => {
    setDeletingId(id);
    startTransition(async () => {
      try {
        await deleteSabbathMoment(id, path);
        setMoments((prev) => prev.filter((m) => m.id !== id));
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Gagal menghapus");
      } finally {
        setDeletingId(null);
      }
    });
  };

  const handleUpdated = (m: SabbathMomentRow) => {
    setMoments((prev) => prev.map((x) => (x.id === m.id ? m : x)));
    setSavedId(m.id);
    setTimeout(() => setSavedId(null), 2000);
  };

  return (
    <>
      {editMoment && (
        <EditMomentModal moment={editMoment} onClose={() => setEditMoment(null)} onUpdated={handleUpdated} />
      )}

      <div className="space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-bold text-white">Sabbath Moments</h2>
            <p className="text-sm text-white/50">
              Foto-foto yang ditampilkan dalam scroll stack "Momen Sabat" di halaman utama.
            </p>
          </div>
          <button
            id="add-moment-btn"
            onClick={() => setShowAdd((v) => !v)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(1,75,63,0.35)] transition-all hover:-translate-y-0.5"
          >
            {showAdd ? <IconX size={15} /> : <IconPlus size={15} />}
            {showAdd ? "Batal" : "Tambah Momen"}
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
        )}

        {/* Add form */}
        {showAdd && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-emerald-400">Tambah Momen Baru</h3>
            <div className="flex flex-col gap-4 sm:flex-row">
              {/* Preview */}
              <div
                className="relative h-40 w-full sm:w-48 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/6 cursor-pointer hover:border-emerald-500/40 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                {newPreview ? (
                  <Image src={newPreview} alt="Preview" fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-white/25">
                    <IconUpload size={24} stroke={1.4} />
                    <span className="text-xs">Klik untuk pilih gambar</span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-3">
                <input ref={fileRef} id="moment-upload-input" type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/6 px-3 py-2 text-xs text-white/60 hover:bg-white/12">
                  <IconPhoto size={14} /> {newPreview ? "Ganti gambar" : "Pilih gambar *"}
                </button>
                <input id="moment-label" type="text" placeholder="Label (e.g. Moment 06)" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} className="rounded-xl border border-white/10 bg-white/6 px-3 py-2 text-sm text-white placeholder-white/25 outline-none focus:border-emerald-500/50" />
                <input id="moment-title" type="text" placeholder="Judul momen *" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="rounded-xl border border-white/10 bg-white/6 px-3 py-2 text-sm text-white placeholder-white/25 outline-none focus:border-emerald-500/50" />
                <textarea id="moment-description" placeholder="Deskripsi singkat" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} rows={2} className="rounded-xl border border-white/10 bg-white/6 px-3 py-2 text-sm text-white placeholder-white/25 outline-none focus:border-emerald-500/50 resize-none" />
                <button
                  id="add-moment-confirm"
                  type="button"
                  onClick={handleAdd}
                  disabled={isPending}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
                >
                  {isPending ? <IconLoader2 size={15} className="animate-spin" /> : <IconUpload size={15} />}
                  {isPending ? "Mengupload..." : "Upload Momen"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Moments list */}
        {moments.length === 0 ? (
          <div className="flex min-h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 text-white/25">
            <IconPhoto size={32} stroke={1.4} />
            <p className="mt-2 text-sm">Belum ada foto Sabbath Moment</p>
          </div>
        ) : (
          <div className="space-y-3">
            {moments.map((moment, i) => (
              <div
                key={moment.id}
                className={`group flex items-center gap-4 overflow-hidden rounded-2xl border bg-white/4 p-3 transition-all duration-200 ${
                  savedId === moment.id ? "border-emerald-500/40" : "border-white/8 hover:border-white/16"
                }`}
              >
                {/* Thumbnail */}
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-white/8">
                  <Image src={moment.public_url} alt={moment.title} fill className="object-cover" sizes="96px" />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                      #{i + 1}
                    </span>
                    <span className="text-[10px] text-white/30">{moment.label}</span>
                    {savedId === moment.id && (
                      <span className="flex items-center gap-0.5 text-[10px] text-emerald-400">
                        <IconCheck size={10} /> Tersimpan
                      </span>
                    )}
                  </div>
                  <p className="mt-1 truncate text-sm font-semibold text-white">{moment.title}</p>
                  <p className="truncate text-xs text-white/40">{moment.description}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    id={`edit-moment-${moment.id}`}
                    onClick={() => setEditMoment(moment)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/8 text-white/50 hover:bg-white/16 hover:text-white transition-colors"
                    aria-label="Edit momen"
                  >
                    <IconPencil size={14} stroke={1.8} />
                  </button>
                  <button
                    id={`delete-moment-${moment.id}`}
                    onClick={() => handleDelete(moment.id, moment.storage_path)}
                    disabled={isPending && deletingId === moment.id}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400/70 hover:bg-red-500/20 hover:text-red-400 disabled:opacity-50 transition-colors"
                    aria-label="Hapus momen"
                  >
                    {isPending && deletingId === moment.id ? (
                      <IconLoader2 size={14} className="animate-spin" />
                    ) : (
                      <IconTrash size={14} stroke={1.8} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function ImagesManager({
  initialHeroImages,
  initialSabbathMoments,
}: {
  initialHeroImages: HeroImageRow[];
  initialSabbathMoments: SabbathMomentRow[];
}) {
  const [tab, setTab] = useState<Tab>("hero");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-emerald-400">
          <IconPhoto size={20} stroke={1.8} />
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">Manajemen Gambar</span>
        </div>
        <h1 className="mt-1 text-2xl font-black text-white">Galeri & Carousel</h1>
        <p className="mt-1 text-sm text-white/50">
          Kelola gambar hero carousel dan foto Sabbath Moments di halaman utama.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-2xl border border-white/8 bg-white/4 p-1">
        {(["hero", "sabbath"] as Tab[]).map((t) => (
          <button
            key={t}
            id={`images-tab-${t}`}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
              tab === t
                ? "bg-emerald-700 text-white shadow-[0_2px_12px_rgba(1,75,63,0.4)]"
                : "text-white/50 hover:text-white"
            }`}
          >
            {t === "hero" ? "🏞️ Hero Carousel" : "📸 Sabbath Moments"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
        {tab === "hero" ? (
          <HeroImagesSection initialImages={initialHeroImages} />
        ) : (
          <SabbathMomentsSection initialMoments={initialSabbathMoments} />
        )}
      </div>

      <p className="text-center text-xs text-white/25 pb-4">
        Perubahan akan langsung tampil di halaman utama website
      </p>
    </div>
  );
}
