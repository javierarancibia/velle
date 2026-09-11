import { randomUUID } from "crypto";
import { supabase } from "./supabase";

// Two public-read buckets, created once in the Supabase dashboard:
// - "uploads": customer-submitted pet photos
// - "print-files": full-resolution rendered/finished print-ready files
// (star map renders, and manually-uploaded stylized pet portraits)

export async function createPetPhotoUploadTarget(
  extension: string
): Promise<{ uploadUrl: string; token: string; publicUrl: string; path: string }> {
  const safeExt = extension.replace(/[^a-z0-9]/gi, "").slice(0, 5) || "jpg";
  const path = `pet-photos/${randomUUID()}.${safeExt}`;

  const { data, error } = await supabase.storage.from("uploads").createSignedUploadUrl(path);
  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from("uploads").getPublicUrl(path);

  return { uploadUrl: data.signedUrl, token: data.token, publicUrl, path };
}

export async function uploadPrintFile(
  path: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  const { error } = await supabase.storage
    .from("print-files")
    .upload(path, buffer, { contentType, upsert: true });
  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from("print-files").getPublicUrl(path);
  return publicUrl;
}
