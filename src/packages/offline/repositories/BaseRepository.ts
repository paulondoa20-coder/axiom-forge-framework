import type { Table } from "dexie";
import { getDb } from "../dexie/db";

/**
 * Base offline-first repository. Reads go through Dexie with a seed
 * fallback for SSR / first-run; writes are local + queued via outbox
 * by the concrete repository.
 */
export abstract class BaseRepository<TDto, TRecord extends { id: string }> {
  protected abstract tableName: keyof ReturnType<typeof getDb> extends never ? string : string;
  protected abstract seed: TDto[];
  protected abstract toDto(record: TRecord): TDto;
  protected abstract toRecord(dto: TDto): TRecord;

  private table(): Table<TRecord, string> | null {
    const db = getDb() as unknown as Record<string, Table<TRecord, string>> | null;
    if (!db) return null;
    return db[this.tableName] ?? null;
  }

  async list(): Promise<TDto[]> {
    const t = this.table();
    if (!t) return this.seed;
    const rows = await t.toArray();
    if (rows.length === 0) {
      await t.bulkPut(this.seed.map((d) => this.toRecord(d)));
      return this.seed;
    }
    return rows.map((r) => this.toDto(r));
  }

  async get(id: string): Promise<TDto | undefined> {
    const t = this.table();
    if (!t) return this.seed.find((d) => (d as { id: string }).id === id);
    const rec = await t.get(id);
    return rec ? this.toDto(rec) : undefined;
  }

  async upsert(dto: TDto): Promise<void> {
    const t = this.table();
    if (!t) return;
    await t.put(this.toRecord(dto));
  }
}
