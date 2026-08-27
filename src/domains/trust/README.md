# Trust Domain

Provides trust score, verifications, proofs, and feedback for a profile.

## Structure

```
trust/
  entities/TrustProfile.ts       — types (TrustProfile, TrustFeedback, …)
  data/seed.ts                   — local seed / offline fallback
  repositories/TrustRepository.ts — Supabase queries with seed fallback
  use-cases/
    GetTrustProfile.ts           — fetch one profile or list
    ListFeedbacks.ts             — fetch feedbacks for a profile
    SubmitVerification.ts        — request a new verification
  hooks/useTrustProfile.ts       — React hook (returns profile + feedbacks)
  index.ts                       — public barrel
```

## Usage

```tsx
import { useTrustProfile } from "@/domains/trust";

const { profile, feedbacks, loading } = useTrustProfile(profileId);
```

## Offline behaviour

When the Supabase table is absent or returns no rows, the repository falls back to seed data so the page is always renderable.
