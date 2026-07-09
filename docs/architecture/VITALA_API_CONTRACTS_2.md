VITALA_API_CONTRACTS

D3A — API FOUNDATION MASTER SPEC

Version : 1.0
Statut : Locked

---

API PRINCIPLES

Toutes les API Vitala doivent être :

Consistentes

Prévisibles

Versionnées

Typées

Auditables

Observables

---

BASE URL

Production

/api/v1

---

Future

/api/v2

/api/v3

---

API VERSIONING RULE

Toute rupture de compatibilité :

nouvelle version

---

Jamais :

modification silencieuse

---

CONTENT TYPE

Request

application/json

---

Response

application/json

---

STANDARD SUCCESS RESPONSE

{
"success": true,
"data": {},
"meta": {}
}

---

STANDARD ERROR RESPONSE

{
"success": false,
"error": {
"code": "AUTH_INVALID_TOKEN",
"message": "Token invalid",
"details": {}
}
}

---

ERROR OBJECT

code

obligatoire

---

message

obligatoire

---

details

optionnel

---

STANDARD PAGINATION

{
"success": true,
"data": [],
"meta": {
"page": 1,
"page_size": 20,
"total": 145,
"has_next": true
}
}

---

DEFAULT PAGE SIZE

20

---

MAX PAGE SIZE

100

---

SORTING FORMAT

?sort=created_at

---

Descending

?sort=-created_at

---

Multiple

?sort=-created_at,title

---

FILTER FORMAT

?status=ACTIVE

---

?type=JOB

---

?country=Cameroon

---

SEARCH FORMAT

?search=react

---

Recherche texte simple

---

DATE FORMAT

ISO 8601 UTC

---

Exemple

2026-06-21T15:00:00Z

---

UUID FORMAT

Toutes les entités :

UUID v4

---

AUTHENTICATION

Authorization

Bearer JWT

---

Format

Authorization: Bearer token

---

STANDARD HTTP STATUS CODES

200

OK

---

201

Created

---

204

No Content

---

400

Bad Request

---

401

Unauthorized

---

403

Forbidden

---

404

Not Found

---

409

Conflict

---

422

Validation Error

---

429

Rate Limited

---

500

Server Error

---

VALIDATION ERROR FORMAT

{
"success": false,
"error": {
"code": "VALIDATION_ERROR",
"message": "Validation failed",
"details": {
"email": [
"Invalid email"
]
}
}
}

---

RATE LIMIT RESPONSE

{
"success": false,
"error": {
"code": "RATE_LIMIT_EXCEEDED",
"message": "Too many requests"
}
}

---

REQUEST ID

Chaque requête possède :

request_id

---

Header :

X-Request-Id

---

Utilisation :

logs

monitoring

support

audit

---

IDEMPOTENCY

Endpoints sensibles :

Header :

Idempotency-Key

---

Exemples :

create-flash

send-message

create-opportunity

checkout

---

CACHE HEADERS

GET uniquement

---

Cache-Control

---

ETag support

---

API OBSERVABILITY

Mesures :

request_count

error_rate

latency

p95

p99

---

SECURITY HEADERS

X-Request-Id

---

X-RateLimit-Limit

---

X-RateLimit-Remaining

---

X-RateLimit-Reset

---

RESPONSE METADATA

Optionnel

---

Exemple

{
"success": true,
"data": {},
"meta": {
"request_id": "...",
"timestamp": "..."
}
}

---

SOFT DELETE RULE

DELETE :

ne supprime jamais physiquement

---

Utiliser :

deleted_at

---

ENUM RULE

Tous les enums :

documentés

versionnés

centralisés

---

FIELD NAMING

snake_case

---

Exemples

created_at

updated_at

profile_id

conversation_id

---

API CONTRACT GOLDEN RULE

Une fois publiée :

une API ne doit jamais changer de comportement de manière incompatible sans nouvelle version.

La stabilité du contrat est prioritaire sur la rapidité de développement.