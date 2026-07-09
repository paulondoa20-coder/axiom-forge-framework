VITALA_API_CONTRACTS

D3H — VITA CONTRACTS

Version : 1.0
Statut : Locked

---

VITA OVERVIEW

Endpoints :

POST /vita/chat

GET /vita/history

GET /vita/memory

POST /vita/goals

PATCH /vita/goals/{goal_id}

GET /vita/goals

GET /vita/insights

GET /vita/recommendations

---

VITA CHAT

POST /vita/chat

---

Request

{
"message": "Je cherche un emploi React à distance."
}

---

Response

{
"success": true,
"data": {
"message_id": "uuid",
"response": "..."
}
}

---

Errors

RATE_LIMIT_EXCEEDED

CONTEXT_TOO_LARGE

---

VITA MESSAGE DTO

{
"id": "uuid",

"role": "USER",

"content": "...",

"created_at": "..."
}

---

MESSAGE ROLES

USER

ASSISTANT

SYSTEM

---

CHAT HISTORY

GET /vita/history

---

Cursor Pagination

?cursor=...

&limit=50

---

Response

{
"success": true,
"data": []
}

---

MEMORY DTO

{
"memory_id": "uuid",

"memory_type": "CAREER_GOAL",

"content": "Trouver un emploi React",

"created_at": "...",

"updated_at": "..."
}

---

MEMORY TYPES

CAREER_GOAL

PREFERENCE

INTEREST

PROJECT

SKILL_TARGET

---

GET MEMORY

GET /vita/memory

---

Response

{
"success": true,
"data": []
}

---

GOAL DTO

{
"id": "uuid",

"title": "Obtenir un emploi React",

"status": "ACTIVE",

"progress": 35,

"created_at": "..."
}

---

GOAL STATUS

ACTIVE

COMPLETED

PAUSED

ARCHIVED

---

CREATE GOAL

POST /vita/goals

---

Request

{
"title": "Obtenir un emploi React"
}

---

Response

{
"success": true,
"data": {
"goal_id": "uuid"
}
}

---

UPDATE GOAL

PATCH /vita/goals/{goal_id}

---

Request

{
"status": "COMPLETED"
}

---

Response

{
"success": true
}

---

GET GOALS

GET /vita/goals

---

Response

{
"success": true,
"data": []
}

---

INSIGHT DTO

{
"id": "uuid",

"title": "Votre profil peut être amélioré",

"description": "...",

"priority": "HIGH"
}

---

PRIORITY LEVELS

LOW

MEDIUM

HIGH

CRITICAL

---

GET INSIGHTS

GET /vita/insights

---

Response

{
"success": true,
"data": []
}

---

RECOMMENDATION DTO

{
"id": "uuid",

"recommendation_type": "OPPORTUNITY",

"entity_id": "uuid",

"score": 92,

"reason": "Correspondance élevée avec votre profil"
}

---

RECOMMENDATION TYPES

OPPORTUNITY

PROFILE

RADAR

FLASH

SKILL

ORGANIZATION

---

GET RECOMMENDATIONS

GET /vita/recommendations

---

Filters

?type=OPPORTUNITY

---

Response

{
"success": true,
"data": []
}

---

CONTEXT SOURCES

Profile

---

Skills

---

Languages

---

Radars

---

Messages Vita

---

Goals

---

Opportunities

---

Flash Activity

---

REALTIME EVENTS

VITA_INSIGHT_CREATED

GOAL_COMPLETED

RECOMMENDATION_CREATED

---

REALTIME PAYLOAD

{
"event_id": "uuid",

"event_type": "RECOMMENDATION_CREATED",

"created_at": "..."
}

---

OFFLINE CONTRACT

Historique Vita

Oui

---

Objectifs

Oui

---

Chat

File d'attente locale

---

Génération IA

Serveur uniquement

---

ANALYTICS EVENTS

VITA_CHAT_SENT

VITA_RESPONSE_RECEIVED

GOAL_CREATED

GOAL_COMPLETED

INSIGHT_VIEWED

RECOMMENDATION_CLICKED

---

RATE LIMITS

Chat

200 / jour

---

Goals

100 / jour

---

Recommendations

500 / jour

---

SECURITY RULES

Utilisateur :

accès exclusif à ses données Vita

---

Admin :

aucun accès au contenu des conversations

---

Audit :

métadonnées uniquement

---

RLS obligatoire

---

FUTURE V2

Ajout :

résumé carrière

plan d'action IA

coach entretien

---

FUTURE V3

Ajout :

agents spécialisés

mentor IA

simulateur carrière

---

FUTURE V4

Vita devient un copilote professionnel complet.

---

GOLDEN RULE

Vita n'est jamais la source de vérité.

Vita interprète les données de Vitala mais ne modifie jamais directement les données métier sans validation explicite de l'utilisateur.