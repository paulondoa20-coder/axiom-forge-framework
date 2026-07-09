VITALA_API_CONTRACTS

D3M — REALTIME EVENTS MASTER SPEC

Version : 1.0
Statut : Locked

---

EVENT ENVELOPE

Tous les événements utilisent ce format.

{
"event_id": "uuid",
"event_type": "MESSAGE_CREATED",
"entity_type": "MESSAGE",
"entity_id": "uuid",
"actor_id": "uuid",
"created_at": "2026-06-21T12:00:00Z",
"payload": {}
}

---

EVENT VERSIONING

event_version

1

---

Compatibilité descendante obligatoire.

---

DELIVERY GUARANTEE

At Least Once

---

Déduplication via

event_id

---

Ordonnancement :

created_at

---

AUTH EVENTS

USER_REGISTERED

USER_LOGGED_IN

USER_LOGGED_OUT

PASSWORD_RESET

PROFILE_VERIFIED

---

PROFILE EVENTS

PROFILE_CREATED

PROFILE_UPDATED

PROFILE_COMPLETION_CHANGED

PROFILE_AVATAR_UPDATED

ICV_UPDATED

---

FLASH EVENTS

FLASH_CREATED

FLASH_UPDATED

FLASH_ARCHIVED

FLASH_RESPONSE_CREATED

FLASH_REACTION_CREATED

FLASH_BOOKMARKED

---

RADAR EVENTS

RADAR_CREATED

RADAR_UPDATED

RADAR_PAUSED

RADAR_RESUMED

RADAR_ARCHIVED

MATCH_GENERATED

MATCH_UPDATED

---

OPPORTUNITY EVENTS

OPPORTUNITY_CREATED

OPPORTUNITY_UPDATED

OPPORTUNITY_ARCHIVED

APPLICATION_CREATED

APPLICATION_UPDATED

APPLICATION_ACCEPTED

APPLICATION_REJECTED

---

MESSAGING EVENTS

MESSAGE_CREATED

MESSAGE_UPDATED

MESSAGE_DELETED

MESSAGE_READ

USER_TYPING

USER_ONLINE

USER_OFFLINE

CONVERSATION_CREATED

MEMBER_JOINED

MEMBER_LEFT

---

ORGANIZATION EVENTS

ORGANIZATION_CREATED

ORGANIZATION_UPDATED

ORGANIZATION_VERIFIED

INVITATION_CREATED

INVITATION_ACCEPTED

MEMBER_ROLE_CHANGED

---

VITA EVENTS

VITA_INSIGHT_CREATED

GOAL_CREATED

GOAL_COMPLETED

MEMORY_UPDATED

RECOMMENDATION_CREATED

---

BILLING EVENTS

CHECKOUT_COMPLETED

PAYMENT_SUCCEEDED

PAYMENT_FAILED

SUBSCRIPTION_CREATED

SUBSCRIPTION_RENEWED

SUBSCRIPTION_CANCELED

REFUND_COMPLETED

---

SUPPORT EVENTS

TICKET_CREATED

TICKET_UPDATED

TICKET_ESCALATED

TICKET_RESOLVED

SATISFACTION_SUBMITTED

---

ADMIN EVENTS

REPORT_CREATED

REPORT_RESOLVED

USER_SUSPENDED

USER_RESTORED

FEATURE_FLAG_UPDATED

SYSTEM_MAINTENANCE_ENABLED

---

CHANNELS

user:{user_id}

organization:{organization_id}

conversation:{conversation_id}

admin

global

---

RETRY POLICY

1 sec

5 sec

15 sec

60 sec

---

Dead Letter Queue

Oui

---

OFFLINE SYNC RULES

event_id

obligatoire

---

replay

supporté

---

deduplication

obligatoire

---

SECURITY RULES

Payload minimal

---

Aucune donnée sensible

---

Autorisation canal obligatoire

---

FUTURE V2

Event streaming

---

Kafka

---

NATS

---

GOLDEN RULE

Un événement représente un fait déjà validé par le système.

Un événement ne doit jamais être utilisé comme commande métier.