VITALA_API_CONTRACTS

D3B — AUTH CONTRACTS

Version : 1.0
Statut : Locked

---

AUTH OVERVIEW

Endpoints :

POST /auth/signup

POST /auth/login

POST /auth/logout

POST /auth/refresh-token

POST /auth/forgot-password

POST /auth/reset-password

POST /auth/onboarding

GET /auth/me

---

AUTH TYPESCRIPT CONTRACTS

export type UserRole =
| "USER"
| "PREMIUM"
| "ORGANIZATION_MANAGER"
| "MODERATOR"
| "ADMIN"
| "SUPER_ADMIN";

---

SIGNUP

POST /auth/signup

---

Request

{
"email": "user@example.com",
"password": "StrongPassword123",
"first_name": "John",
"last_name": "Doe"
}

---

Response

{
"success": true,
"data": {
"user_id": "uuid"
}
}

---

Errors

AUTH_EMAIL_EXISTS

AUTH_INVALID_EMAIL

AUTH_WEAK_PASSWORD

---

LOGIN

POST /auth/login

---

Request

{
"email": "user@example.com",
"password": "password"
}

---

Response

{
"success": true,
"data": {
"access_token": "...",
"refresh_token": "...",
"expires_in": 3600,
"user": {
"id": "uuid",
"role": "USER"
}
}
}

---

Errors

AUTH_INVALID_CREDENTIALS

AUTH_ACCOUNT_SUSPENDED

AUTH_ACCOUNT_BANNED

---

LOGOUT

POST /auth/logout

---

Request

{}

---

Response

{
"success": true
}

---

REFRESH TOKEN

POST /auth/refresh-token

---

Request

{
"refresh_token": "..."
}

---

Response

{
"success": true,
"data": {
"access_token": "...",
"refresh_token": "...",
"expires_in": 3600
}
}

---

Errors

AUTH_REFRESH_TOKEN_INVALID

AUTH_REFRESH_TOKEN_EXPIRED

---

FORGOT PASSWORD

POST /auth/forgot-password

---

Request

{
"email": "user@example.com"
}

---

Response

{
"success": true
}

---

Errors

AUTH_EMAIL_NOT_FOUND

---

RESET PASSWORD

POST /auth/reset-password

---

Request

{
"token": "...",
"new_password": "..."
}

---

Response

{
"success": true
}

---

Errors

AUTH_RESET_TOKEN_INVALID

AUTH_RESET_TOKEN_EXPIRED

---

ONBOARDING

POST /auth/onboarding

---

Request

{
"headline": "...",
"country": "Cameroon",
"city": "Douala",
"skills": [
"React",
"TypeScript"
],
"languages": [
"French",
"English"
]
}

---

Response

{
"success": true,
"data": {
"profile_completion": 65
}
}

---

Errors

PROFILE_NOT_FOUND

VALIDATION_ERROR

---

GET CURRENT USER

GET /auth/me

---

Response

{
"success": true,
"data": {
"id": "uuid",
"email": "user@example.com",
"role": "USER",
"profile_id": "uuid"
}
}

---

Errors

AUTH_INVALID_TOKEN

AUTH_EXPIRED_TOKEN

---

TOKEN RULES

Access Token

60 minutes

---

Refresh Token

30 jours

---

Rotation obligatoire

---

PASSWORD RULES

Minimum

8 caractères

---

Recommandé

12+

---

Majuscule

Oui

---

Minuscule

Oui

---

Chiffre

Oui

---

Caractère spécial

Oui

---

SESSION RULES

Multi-device

Oui

---

Révocation globale

Oui

---

Logout all devices

V2

---

RATE LIMITS

signup

5 / heure

---

login

20 / heure

---

forgot-password

5 / heure

---

refresh-token

100 / jour

---

SECURITY RULES

JWT signé

---

HTTPS obligatoire

---

Tokens jamais stockés en clair

---

Audit des connexions critiques

---

GOLDEN RULE

L'authentification prouve l'identité.

L'autorisation détermine les permissions.

Ces deux responsabilités ne doivent jamais être mélangées.