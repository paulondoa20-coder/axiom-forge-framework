VITALA_API_CONTRACTS

D3F — MESSAGING CONTRACTS

Version : 1.0
Statut : Locked

---

MESSAGING OVERVIEW

Endpoints :

POST /conversations

GET /conversations

GET /conversations/{conversation_id}

POST /messages

GET /messages

POST /messages/read

POST /messages/typing

POST /messages/upload

GET /presence

---

CONVERSATION DTO

{
"id": "uuid",

"conversation_type": "DIRECT",

"title": null,

"last_message": {},

"member_count": 2,

"unread_count": 3,

"created_at": "...",

"updated_at": "..."
}

---

CONVERSATION TYPES

DIRECT

GROUP

ORGANIZATION

---

CONVERSATION MEMBER DTO

{
"profile_id": "uuid",

"role": "MEMBER",

"joined_at": "..."
}

---

MEMBER ROLES

OWNER

ADMIN

MEMBER

---

CREATE CONVERSATION

POST /conversations

---

Request

{
"conversation_type": "DIRECT",
"members": [
"profile_uuid"
]
}

---

Response

{
"success": true,
"data": {
"conversation_id": "uuid"
}
}

---

MESSAGE DTO

{
"id": "uuid",

"client_message_id": "uuid",

"conversation_id": "uuid",

"author_id": "uuid",

"content": "Bonjour",

"status": "DELIVERED",

"attachments": [],

"created_at": "...",

"updated_at": "..."
}

---

MESSAGE STATUS

PENDING

SENT

DELIVERED

READ

FAILED

---

SEND MESSAGE

POST /messages

---

Request

{
"client_message_id": "uuid",
"conversation_id": "uuid",
"content": "Bonjour"
}

---

Response

{
"success": true,
"data": {
"message_id": "uuid"
}
}

---

Errors

CONVERSATION_NOT_FOUND

NOT_CONVERSATION_MEMBER

MESSAGE_TOO_LONG

---

GET MESSAGES

GET /messages

---

Filters

?conversation_id=uuid

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

ATTACHMENT DTO

{
"id": "uuid",

"file_name": "resume.pdf",

"mime_type": "application/pdf",

"size": 250000,

"url": "..."
}

---

UPLOAD ATTACHMENT

POST /messages/upload

---

Response

{
"success": true,
"data": {
"attachment": {}
}
}

---

READ RECEIPT

POST /messages/read

---

Request

{
"conversation_id": "uuid",
"message_id": "uuid"
}

---

Response

{
"success": true
}

---

TYPING INDICATOR

POST /messages/typing

---

Request

{
"conversation_id": "uuid",
"is_typing": true
}

---

Response

{
"success": true
}

---

PRESENCE DTO

{
"profile_id": "uuid",

"status": "ONLINE",

"last_seen_at": "..."
}

---

PRESENCE STATES

ONLINE

AWAY

OFFLINE

---

REALTIME EVENTS

MESSAGE_CREATED

MESSAGE_UPDATED

MESSAGE_DELETED

MESSAGE_READ

USER_TYPING

USER_ONLINE

USER_OFFLINE

MEMBER_JOINED

MEMBER_LEFT

---

REALTIME MESSAGE PAYLOAD

{
"event_id": "uuid",

"event_type": "MESSAGE_CREATED",

"conversation_id": "uuid",

"message_id": "uuid",

"created_at": "..."
}

---

OFFLINE CONTRACT

Send Message

Oui

---

Read Receipt

Oui

---

Typing

Non

---

Presence

Non

---

Upload

Queue locale

---

ANALYTICS EVENTS

MESSAGE_SENT

MESSAGE_READ

ATTACHMENT_UPLOADED

CONVERSATION_CREATED

---

RATE LIMITS

Messages

2000 / jour

---

Uploads

500 / jour

---

Typing Events

10000 / jour

---

SECURITY RULES

Membre conversation :

lecture

écriture

---

Non membre :

aucun accès

---

Admin :

audit uniquement

---

RLS obligatoire

---

FUTURE V2

Ajout :

message reactions

message editing

message deletion

---

FUTURE V3

Ajout :

voice notes

message translation

message search

---

FUTURE V4

Ajout :

audio calls

video calls

screen sharing

---

GOLDEN RULE

Un message est identifié par :

client_message_id
+
message_id

afin de garantir la synchronisation offline, l'idempotence et la cohérence multi-appareils.