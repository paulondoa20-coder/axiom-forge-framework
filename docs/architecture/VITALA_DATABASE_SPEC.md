VITALA_DATABASE_SPEC

D4 — DATABASE MASTER SPEC

Version : 1.0
Statut : Locked

---

PRINCIPES GÉNÉRAUX

- PostgreSQL obligatoire
- UUID comme clé primaire globale
- Soft delete par défaut ("deleted_at")
- Audit timestamps obligatoires
- RLS (Row Level Security) obligatoire partout
- Multi-tenant ready (organizations)
- Index obligatoire sur toutes les FK

---

BASE TABLES CORE

---

users

- id (uuid, PK)
- email (unique)
- password_hash
- role (USER / ADMIN)
- status (ACTIVE / SUSPENDED / BANNED)
- created_at
- updated_at
- deleted_at

Indexes:

- email UNIQUE
- status
- created_at

---

profiles

- id (uuid, PK)
- user_id (FK users.id)
- first_name
- last_name
- headline
- bio
- avatar_url
- country
- city
- icv_score (int)
- created_at
- updated_at

Indexes:

- user_id UNIQUE
- icv_score
- country

---

organizations

- id (uuid, PK)
- name
- slug UNIQUE
- description
- type
- country
- city
- verification_status
- created_at
- updated_at
- deleted_at

Indexes:

- slug UNIQUE
- verification_status

---

organization_members

- id (uuid, PK)
- organization_id (FK)
- profile_id (FK)
- role (OWNER / ADMIN / MEMBER / RECRUITER)
- created_at

Indexes:

- organization_id
- profile_id

Unique:

- (organization_id, profile_id)

---

flashes

- id (uuid, PK)
- author_id (FK profiles)
- title
- content
- flash_type
- visibility
- status
- response_count
- reaction_count
- view_count
- created_at
- updated_at
- deleted_at

Indexes:

- author_id
- flash_type
- status
- created_at DESC

---

flash_responses

- id (uuid, PK)
- flash_id (FK)
- author_id (FK)
- content
- created_at

Indexes:

- flash_id
- author_id

---

flash_reactions

- id (uuid, PK)
- flash_id (FK)
- profile_id (FK)
- reaction_type
- created_at

Unique:

- (flash_id, profile_id, reaction_type)

---

radars

- id (uuid, PK)
- owner_id (FK profiles)
- title
- description
- type
- status
- country
- location_type
- created_at
- updated_at
- deleted_at

Indexes:

- owner_id
- type
- status

---

radar_matches

- id (uuid, PK)
- radar_id (FK)
- entity_type
- entity_id
- match_score
- match_level
- created_at

Indexes:

- radar_id
- match_score DESC

---

opportunities

- id (uuid, PK)
- organization_id (FK)
- title
- description
- type
- work_mode
- country
- city
- status
- created_at
- updated_at
- deleted_at

Indexes:

- organization_id
- type
- status

---

applications

- id (uuid, PK)
- opportunity_id (FK)
- profile_id (FK)
- status
- message
- created_at
- updated_at

Indexes:

- opportunity_id
- profile_id
- status

Unique:

- (opportunity_id, profile_id)

---

conversations

- id (uuid, PK)
- type
- title
- created_at
- updated_at

Indexes:

- type

---

conversation_members

- id (uuid, PK)
- conversation_id (FK)
- profile_id (FK)
- role
- joined_at

Indexes:

- conversation_id
- profile_id

---

messages

- id (uuid, PK)
- client_message_id (uuid)
- conversation_id (FK)
- author_id (FK)
- content
- status
- created_at
- updated_at

Indexes:

- conversation_id
- created_at DESC
- client_message_id UNIQUE

---

organizations_invitations

- id (uuid, PK)
- organization_id (FK)
- email
- role
- status
- created_at

Indexes:

- organization_id
- email

---

vita_goals

- id (uuid, PK)
- profile_id (FK)
- title
- status
- progress
- created_at
- updated_at

Indexes:

- profile_id
- status

---

vita_memories

- id (uuid, PK)
- profile_id (FK)
- memory_type
- content
- created_at
- updated_at

Indexes:

- profile_id
- memory_type

---

support_tickets

- id (uuid, PK)
- ticket_number UNIQUE
- created_by (FK profiles)
- subject
- description
- category
- priority
- status
- assigned_to (FK nullable)
- created_at
- updated_at

Indexes:

- status
- priority
- created_by

---

billing_plans

- id (uuid, PK)
- code UNIQUE
- name
- price
- currency
- billing_cycle
- created_at

---

billing_subscriptions

- id (uuid, PK)
- profile_id (FK)
- plan_id (FK)
- status
- auto_renew
- started_at
- expires_at

Indexes:

- profile_id
- status

---

billing_invoices

- id (uuid, PK)
- subscription_id (FK)
- invoice_number UNIQUE
- amount
- currency
- status
- issued_at
- pdf_url

Indexes:

- subscription_id
- status

---

GLOBAL RLS RULES

---

Users can only access:

- leurs propres profils
- leurs propres messages
- leurs propres candidatures
- leurs propres factures
- leurs propres radars
- leurs propres mémoires Vita
- leurs conversations

---

Organizations :

- accès uniquement aux membres
- roles strictement appliqués

---

Admin :

- accès contrôlé par rôle

---

TRIGGERS

---

updated_at auto-update

---

response_count auto increment (flashes)

---

reaction_count auto increment (flashes)

---

view_count auto increment (flashes)

---

match_score recalculation trigger (radar_matches)

---

PARTITIONS (OPTIONNEL V1)

messages

flash_responses

analytics_events

---

AUDIT TABLE

audit_logs

- id
- actor_id
- action
- entity_type
- entity_id
- created_at

---

PERFORMANCE RULES

- 모든 FK must be indexed
- no table without created_at
- heavy tables partitioned
- JSONB only for flexible metadata
- avoid over-normalization in hot paths

---

SECURITY RULES

- RLS mandatory everywhere
- no direct admin bypass
- all writes audited
- sensitive data encrypted
- passwords bcrypt/argon2 only

---

FUTURE EXTENSIONS

- vector embeddings table (AI search)
- event sourcing layer
- read replicas
- multi-region support

---

GOLDEN RULE

La base de données est la source de vérité absolue.

Aucune logique métier ne doit contourner les contraintes définies ici.