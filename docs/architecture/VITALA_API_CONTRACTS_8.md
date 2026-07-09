VITALA_API_CONTRACTS

D3G — OPPORTUNITY CONTRACTS

Version : 1.0
Statut : Locked

---

OPPORTUNITY OVERVIEW

Endpoints :

POST /opportunities

PATCH /opportunities/{opportunity_id}

GET /opportunities

GET /opportunities/{opportunity_id}

POST /opportunities/{opportunity_id}/apply

GET /opportunities/{opportunity_id}/matches

GET /opportunities/recommended

POST /opportunities/{opportunity_id}/archive

---

OPPORTUNITY DTO

{
"id": "uuid",

"organization_id": "uuid",

"title": "Frontend React Developer",

"description": "...",

"opportunity_type": "JOB",

"work_mode": "REMOTE",

"country": "Cameroon",

"city": "Douala",

"status": "ACTIVE",

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

OPPORTUNITY TYPES

JOB

FREELANCE

INTERNSHIP

PARTNERSHIP

MENTORSHIP

PROJECT

FUNDING

---

WORK MODES

REMOTE

HYBRID

ONSITE

---

OPPORTUNITY STATUS

DRAFT

ACTIVE

PAUSED

FILLED

ARCHIVED

---

CREATE OPPORTUNITY

POST /opportunities

---

Request

{
"title": "...",
"description": "...",
"opportunity_type": "JOB"
}

---

Response

{
"success": true,
"data": {
"opportunity_id": "uuid"
}
}

---

Errors

VALIDATION_ERROR

FORBIDDEN

---

UPDATE OPPORTUNITY

PATCH /opportunities/{opportunity_id}

---

Response

{
"success": true
}

---

GET OPPORTUNITY

GET /opportunities/{opportunity_id}

---

Response

{
"success": true,
"data": {
"opportunity": {}
}
}

---

LIST OPPORTUNITIES

GET /opportunities

---

Filters

?opportunity_type=JOB

?country=Cameroon

?work_mode=REMOTE

?skills=React

---

Sorting

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

APPLICATION DTO

{
"id": "uuid",

"profile_id": "uuid",

"opportunity_id": "uuid",

"status": "SUBMITTED",

"created_at": "..."
}

---

APPLICATION STATUS

SUBMITTED

REVIEWING

SHORTLISTED

ACCEPTED

REJECTED

WITHDRAWN

---

APPLY TO OPPORTUNITY

POST /opportunities/{opportunity_id}/apply

---

Request

{
"message": "..."
}

---

Response

{
"success": true,
"data": {
"application_id": "uuid"
}
}

---

Errors

ALREADY_APPLIED

OPPORTUNITY_CLOSED

---

MATCH DTO

{
"match_id": "uuid",

"opportunity_id": "uuid",

"profile_id": "uuid",

"match_score": 89,

"match_level": "EXCELLENT"
}

---

MATCH LEVELS

LOW

MEDIUM

HIGH

EXCELLENT

---

MATCH EXPLANATION DTO

{
"skills_score": 94,

"location_score": 100,

"language_score": 92,

"icv_score": 78,

"summary": "Très forte adéquation avec les compétences demandées."
}

---

GET OPPORTUNITY MATCHES

GET /opportunities/{opportunity_id}/matches

---

Filters

?level=HIGH

---

Sorting

?sort=-match_score

---

Response

{
"success": true,
"data": []
}

---

RECOMMENDED OPPORTUNITIES

GET /opportunities/recommended

---

Response

{
"success": true,
"data": [
{
"opportunity": {},
"match": {},
"explanation": {}
}
]
}

---

ARCHIVE OPPORTUNITY

POST /opportunities/{opportunity_id}/archive

---

Response

{
"success": true
}

---

REALTIME EVENTS

OPPORTUNITY_CREATED

OPPORTUNITY_UPDATED

OPPORTUNITY_ARCHIVED

APPLICATION_CREATED

MATCH_GENERATED

---

REALTIME PAYLOAD

{
"event_id": "uuid",

"event_type": "APPLICATION_CREATED",

"opportunity_id": "uuid",

"application_id": "uuid",

"created_at": "..."
}

---

OFFLINE CONTRACT

Créer opportunité

Oui

---

Modifier opportunité

Oui

---

Appliquer

Oui

---

Matching

Serveur uniquement

---

ANALYTICS EVENTS

OPPORTUNITY_CREATED

OPPORTUNITY_VIEWED

APPLICATION_CREATED

APPLICATION_ACCEPTED

MATCH_VIEWED

MATCH_CLICKED

---

RATE LIMITS

Create Opportunity

100 / jour

---

Apply

100 / jour

---

Get Matches

2000 / jour

---

SECURITY RULES

Créateur :

accès complet

---

Organisation propriétaire :

accès complet

---

Candidat :

accès à ses candidatures

---

Admin :

audit

---

RLS obligatoire

---

FUTURE V2

Ajout :

salary_range

budget_range

deadline

---

FUTURE V3

Ajout :

screening questions

AI ranking

application scoring

---

FUTURE V4

Ajout :

recrutement autonome assisté par Vita.

---

GOLDEN RULE

Une opportunité représente un besoin.

Une candidature représente un intérêt.

Un match représente une probabilité de succès calculée par le moteur de recommandation.