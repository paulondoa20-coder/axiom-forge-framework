VITALA_API_CONTRACTS

D3K — BILLING CONTRACTS

Version : 1.0
Statut : Locked

---

BILLING OVERVIEW

Endpoints :

GET /billing/plans

POST /billing/checkout

GET /billing/subscription

POST /billing/subscription/cancel

POST /billing/subscription/resume

GET /billing/invoices

GET /billing/invoices/{invoice_id}

POST /billing/webhooks

---

PLAN DTO

{
"id": "uuid",

"code": "PREMIUM_MONTHLY",

"name": "Vitala Premium",

"billing_cycle": "MONTHLY",

"price": 9.99,

"currency": "USD",

"features": [
"Unlimited Radar",
"Advanced Insights",
"Priority Support"
]
}

---

BILLING CYCLES

MONTHLY

YEARLY

---

PLAN TYPES

FREE

PREMIUM

ORGANIZATION

ENTERPRISE

---

GET PLANS

GET /billing/plans

---

Response

{
"success": true,
"data": []
}

---

CHECKOUT SESSION

POST /billing/checkout

---

Request

{
"plan_id": "uuid"
}

---

Response

{
"success": true,
"data": {
"checkout_url": "...",
"session_id": "uuid"
}
}

---

Errors

PLAN_NOT_FOUND

CHECKOUT_FAILED

---

SUBSCRIPTION DTO

{
"id": "uuid",

"plan_id": "uuid",

"status": "ACTIVE",

"started_at": "...",

"expires_at": "...",

"auto_renew": true
}

---

SUBSCRIPTION STATUS

TRIAL

ACTIVE

PAST_DUE

CANCELED

EXPIRED

---

GET SUBSCRIPTION

GET /billing/subscription

---

Response

{
"success": true,
"data": {
"subscription": {}
}
}

---

CANCEL SUBSCRIPTION

POST /billing/subscription/cancel

---

Response

{
"success": true
}

---

Policy

Fin de période de facturation

---

RESUME SUBSCRIPTION

POST /billing/subscription/resume

---

Response

{
"success": true
}

---

INVOICE DTO

{
"id": "uuid",

"invoice_number": "INV-2026-000321",

"amount": 9.99,

"currency": "USD",

"status": "PAID",

"issued_at": "...",

"pdf_url": "..."
}

---

INVOICE STATUS

DRAFT

PAID

VOID

REFUNDED

---

GET INVOICES

GET /billing/invoices

---

Response

{
"success": true,
"data": []
}

---

GET INVOICE

GET /billing/invoices/{invoice_id}

---

Response

{
"success": true,
"data": {
"invoice": {}
}
}

---

WEBHOOK ENDPOINT

POST /billing/webhooks

---

Provider Events

PAYMENT_SUCCEEDED

PAYMENT_FAILED

SUBSCRIPTION_CREATED

SUBSCRIPTION_RENEWED

SUBSCRIPTION_CANCELED

REFUND_COMPLETED

---

WEBHOOK SECURITY

Signature obligatoire

---

Idempotence obligatoire

---

Audit obligatoire

---

TRIAL RULES

Durée

14 jours

---

1 essai par utilisateur

---

PREMIUM ENTITLEMENTS

Unlimited Radars

---

Advanced Matching

---

Premium Badge

---

Priority Support

---

Advanced Vita Insights

---

REALTIME EVENTS

SUBSCRIPTION_CREATED

SUBSCRIPTION_RENEWED

SUBSCRIPTION_CANCELED

PAYMENT_FAILED

---

REALTIME PAYLOAD

{
"event_id": "uuid",

"event_type": "SUBSCRIPTION_RENEWED",

"subscription_id": "uuid",

"created_at": "..."
}

---

OFFLINE CONTRACT

Lecture factures

Oui

---

Lecture abonnement

Oui

---

Paiement

Non

---

Webhooks

Non

---

ANALYTICS EVENTS

CHECKOUT_STARTED

CHECKOUT_COMPLETED

SUBSCRIPTION_CREATED

SUBSCRIPTION_RENEWED

SUBSCRIPTION_CANCELED

PAYMENT_FAILED

REFUND_COMPLETED

---

RATE LIMITS

Checkout

50 / jour

---

Invoices

1000 / jour

---

Subscription Actions

100 / jour

---

SECURITY RULES

Accès utilisateur :

ses propres factures

ses propres abonnements

---

Admin :

audit complet

---

Jamais d'accès aux données bancaires

---

RLS obligatoire

---

FUTURE V2

Ajout :

coupons

codes promotionnels

gift subscriptions

---

FUTURE V3

Ajout :

facturation multi-devise

facturation organisationnelle

---

FUTURE V4

Ajout :

facturation IA à l'usage

credits Vita

marketplace

---

GOLDEN RULE

Les permissions Premium ne sont jamais activées à partir d'une action frontend.

Seul un événement de paiement validé côté serveur peut accorder des privilèges Premium.