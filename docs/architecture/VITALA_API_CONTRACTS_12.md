VITALA_API_CONTRACTS

D3L — ADMIN CONTRACTS

Version : 1.0
Statut : Locked

---

ADMIN OVERVIEW

Endpoints :

GET /admin/users

GET /admin/users/{user_id}

PATCH /admin/users/{user_id}

GET /admin/organizations

PATCH /admin/organizations/{organization_id}

GET /admin/reports

POST /admin/reports/{report_id}/resolve

GET /admin/audit

GET /admin/feature-flags

PATCH /admin/feature-flags/{flag_id}

---

ADMIN ROLES

SUPPORT_AGENT

MODERATOR

ADMIN

SUPER_ADMIN

---

ROLE HIERARCHY

SUPPORT_AGENT

↓

MODERATOR

↓

ADMIN

↓

SUPER_ADMIN

---

USER ADMIN DTO

{
"id": "uuid",

"email": "user@example.com",

"status": "ACTIVE",

"role": "USER",

"created_at": "...",

"last_login_at": "..."
}

---

USER STATUS

ACTIVE

SUSPENDED

BANNED

DELETED

---

GET USERS

GET /admin/users

---

Filters

?status=ACTIVE

?country=Cameroon

?role=USER

---

Cursor Pagination

?cursor=...

&limit=50

---

Response

{
"success": true,
"data": [],
"meta": {
"next_cursor": "..."
}
}

---

UPDATE USER

PATCH /admin/users/{user_id}

---

Actions

Suspend

Ban

Restore

Role Change

---

Response

{
"success": true
}

---

ORGANIZATION ADMIN DTO

{
"id": "uuid",

"name": "Tech Africa Hub",

"verification_status": "PENDING"
}

---

GET ORGANIZATIONS

GET /admin/organizations

---

Filters

?verification_status=PENDING

---

Response

{
"success": true,
"data": []
}

---

UPDATE ORGANIZATION

PATCH /admin/organizations/{organization_id}

---

Actions

Verify

Reject

Suspend

Restore

---

REPORT DTO

{
"id": "uuid",

"entity_type": "FLASH",

"entity_id": "uuid",

"reason": "Spam",

"status": "OPEN"
}

---

REPORT ENTITY TYPES

PROFILE

FLASH

MESSAGE

ORGANIZATION

OPPORTUNITY

---

REPORT STATUS

OPEN

REVIEWING

RESOLVED

REJECTED

---

GET REPORTS

GET /admin/reports

---

Response

{
"success": true,
"data": []
}

---

RESOLVE REPORT

POST /admin/reports/{report_id}/resolve

---

Response

{
"success": true
}

---

AUDIT LOG DTO

{
"audit_id": "uuid",

"actor_id": "uuid",

"action": "USER_SUSPENDED",

"entity_type": "USER",

"entity_id": "uuid",

"created_at": "..."
}

---

GET AUDIT LOGS

GET /admin/audit

---

Filters

?actor_id=uuid

?action=USER_SUSPENDED

---

Response

{
"success": true,
"data": []
}

---

FEATURE FLAG DTO

{
"id": "uuid",

"key": "new_radar_engine",

"enabled": true
}

---

GET FEATURE FLAGS

GET /admin/feature-flags

---

Response

{
"success": true,
"data": []
}

---

UPDATE FEATURE FLAG

PATCH /admin/feature-flags/{flag_id}

---

Response

{
"success": true
}

---

REALTIME EVENTS

USER_SUSPENDED

USER_RESTORED

REPORT_CREATED

REPORT_RESOLVED

ORGANIZATION_VERIFIED

FEATURE_FLAG_UPDATED

---

REALTIME PAYLOAD

{
"event_id": "uuid",

"event_type": "REPORT_RESOLVED",

"entity_id": "uuid",

"created_at": "..."
}

---

OFFLINE CONTRACT

Lecture audits

Oui

---

Lecture rapports

Oui

---

Actions admin

Non

---

ANALYTICS EVENTS

REPORT_CREATED

REPORT_RESOLVED

USER_SUSPENDED

ORGANIZATION_VERIFIED

FEATURE_FLAG_UPDATED

---

RATE LIMITS

Admin Actions

10000 / jour

---

Audit Queries

50000 / jour

---

SECURITY RULES

SUPPORT_AGENT

lecture limitée

---

MODERATOR

modération contenu

---

ADMIN

gestion plateforme

---

SUPER_ADMIN

accès total

---

MFA obligatoire

---

Audit obligatoire

---

Toutes les actions critiques journalisées

---

FUTURE V2

Ajout :

bulk actions

automated moderation

---

FUTURE V3

Ajout :

risk scoring

fraud detection

---

FUTURE V4

Ajout :

AI moderation assistant

AI governance assistant

---

GOLDEN RULE

Toute action administrative doit être :

authentifiée

autorisée

journalisée

traçable

réversible lorsque possible.