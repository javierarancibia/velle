"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";
import type { ProductRow, ProductVariantRow } from "@/lib/types";

interface Props {
  product: ProductRow;
  variant: ProductVariantRow;
}

export default function PetPortraitProductClient({ product, variant }: Props) {
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [petName, setPetName] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setUploadedUrl(null);
    setUploading(true);
    setError(null);

    try {
      const extension = file.name.split(".").pop() ?? "jpg";
      const targetRes = await fetch("/api/uploads/pet-photo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ extension }),
      });
      const target = (await targetRes.json()) as { uploadUrl: string; publicUrl: string };

      const putRes = await fetch(target.uploadUrl, {
        method: "PUT",
        headers: { "content-type": file.type || "image/jpeg" },
        body: file,
      });
      if (!putRes.ok) throw new Error("Upload failed");

      setUploadedUrl(target.publicUrl);
    } catch {
      setError("Couldn't upload that photo — try again.");
    } finally {
      setUploading(false);
    }
  }

  const canSubmit = Boolean(uploadedUrl && petName.trim() && !uploading);

  async function handleBuyNow() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          productSlug: "pet-portrait",
          variantId: variant.id,
          personalization: {
            kind: "pet-portrait",
            photoUrl: uploadedUrl,
            petName,
            note: note || undefined,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ? JSON.stringify(json.error) : "Checkout failed");
      window.location.href = json.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 grid md:grid-cols-2 gap-12">
      <div className="flex items-center justify-center bg-[#f0ebe2] rounded-lg overflow-hidden min-h-[420px] border border-border">
        {localPreview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={localPreview} alt="Your pet" className="w-full h-full object-contain" />
        ) : (
          <p className="text-muted text-sm px-8 text-center">Upload a photo to see it here.</p>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-medium">{product.name}</h1>
        <p className="mt-2 text-muted">{product.description}</p>
        <p className="mt-4 text-lg">
          {formatPrice(variant.price_cents, variant.currency)} — {variant.label}
        </p>

        <div className="mt-8 space-y-5">
          <div>
            <label className="block text-sm mb-1">Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm"
            />
            {uploading ? <p className="mt-1 text-xs text-muted">Uploading...</p> : null}
            {uploadedUrl ? <p className="mt-1 text-xs text-muted">✓ Photo ready</p> : null}
          </div>

          <div>
            <label className="block text-sm mb-1">Pet&apos;s name</label>
            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              maxLength={80}
              className="w-full border border-border rounded-md px-3 py-2 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Note (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={300}
              rows={2}
              className="w-full border border-border rounded-md px-3 py-2 bg-white"
            />
          </div>
        </div>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={!canSubmit || submitting}
          className="mt-8 w-full bg-accent text-white rounded-md py-3 disabled:opacity-40"
        >
          {submitting ? "Redirecting to checkout..." : "Buy Now"}
        </button>
      </div>
    </div>
  );
}
