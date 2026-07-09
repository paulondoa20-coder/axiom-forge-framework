VITALA_API_CONTRACTS

D3C — PROFILE CONTRACTS

Version : 1.0
Statut : Locked

---

PROFILE OVERVIEW

Endpoints :

GET /profiles/me

GET /profiles/{profile_id}

PATCH /profiles/me

GET /profiles/me/completion

GET /profiles/me/icv

---

PROFILE DTO

Profile

{
"id": "uuid",
"user_id": "uuid",

"first_name": "John",
"last_name": "Doe",

"headline": "Frontend Developer",

"bio": "...",

"country": "Cameroon",
"city": "Douala",

"avatar_url": "...",

"is_verified": false,

"created_at": "...",
"updated_at": "..."
}

---

SKILL DTO

{
"id": "uuid",
"name": "React",
"level": "ADVANCED"
}

---

Skill Levels

BEGINNER

INTERMEDIATE

ADVANCED

EXPERT

---

LANGUAGE DTO

{
"id": "uuid",
"name": "French",
"level": "C2"
}

---

Language Levels

A1

A2

B1

B2

C1

C2

NATIVE

---

GET MY PROFILE

GET /profiles/me

---

Response

{
"success": true,
"data": {
"profile": {},
"skills": [],
"languages": []
}
}

---

Errors

AUTH_INVALID_TOKEN

PROFILE_NOT_FOUND

---

GET PUBLIC PROFILE

GET /profiles/{profile_id}

---

Response

{
"success": true,
"data": {
"profile": {},
"skills": [],
"languages": []
}
}

---

Visibility Rules

Appliquer règles de confidentialité

---

UPDATE PROFILE

PATCH /profiles/me

---

Request

{
"headline": "...",
"bio": "...",
"country": "Cameroon",
"city": "Douala"
}

---

Response

{
"success": true,
"data": {
"profile": {}
}
}

---

Errors

VALIDATION_ERROR

PROFILE_NOT_FOUND

---

PROFILE COMPLETION

GET /profiles/me/completion

---

Response

{
"success": true,
"data": {
"completion_percentage": 78
}
}

---

COMPLETION FORMULA V1

Avatar

10%

---

Headline

10%

---

Bio

15%

---

Skills

25%

---

Languages

15%

---

Location

10%

---

Verification

15%

---

Total

100%

---

ICV ENDPOINT

GET /profiles/me/icv

---

Response

{
"success": true,
"data": {
"icv_score": 74,
"updated_at": "..."
}
}

---

ICV VISIBILITY RULES

Owner

Oui

---

Admin

Oui

---

Public

Non

---

Organizations

Non

---

PROFILE SEARCH DTO

{
"search": "react",
"country": "Cameroon",
"skills": [
"React"
]
}

---

PROFILE LIST RESPONSE

{
"success": true,
"data": [
{}
],
"meta": {
"page": 1,
"total": 120
}
}

---

PROFILE PRIVACY

Public Fields

first_name

last_name

headline

avatar

country

city

skills

---

Private Fields

email

audit

billing

admin_data

---

PROFILE STATES

ACTIVE

---

SUSPENDED

---

BANNED

---

DELETED

---

PROFILE CACHE POLICY

Public Profile

5 min

---

My Profile

No Cache

---

ANALYTICS EVENTS

PROFILE_VIEWED

PROFILE_UPDATED

PROFILE_COMPLETED

ICV_VIEWED

---

RATE LIMITS

GET profile

5000 / jour

---

UPDATE profile

200 / jour

---

GET icv

1000 / jour

---

SECURITY RULES

Owner

lecture complète

---

Public

lecture filtrée

---

Admin

lecture complète

---

RLS obligatoire

---

FUTURE V2

Ajout :

portfolio

social_links

certifications

---

FUTURE V3

Ajout :

resume_parser

verified_skills

endorsements

---

GOLDEN RULE

Le profil est la source de vérité de l'identité professionnelle dans Vitala.

Tous les autres modules consomment les données du profil mais ne deviennent jamais propriétaires de ces données.