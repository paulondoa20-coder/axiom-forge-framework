VITALA_API_CONTRACTS

D3N — ANALYTICS EVENTS MASTER SPEC

Version : 1.0
Statut : Locked

---

ANALYTICS ENVELOPE

{
"event_name": "FLASH_CREATED",
"user_id": "uuid",
"session_id": "uuid",
"platform": "WEB",
"timestamp": "2026-06-21T12:00:00Z",
"properties": {}
}

---

PLATFORMS

WEB

ANDROID

IOS

ADMIN

API

---

USER EVENTS

USER_REGISTERED

USER_LOGGED_IN

USER_LOGGED_OUT

ONBOARDING_COMPLETED

---

PROFILE EVENTS

PROFILE_VIEWED

PROFILE_UPDATED

PROFILE_COMPLETED

ICV_VIEWED

---

FLASH EVENTS

FLASH_CREATED

FLASH_VIEWED

FLASH_RESPONDED

FLASH_REACTED

FLASH_BOOKMARKED

---

RADAR EVENTS

RADAR_CREATED

RADAR_UPDATED

MATCH_VIEWED

MATCH_CLICKED

---

OPPORTUNITY EVENTS

OPPORTUNITY_VIEWED

APPLICATION_CREATED

APPLICATION_ACCEPTED

APPLICATION_REJECTED

---

MESSAGING EVENTS

MESSAGE_SENT

MESSAGE_READ

CONVERSATION_CREATED

ATTACHMENT_UPLOADED

---

ORGANIZATION EVENTS

ORGANIZATION_CREATED

MEMBER_INVITED

MEMBER_JOINED

ORGANIZATION_VERIFIED

---

VITA EVENTS

VITA_CHAT_SENT

VITA_RESPONSE_RECEIVED

GOAL_CREATED

GOAL_COMPLETED

INSIGHT_VIEWED

RECOMMENDATION_CLICKED

---

BILLING EVENTS

CHECKOUT_STARTED

CHECKOUT_COMPLETED

SUBSCRIPTION_CREATED

SUBSCRIPTION_RENEWED

PAYMENT_FAILED

REFUND_COMPLETED

---

SUPPORT EVENTS

TICKET_CREATED

TICKET_CLOSED

TICKET_REOPENED

SATISFACTION_SUBMITTED

---

ADMIN EVENTS

REPORT_CREATED

REPORT_RESOLVED

FEATURE_FLAG_UPDATED

---

CORE KPIs

DAU

MAU

WAU

---

Retention D1

Retention D7

Retention D30

---

Conversion Free → Premium

---

Applications Submitted

---

Matches Generated

---

Messages Sent

---

Flash Engagement Rate

---

SESSION RULES

Session Timeout

30 min

---

Cross-device support

Oui

---

DATA RETENTION

Raw Events

24 mois

---

Aggregated Metrics

Illimité

---

PRIVACY RULES

GDPR Ready

---

Consent Tracking

Oui

---

Anonymisation supportée

Oui

---

PII minimisée

Oui

---

EXPORTS

CSV

---

XLSX

---

Data Warehouse

---

FUTURE V2

Funnel Analysis

---

Cohort Analysis

---

FUTURE V3

Predictive Analytics

---

LTV Models

---

GOLDEN RULE

Les événements Analytics servent à mesurer.

Ils ne doivent jamais être utilisés pour prendre des décisions métier critiques en temps réel.