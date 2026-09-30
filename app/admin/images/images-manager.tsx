"use client";

import type { HeroImageRow, SabbathMomentRow } from "./page";

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

import { AccessibleDialog } from "@/components/ui/accessible-dialog";

// ─── Tab ─────────────────────────────────────────────────────────────────────

type Tab = "hero" | "sabbath";

// ─── Hero Images Section ───────────────────────────────────────────────────────

function HeroImagesSection({
  initialImages,
}: {
  initialImages: HeroImageRow[];
}) {
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
        <h2 className="ns-card-title">Hero Carousel</h2>
        <p className="text-sm text-muted-foreground">
          Gambar latar hero section di halaman utama. Akan berganti otomatis
          setiap 5,6 detik.
        </p>
      </div>

      {error && (
        <div className="ns-alert" data-tone="danger" role="alert">
          {error}
        </div>
      )}

      {/* Upload area */}
      <div className="rounded-2xl border border-dashed border-border bg-surface p-5">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <button
            aria-label="Pilih gambar"
            className="relative h-32 w-48 shrink-0 overflow-hidden rounded-xl border border-border bg-surface cursor-pointer hover:border-success transition-colors"
            type="button"
            onClick={() => fileRef.current?.click()}
          >
            {uploadPreview ? (
              <Image
                fill
                alt="Preview"
                className="object-cover"
                src={uploadPreview}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <IconUpload size={28} stroke={1.4} />
                <span className="text-sm">Klik untuk pilih gambar</span>
              </div>
            )}
          </button>

          <div className="flex flex-col gap-3 flex-1">
            <input
              ref={fileRef}
              accept="image/*"
              className="hidden"
              id="hero-upload-input"
              type="file"
              onChange={handleFileSelect}
            />
            <button
              className="ns-secondary"
              type="button"
              onClick={() => fileRef.current?.click()}
            >
              <IconPhoto size={16} /> Pilih gambar hero
            </button>
            {uploadFile && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground truncate">
                  {uploadFile.name}
                </p>
                <button
                  className="ns-primary shrink-0"
                  disabled={isPending}
                  id="hero-upload-confirm"
                  type="button"
                  onClick={handleUpload}
                >
                  {isPending ? (
                    <IconLoader2 className="animate-spin" size={15} />
                  ) : (
                    <IconUpload size={15} />
                  )}
                  {isPending ? "Mengupload..." : "Upload Gambar"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image grid */}
      {images.length === 0 ? (
        <div className="flex min-h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-border text-muted-foreground">
          <IconPhoto size={32} stroke={1.4} />
          <p className="mt-2 text-sm">Belum ada gambar hero</p>
          <p className="text-sm">Upload gambar pertama di atas</p>
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img, i) => (
            <div
              key={img.id}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-surface"
            >
              <Image
                fill
                alt={`Hero image ${i + 1}`}
                className="object-cover"
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                src={img.public_url}
              />
              {/* Order badge */}
              <div className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-sm font-bold text-white">
                #{i + 1}
              </div>
              {/* Delete button */}
              <div className="absolute bottom-2 right-2">
                <button
                  aria-label="Hapus gambar"
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface text-foreground hover:bg-surface disabled:opacity-50 transition-colors"
                  disabled={isPending && deletingId === img.id}
                  id={`delete-hero-${img.id}`}
                  onClick={() => handleDelete(img.id, img.storage_path)}
                >
                  {isPending && deletingId === img.id ? (
                    <IconLoader2 className="animate-spin" size={16} />
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
    <AccessibleDialog
      open
      className="left-1/2 top-1/2 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl"
      title="Edit Sabbath Moment"
      onClose={onClose}
    >
      <form className="p-6 space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label className="ns-label" htmlFor="edit-moment-label">
            Label
          </label>
          <input
            className="ns-field"
            id="edit-moment-label"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="ns-label" htmlFor="edit-moment-title">
            Judul
          </label>
          <input
            className="ns-field"
            id="edit-moment-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="ns-label" htmlFor="edit-moment-desc">
            Deskripsi
          </label>
          <textarea
            className="ns-field resize-y"
            id="edit-moment-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {error && (
          <p className="ns-alert" data-tone="danger" role="alert">
            {error}
          </p>
        )}
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
            id="edit-moment-submit"
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

function SabbathMomentsSection({
  initialMoments,
}: {
  initialMoments: SabbathMomentRow[];
}) {
  const [moments, setMoments] = useState<SabbathMomentRow[]>(initialMoments);
  const [editMoment, setEditMoment] = useState<SabbathMomentRow | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  // Add form state
  const [newLabel, setNewLabel] = useState(
    `Moment ${String(moments.length + 1).padStart(2, "0")}`,
  );
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
    if (!newFile || !newTitle.trim()) {
      setError("Gambar dan judul wajib diisi");

      return;
    }
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
        <EditMomentModal
          moment={editMoment}
          onClose={() => setEditMoment(null)}
          onUpdated={handleUpdated}
        />
      )}

      <div className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="ns-card-title">Sabbath Moments</h2>
            <p className="text-sm text-muted-foreground">
              Foto-foto yang ditampilkan dalam scroll stack &quot;Momen
              Sabat&quot; di halaman utama.
            </p>
          </div>
          <button
            className="ns-primary"
            id="add-moment-btn"
            onClick={() => setShowAdd((v) => !v)}
          >
            {showAdd ? <IconX size={15} /> : <IconPlus size={15} />}
            {showAdd ? "Batal" : "Tambah Momen"}
          </button>
        </div>

        {error && (
          <div className="ns-alert" data-tone="danger" role="alert">
            {error}
          </div>
        )}

        {/* Add form */}
        {showAdd && (
          <div className="rounded-2xl border border-success bg-card p-5 space-y-4">
            <h3 className="ns-card-title">Tambah Momen Baru</h3>
            <div className="flex flex-col gap-4 sm:flex-row">
              {/* Preview */}
              <button
                aria-label="Pilih gambar"
                className="relative h-40 w-full sm:w-48 shrink-0 overflow-hidden rounded-xl border border-border bg-surface cursor-pointer hover:border-success transition-colors"
                type="button"
                onClick={() => fileRef.current?.click()}
              >
                {newPreview ? (
                  <Image
                    fill
                    alt="Preview"
                    className="object-cover"
                    src={newPreview}
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                    <IconUpload size={24} stroke={1.4} />
                    <span className="text-sm">Klik untuk pilih gambar</span>
                  </div>
                )}
              </button>
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <input
                  ref={fileRef}
                  accept="image/*"
                  className="hidden"
                  id="moment-upload-input"
                  type="file"
                  onChange={handleFileSelect}
                />
                <button
                  className="ns-secondary"
                  type="button"
                  onClick={() => fileRef.current?.click()}
                >
                  <IconPhoto size={14} />{" "}
                  {newPreview ? "Ganti gambar" : "Pilih gambar *"}
                </button>
                <label className="ns-label" htmlFor="moment-label">
                  Label
                </label>
                <input
                  className="ns-field"
                  id="moment-label"
                  placeholder="Label (e.g. Moment 06)"
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                />
                <label className="ns-label" htmlFor="moment-title">
                  Judul momen *
                </label>
                <input
                  className="ns-field"
                  id="moment-title"
                  placeholder="Judul momen *"
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <label className="ns-label" htmlFor="moment-description">
                  Deskripsi singkat
                </label>
                <textarea
                  className="ns-field resize-y"
                  id="moment-description"
                  placeholder="Deskripsi singkat"
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
                <button
                  className="ns-primary"
                  disabled={isPending}
                  id="add-moment-confirm"
                  type="button"
                  onClick={handleAdd}
                >
                  {isPending ? (
                    <IconLoader2 className="animate-spin" size={15} />
                  ) : (
                    <IconUpload size={15} />
                  )}
                  {isPending ? "Mengupload..." : "Upload Momen"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Moments list */}
        {moments.length === 0 ? (
          <div className="flex min-h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-border text-muted-foreground">
            <IconPhoto size={32} stroke={1.4} />
            <p className="mt-2 text-sm">Belum ada foto Sabbath Moment</p>
          </div>
        ) : (
          <div className="space-y-3">
            {moments.map((moment, i) => (
              <div
                key={moment.id}
                className={`group grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 overflow-hidden rounded-2xl border bg-surface p-4 transition-colors duration-200 sm:grid-cols-[6rem_minmax(0,1fr)_auto] sm:items-center ${
                  savedId === moment.id
                    ? "border-success"
                    : "border-border hover:border-border"
                }`}
              >
                {/* Thumbnail */}
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-surface">
                  <Image
                    fill
                    alt={moment.title}
                    className="object-cover"
                    sizes="96px"
                    src={moment.public_url}
                  />
                </div>

                {/* Info */}
                <div className="col-span-2 row-start-2 min-w-0 sm:col-span-1 sm:col-start-2 sm:row-start-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-card px-2 py-0.5 text-sm font-semibold text-success">
                      #{i + 1}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {moment.label}
                    </span>
                    {savedId === moment.id && (
                      <span className="flex items-center gap-0.5 text-sm text-success">
                        <IconCheck size={10} /> Tersimpan
                      </span>
                    )}
                  </div>
                  <p className="mt-1 break-words text-sm font-semibold text-foreground">
                    {moment.title}
                  </p>
                  <p className="break-words text-sm text-muted-foreground">
                    {moment.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="col-start-2 row-start-1 flex items-center gap-2 sm:col-start-3">
                  <button
                    aria-label="Edit momen"
                    className="flex h-11 w-11 items-center justify-center rounded-lg bg-surface text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
                    id={`edit-moment-${moment.id}`}
                    onClick={() => setEditMoment(moment)}
                  >
                    <IconPencil size={14} stroke={1.8} />
                  </button>
                  <button
                    aria-label="Hapus momen"
                    className="flex h-11 w-11 items-center justify-center rounded-lg bg-surface text-destructive hover:bg-surface hover:text-destructive disabled:opacity-50 transition-colors"
                    disabled={isPending && deletingId === moment.id}
                    id={`delete-moment-${moment.id}`}
                    onClick={() => handleDelete(moment.id, moment.storage_path)}
                  >
                    {isPending && deletingId === moment.id ? (
                      <IconLoader2 className="animate-spin" size={14} />
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
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="ns-title">Galeri & Carousel</h1>
        <p className="ns-copy mt-3">
          Kelola gambar hero carousel dan foto Sabbath Moments di halaman utama.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-2xl border border-border bg-surface p-1">
        {(["hero", "sabbath"] as Tab[]).map((t) => (
          <button
            key={t}
            aria-pressed={tab === t}
            className={`min-h-12 flex-1 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200 ${
              tab === t
                ? "bg-card text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            id={`images-tab-${t}`}
            onClick={() => setTab(t)}
          >
            {t === "hero" ? "Hero Carousel" : "Sabbath Moments"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="ns-surface">
        {tab === "hero" ? (
          <HeroImagesSection initialImages={initialHeroImages} />
        ) : (
          <SabbathMomentsSection initialMoments={initialSabbathMoments} />
        )}
      </div>

      <p className="text-center text-sm text-muted-foreground pb-4">
        Perubahan akan langsung tampil di halaman utama website
      </p>
    </div>
  );
}
