/** Publication domain — Flash entity (pure DTO, zero dependency). */
export interface FlashAuthor {
  id: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface Flash {
  id: string;
  userId: string;
  content: string;
  category: string | null;
  neighborhood: string | null;
  city: string | null;
  imageUrl: string | null;
  createdAt: string;
  author: FlashAuthor | null;
  /** True while the flash sits in the outbox and has not reached the server. */
  pending?: boolean;
}

export interface FlashDraft {
  content: string;
  category?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  imageUrl?: string | null;
}

/** Shape returned by the Supabase row + manual author join. */
export interface FlashRowLike {
  id: string;
  user_id: string;
  content: string;
  category: string | null;
  neighborhood: string | null;
  city: string | null;
  image_url: string | null;
  created_at: string;
  author?: { id: string; display_name: string | null; avatar_url: string | null } | null;
}

export function toFlash(row: FlashRowLike, pending = false): Flash {
  return {
    id: row.id,
    userId: row.user_id,
    content: row.content,
    category: row.category,
    neighborhood: row.neighborhood,
    city: row.city,
    imageUrl: row.image_url,
    createdAt: row.created_at,
    author: row.author
      ? {
          id: row.author.id,
          displayName: row.author.display_name ?? "Voisin·e",
          avatarUrl: row.author.avatar_url,
        }
      : null,
    pending,
  };
}

/** Relative time in French, "de quartier" tone. */
export function flashAge(iso: string, now = Date.now()): string {
  const diff = Math.max(0, now - new Date(iso).getTime());
  const min = Math.floor(diff / 60000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.floor(h / 24);
  return d === 1 ? "hier" : `il y a ${d} j`;
}
