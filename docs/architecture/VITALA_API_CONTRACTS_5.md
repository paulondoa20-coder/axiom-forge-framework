VITALA_API_CONTRACTS

D3D — FLASH CONTRACTS

Version : 1.0
Statut : Locked

---

FLASH OVERVIEW

Endpoints :

POST /flash

PATCH /flash/{flash_id}

POST /flash/{flash_id}/archive

GET /flash/{flash_id}

GET /flash/feed

POST /flash/{flash_id}/responses

POST /flash/{flash_id}/reactions

GET /flash/{flash_id}/responses

---

FLASH DTO

{
"id": "uuid",

"author": {
"id": "uuid",
"first_name": "John",
"last_name": "Doe",
"headline": "Frontend Developer",
"avatar_url": "..."
},

"title": "Comment trouver des clients ?",

"content": "...",

"flash_type": "QUESTION",

"visibility": "PUBLIC",

"status": "ACTIVE",

"response_count": 12,

"reaction_count": 45,

"view_count": 320,

"created_at": "...",

"updated_at": "..."
}

---

FLASH TYPES

QUESTION

INSIGHT

TIP

OPPORTUNITY

DISCUSSION

ANNOUNCEMENT

---

FLASH VISIBILITY

PUBLIC

NETWORK

PRIVATE

---

CREATE FLASH

POST /flash

---

Request

{
"title": "...",
"content": "...",
"flash_type": "QUESTION",
"visibility": "PUBLIC"
}

---

Response

{
"success": true,
"data": {
"flash_id": "uuid"
}
}

---

Errors

VALIDATION_ERROR

RATE_LIMIT_EXCEEDED

---

UPDATE FLASH

PATCH /flash/{flash_id}

---

Request

{
"title": "...",
"content": "..."
}

---

Response

{
"success": true
}

---

Errors

FLASH_NOT_FOUND

FORBIDDEN

---

ARCHIVE FLASH

POST /flash/{flash_id}/archive

---

Response

{
"success": true
}

---

GET FLASH

GET /flash/{flash_id}

---

Response

{
"success": true,
"data": {
"flash": {}
}
}

---

FLASH FEED

GET /flash/feed

---

Filters

?flash_type=QUESTION

?country=Cameroon

?search=react

?sort=-created_at

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

RESPONSE DTO

{
"id": "uuid",

"flash_id": "uuid",

"author": {},

"content": "...",

"created_at": "..."
}

---

CREATE RESPONSE

POST /flash/{flash_id}/responses

---

Request

{
"content": "..."
}

---

Response

{
"success": true,
"data": {
"response_id": "uuid"
}
}

---

Errors

FLASH_NOT_FOUND

FLASH_ARCHIVED

---

REACTION DTO

{
"id": "uuid",

"reaction_type": "LIKE"
}

---

REACTION TYPES

LIKE

HELPFUL

INTERESTING

INSIGHTFUL

CELEBRATE

---

ADD REACTION

POST /flash/{flash_id}/reactions

---

Request

{
"reaction_type": "LIKE"
}

---

Response

{
"success": true
}

---

Errors

REACTION_ALREADY_EXISTS

---

FEED SORTING

LATEST

---

TRENDING

---

MOST_RESPONDED

---

MOST_VIEWED

---

FEED ALGORITHM V1

Score =

Recency

+

Responses

+

Reactions

+

Views

---

REALTIME EVENTS

FLASH_CREATED

FLASH_UPDATED

FLASH_ARCHIVED

FLASH_RESPONSE_CREATED

FLASH_REACTION_CREATED

---

REALTIME PAYLOAD

{
"event_id": "uuid",

"event_type": "FLASH_CREATED",

"entity_id": "uuid",

"created_at": "..."
}

---

OFFLINE CONTRACT

Client Message

↓

sync_queue

↓

Server Validation

↓

Confirmation

---

ANALYTICS EVENTS

FLASH_CREATED

FLASH_VIEWED

FLASH_UPDATED

FLASH_ARCHIVED

FLASH_RESPONDED

FLASH_REACTED

---

RATE LIMITS

Create Flash

30 / jour

---

Update Flash

100 / jour

---

Responses

200 / jour

---

Reactions

1000 / jour

---

SECURITY RULES

Auteur :

édition

archivage

---

Public :

lecture selon visibilité

---

Admin :

modération

---

RLS obligatoire

---

FUTURE V2

Ajout :

hashtags

mentions

bookmarks

---

FUTURE V3

Ajout :

polls

attachments

media posts

---

FUTURE V4

Ajout :

résumés IA

traduction automatique

recommandations Vita

---

GOLDEN RULE

Un Flash est une unité de partage rapide.

Les compteurs (views, reactions, responses) sont toujours calculés et validés côté serveur.