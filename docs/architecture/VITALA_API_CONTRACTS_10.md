VITALA_API_CONTRACTS

D3I — ORGANIZATION CONTRACTS

Version : 1.0
Statut : Locked

---

ORGANIZATION OVERVIEW

Endpoints :

POST /organizations

GET /organizations

GET /organizations/{organization_id}

PATCH /organizations/{organization_id}

POST /organizations/{organization_id}/verify

GET /organizations/{organization_id}/members

POST /organizations/{organization_id}/invite

POST /organizations/{organization_id}/join

POST /organizations/{organization_id}/leave

---

ORGANIZATION DTO

{
"id": "uuid",

"name": "Tech Africa Hub",

"slug": "tech-africa-hub",

"description": "...",

"organization_type": "COMPANY",

"website_url": "...",

"logo_url": "...",

"country": "Cameroon",

"city": "Douala",

"verification_status": "PENDING",

"created_at": "...",

"updated_at": "..."
}

---

ORGANIZATION TYPES

COMPANY

STARTUP

NGO

UNIVERSITY

COMMUNITY

GOVERNMENT

OTHER

---

VERIFICATION STATUS

PENDING

VERIFIED

REJECTED

SUSPENDED

---

CREATE ORGANIZATION

POST /organizations

---

Request

{
"name": "Tech Africa Hub",
"organization_type": "COMPANY"
}

---

Response

{
"success": true,
"data": {
"organization_id": "uuid"
}
}

---

Errors

VALIDATION_ERROR

ORGANIZATION_ALREADY_EXISTS

---

GET ORGANIZATION

GET /organizations/{organization_id}

---

Response

{
"success": true,
"data": {
"organization": {}
}
}

---

LIST ORGANIZATIONS

GET /organizations

---

Filters

?organization_type=COMPANY

?country=Cameroon

?verification_status=VERIFIED

---

Cursor Pagination

?cursor=...

&limit=20

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

UPDATE ORGANIZATION

PATCH /organizations/{organization_id}

---

Response

{
"success": true
}

---

MEMBER DTO

{
"profile_id": "uuid",

"role": "MEMBER",

"joined_at": "..."
}

---

ORGANIZATION ROLES

OWNER

ADMIN

MANAGER

RECRUITER

MEMBER

---

GET MEMBERS

GET /organizations/{organization_id}/members

---

Response

{
"success": true,
"data": []
}

---

INVITATION DTO

{
"invitation_id": "uuid",

"email": "user@example.com",

"role": "MEMBER",

"status": "PENDING"
}

---

INVITATION STATUS

PENDING

ACCEPTED

DECLINED

EXPIRED

---

INVITE MEMBER

POST /organizations/{organization_id}/invite

---

Request

{
"email": "user@example.com",
"role": "MEMBER"
}

---

Response

{
"success": true,
"data": {
"invitation_id": "uuid"
}
}

---

JOIN ORGANIZATION

POST /organizations/{organization_id}/join

---

Response

{
"success": true
}

---

Conditions :

organisation ouverte

ou invitation valide

---

LEAVE ORGANIZATION

POST /organizations/{organization_id}/leave

---

Response

{
"success": true
}

---

VERIFY ORGANIZATION

POST /organizations/{organization_id}/verify

---

Réservé Admin

---

Response

{
"success": true
}

---

PERMISSION MODEL

OWNER

Accès total

---

ADMIN

Gestion complète

sans suppression organisation

---

MANAGER

Gestion opérationnelle

---

RECRUITER

Gestion opportunités

---

MEMBER

Participation standard

---

REALTIME EVENTS

ORGANIZATION_CREATED

ORGANIZATION_UPDATED

MEMBER_JOINED

MEMBER_LEFT

INVITATION_CREATED

INVITATION_ACCEPTED

ORGANIZATION_VERIFIED

---

REALTIME PAYLOAD

{
"event_id": "uuid",

"event_type": "MEMBER_JOINED",

"organization_id": "uuid",

"profile_id": "uuid",

"created_at": "..."
}

---

OFFLINE CONTRACT

Créer organisation

Oui

---

Modifier organisation

Oui

---

Invitations

Oui

---

Vérification

Non

---

ANALYTICS EVENTS

ORGANIZATION_CREATED

MEMBER_INVITED

MEMBER_JOINED

ORGANIZATION_VERIFIED

ORGANIZATION_UPDATED

---

RATE LIMITS

Create Organization

20 / jour

---

Invite Member

500 / jour

---

Join Organization

100 / jour

---

SECURITY RULES

RLS obligatoire

---

Membres :

lecture selon rôle

---

Admin :

audit complet

---

Invitations signées

---

FUTURE V2

Ajout :

departments

teams

internal projects

---

FUTURE V3

Ajout :

organizational hierarchy

multi-entity organizations

---

FUTURE V4

Ajout :

AI Organization Assistant (Vita Org)

---

GOLDEN RULE

Une organisation est une entité souveraine.

Les permissions sont héritées du rôle organisationnel et jamais du simple statut utilisateur.