import { NextResponse } from "next/server";
import { createPetPhotoUploadTarget } from "@/lib/uploads";

export async function POST(req: Request) {
  const { extension } = (await req.json()) as { extension?: string };
  const target = await createPetPhotoUploadTarget(extension ?? "jpg");
  return NextResponse.json(target);
}
