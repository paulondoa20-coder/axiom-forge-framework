import { getDb, enqueue, type FlashRecord } from "@/packages/offline";
import { listPublicFlashes, listMyFlashes, deleteFlashRemote } from "@/lib/publication.functions";
import { toFlash, type Flash, type FlashDraft, type FlashRowLike } from "../entities/Flash";

/**
 * FlashRepository — offline-first.
 *
 * Reads: Dexie mirror first (instant), then remote refresh which re-fills the
 * mirror. Writes: local insert + outbox enqueue, drained by the sync engine.
 */
export class FlashRepository {
  private toRecord(flash: Flash, mine: boolean, pending: boolean): FlashRecord {
    return {
      id: flash.id,
      data: flash,
      mine: mine ? 1 : 0,
      pending: pending ? 1 : 0,
      createdAt: new Date(flash.createdAt).getTime(),
      updatedAt: Date.now(),
    };
  }

  /** Local cache read, newest first. */
  async cached(opts: { mineOnly?: boolean; limit?: number } = {}): Promise<Flash[]> {
    const db = getDb();
    if (!db) return [];
    const rows = await db.flashes.orderBy("createdAt").reverse().toArray();
    const filtered = opts.mineOnly ? rows.filter((r) => r.mine === 1) : rows;
    return filtered.slice(0, opts.limit ?? 50).map((r) => r.data as Flash);
  }

  /** Public feed from the server; refreshes the local mirror. */
  async feed(limit = 20): Promise<Flash[]> {
    const rows = (await listPublicFlashes({ data: { limit } })) as unknown as FlashRowLike[];
    const flashes = rows.map((r) => toFlash(r));
    const db = getDb();
    if (db) {
      const existing = await db.flashes.bulkGet(flashes.map((f) => f.id));
      await db.flashes.bulkPut(
        flashes.map((f, i) => this.toRecord(f, existing[i]?.mine === 1, false)),
      );
    }
    return flashes;
  }

  /** The signed-in user's flashes. */
  async mine(): Promise<Flash[]> {
    const rows = (await listMyFlashes()) as unknown as FlashRowLike[];
    const flashes = rows.map((r) => toFlash(r));
    const db = getDb();
    if (db) await db.flashes.bulkPut(flashes.map((f) => this.toRecord(f, true, false)));
    return flashes;
  }

  /** Optimistic local create + outbox enqueue. */
  async create(draft: FlashDraft, author: { id: string; displayName: string; avatarUrl: string | null }): Promise<Flash> {
    const id = crypto.randomUUID();
    const flash: Flash = {
      id,
      userId: author.id,
      content: draft.content,
      category: draft.category ?? null,
      neighborhood: draft.neighborhood ?? null,
      city: draft.city ?? null,
      imageUrl: draft.imageUrl ?? null,
      createdAt: new Date().toISOString(),
      author: { id: author.id, displayName: author.displayName, avatarUrl: author.avatarUrl },
      pending: true,
    };

    const db = getDb();
    if (db) await db.flashes.put(this.toRecord(flash, true, true));

    await enqueue("publication", "create_flash", {
      id,
      content: flash.content,
      category: flash.category,
      neighborhood: flash.neighborhood,
      city: flash.city,
      image_url: flash.imageUrl,
    });

    return flash;
  }

  /** Clear the pending flag once the outbox handler confirmed the write. */
  async markSynced(id: string): Promise<void> {
    const db = getDb();
    if (!db) return;
    const rec = await db.flashes.get(id);
    if (!rec) return;
    const data = { ...(rec.data as Flash), pending: false };
    await db.flashes.put({ ...rec, data, pending: 0, updatedAt: Date.now() });
  }

  async remove(id: string): Promise<void> {
    const db = getDb();
    if (db) await db.flashes.delete(id);
    await deleteFlashRemote({ data: { id } });
  }
}

export const flashRepository = new FlashRepository();
