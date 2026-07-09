VITALA_API_CONTRACTS

D3E — RADAR CONTRACTS

Version : 1.0
Statut : Locked

---

RADAR OVERVIEW

Endpoints :

POST /radars

PATCH /radars/{radar_id}

GET /radars

GET /radars/{radar_id}

GET /radars/{radar_id}/matches

GET /radars/{radar_id}/analytics

POST /radars/{radar_id}/archive

---

RADAR DTO

{
"id": "uuid",

"title": "Trouver un développeur React",

"description": "...",

"radar_type": "TALENT",

"status": "ACTIVE",

"location_type": "REMOTE",

"country": "Cameroon",

"skills_required": [
"React",
"TypeScript"
],

"languages_required": [
"French",
"English"
],

"created_at": "...",

"updated_at": "..."
}

---

RADAR TYPES

TALENT

JOB

PROJECT

PARTNERSHIP

MENTORSHIP

NETWORKING

---

RADAR STATUS

ACTIVE

PAUSED

ARCHIVED

---

CREATE RADAR

POST /radars

---

Request

{
"title": "...",
"description": "...",
"radar_type": "JOB",
"skills_required": [
"React"
]
}

---

Response

{
"success": true,
"data": {
"radar_id": "uuid"
}
}

---

Errors

VALIDATION_ERROR

RATE_LIMIT_EXCEEDED

---

UPDATE RADAR

PATCH /radars/{radar_id}

---

Request

{
"title": "...",
"description": "..."
}

---

Response

{
"success": true
}

---

LIST RADARS

GET /radars

---

Filters

?status=ACTIVE

?radar_type=JOB

---

Response

{
"success": true,
"data": [],
"meta": {
"page": 1,
"total": 15
}
}

---

GET RADAR

GET /radars/{radar_id}

---

Response

{
"success": true,
"data": {
"radar": {}
}
}

---

RADAR MATCH DTO

{
"id": "uuid",

"entity_type": "PROFILE",

"entity_id": "uuid",

"match_score": 87,

"match_level": "HIGH",

"generated_at": "..."
}

---

ENTITY TYPES

PROFILE

OPPORTUNITY

ORGANIZATION

PROJECT

---

MATCH LEVELS

LOW

MEDIUM

HIGH

EXCELLENT

---

MATCH EXPLANATION DTO

{
"skills_score": 92,

"experience_score": 78,

"location_score": 100,

"icv_score": 74,

"activity_score": 83,

"summary": "Correspondance forte sur les compétences et la localisation."
}

---

GET MATCHES

GET /radars/{radar_id}/matches

---

Filters

?level=HIGH

?entity_type=PROFILE

---

Sorting

?sort=-match_score

---

Response

{
"success": true,
"data": [
{
"match": {},
"explanation": {}
}
]
}

---

RADAR ANALYTICS DTO

{
"views": 245,

"matches_generated": 62,

"high_matches": 18,

"excellent_matches": 6,

"engagement_rate": 42
}

---

GET RADAR ANALYTICS

GET /radars/{radar_id}/analytics

---

Response

{
"success": true,
"data": {}
}

---

ARCHIVE RADAR

POST /radars/{radar_id}/archive

---

Response

{
"success": true
}

---

MATCH REFRESH EVENTS

RADAR_UPDATED

PROFILE_UPDATED

ICV_UPDATED

OPPORTUNITY_CREATED

SYSTEM_REFRESH

---

REALTIME EVENTS

RADAR_CREATED

RADAR_UPDATED

MATCH_GENERATED

MATCH_UPDATED

RADAR_ARCHIVED

---

REALTIME PAYLOAD

{
"event_id": "uuid",

"event_type": "MATCH_GENERATED",

"radar_id": "uuid",

"match_id": "uuid",

"created_at": "..."
}

---

OFFLINE CONTRACT

Création Radar

Oui

---

Modification Radar

Oui

---

Consultation Matches

Lecture cache possible

---

Génération Matches

Serveur uniquement

---

ANALYTICS EVENTS

RADAR_CREATED

RADAR_UPDATED

MATCH_VIEWED

MATCH_CLICKED

RADAR_ARCHIVED

---

RATE LIMITS

Create Radar

20 / jour

---

Update Radar

100 / jour

---

Get Matches

1000 / jour

---

SECURITY RULES

Propriétaire :

accès complet

---

Admin :

accès complet

---

Public :

aucun accès

---

RLS obligatoire

---

FUTURE V2

Ajout :

matching sémantique

embeddings

explications enrichies

---

FUTURE V3

Ajout :

prédictions carrière

prédictions recrutement

---

FUTURE V4

Radar autonome piloté par Vita.

---

GOLDEN RULE

Le Radar décrit une intention.

Les Matches représentent l'interprétation intelligente de cette intention par le moteur de recommandation.