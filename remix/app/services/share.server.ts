import { db } from "~/db";
import { instruments } from "~/framework/instruments";
import type { ChannelData } from "~/db/types";

// Types
export interface ShareData {
  channels: ChannelData[];
  bpm: number;
}

export interface LegacyGuia {
  sequence: string;
  tempo: string | number;
  sample: string;
}

// Instrument name to path mapping
const instrumentNameToPath: Record<string, string> = {};
const instrumentPathToName: Record<string, string> = {};

for (const instrument of instruments) {
  instrumentNameToPath[instrument.name] = instrument.path;
  instrumentPathToName[instrument.path] = instrument.name;
}

// URL Serialization (Base64 encoded JSON)
export function encodeShareData(data: ShareData): string {
  const json = JSON.stringify(data);
  // Use Buffer for server-side Base64 encoding
  return Buffer.from(json, "utf-8").toString("base64url");
}

export function decodeShareData(encoded: string): ShareData | null {
  try {
    const json = Buffer.from(encoded, "base64url").toString("utf-8");
    return JSON.parse(json) as ShareData;
  } catch {
    return null;
  }
}

// Legacy format parsing
export function parseLegacyGuias(guiasJson: string): ShareData | null {
  try {
    const guias: LegacyGuia[] = JSON.parse(guiasJson);

    if (!Array.isArray(guias) || guias.length === 0) {
      return null;
    }

    // Use the tempo from the first guia as the global BPM
    const bpm = Number(guias[0].tempo) || 120;

    const channels: ChannelData[] = guias.map((guia) => ({
      pattern: guia.sequence,
      sample: instrumentNameToPath[guia.sample] || `/samples/${guia.sample}.wav`,
    }));

    return { channels, bpm };
  } catch {
    return null;
  }
}

// Generate short slug for compositions
export function generateSlug(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let slug = "";
  for (let i = 0; i < 8; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug;
}

// Database operations
export async function saveComposition(
  data: ShareData,
  options?: {
    userId?: string;
    folderId?: string;
    title?: string;
    isPublic?: boolean;
  }
) {
  const id = crypto.randomUUID() as string;
  let slug = generateSlug();

  // Ensure slug is unique
  let attempts = 0;
  while (attempts < 10) {
    const existing = await db
      .selectFrom("compositions")
      .select("id")
      .where("slug", "=", slug)
      .executeTakeFirst();

    if (!existing) break;
    slug = generateSlug();
    attempts++;
  }

  await db
    .insertInto("compositions")
    .values({
      id,
      slug,
      title: options?.title || null,
      user_id: options?.userId || null,
      folder_id: options?.folderId || null,
      bpm: data.bpm,
      channels: JSON.stringify(data.channels),
      is_public: options?.isPublic ?? true,
    } as any)
    .execute();

  return { id, slug };
}

export async function getCompositionBySlug(slug: string) {
  const composition = await db
    .selectFrom("compositions")
    .selectAll()
    .where("slug", "=", slug)
    .executeTakeFirst();

  if (!composition) return null;

  // Parse channels JSON
  return {
    ...composition,
    channels:
      typeof composition.channels === "string"
        ? (JSON.parse(composition.channels) as ChannelData[])
        : (composition.channels as ChannelData[]),
  };
}

export async function getCompositionsByUser(userId: string) {
  const compositions = await db
    .selectFrom("compositions")
    .selectAll()
    .where("user_id", "=", userId)
    .orderBy("created_at", "desc")
    .execute();

  return compositions.map((c) => ({
    ...c,
    channels:
      typeof c.channels === "string"
        ? (JSON.parse(c.channels) as ChannelData[])
        : (c.channels as ChannelData[]),
  }));
}

export async function getCompositionsByFolder(folderId: string) {
  const compositions = await db
    .selectFrom("compositions")
    .selectAll()
    .where("folder_id", "=", folderId)
    .orderBy("created_at", "desc")
    .execute();

  return compositions.map((c) => ({
    ...c,
    channels:
      typeof c.channels === "string"
        ? (JSON.parse(c.channels) as ChannelData[])
        : (c.channels as ChannelData[]),
  }));
}

export async function updateComposition(
  id: string,
  data: Partial<{
    title: string | null;
    folderId: string | null;
    bpm: number;
    channels: ChannelData[];
    isPublic: boolean;
  }>
) {
  const updateData: Record<string, any> = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.folderId !== undefined) updateData.folder_id = data.folderId;
  if (data.bpm !== undefined) updateData.bpm = data.bpm;
  if (data.channels !== undefined)
    updateData.channels = JSON.stringify(data.channels);
  if (data.isPublic !== undefined) updateData.is_public = data.isPublic;

  await db
    .updateTable("compositions")
    .set(updateData)
    .where("id", "=", id)
    .execute();
}

export async function deleteComposition(id: string) {
  await db.deleteFrom("compositions").where("id", "=", id).execute();
}

// Folder operations
export async function createFolder(userId: string, name: string) {
  const id = crypto.randomUUID() as string;

  await db
    .insertInto("folders")
    .values({
      id,
      name,
      user_id: userId,
    } as any)
    .execute();

  return { id, name };
}

export async function getFoldersByUser(userId: string) {
  return db
    .selectFrom("folders")
    .selectAll()
    .where("user_id", "=", userId)
    .orderBy("name", "asc")
    .execute();
}

export async function updateFolder(id: string, name: string) {
  await db.updateTable("folders").set({ name }).where("id", "=", id).execute();
}

export async function deleteFolder(id: string) {
  await db.deleteFrom("folders").where("id", "=", id).execute();
}
