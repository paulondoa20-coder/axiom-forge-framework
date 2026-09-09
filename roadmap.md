
## Messagerie / auth (terminé)
- [x] Injection de panne d'envoi configurable (preview) pour tester retry
- [x] Bandeau d'avertissement /messages sans utilisateur connecté
- [x] Page /auth + utilisateur de test pour valider temps réel & pagination
- [x] Rechargement auto des conversations à la connexion
- [x] Écran "connectez-vous" au lieu d'une page blanche (erreur Unauthorized)
- [x] Tests E2E messagerie: non connecté puis connecté

## Lot 1 — Quick wins UX (terminé)
- [x] RecentActivity alimenté par les vraies notifications
- [x] flash.tsx : nettoyer le tableau MINE inutilisé et fonctions mortes
- [x] profile.tsx : édition via useProfile (déjà branché)

## Lot 2 — Domaine UDI (identité) (terminé)
- [x] Migration profiles : handle, headline, country, icv_score, index sur city
- [x] Bucket de stockage avatars + politiques (lecture publique, écriture propriétaire)
- [x] Use-cases UpsertProfile, GetPublicProfile
- [x] UI : page d'édition de profil avec tous les nouveaux champs
- [x] Trigger auto-création profil à l'inscription

## Lot 2 — Restes à faire plus tard
- [ ] Upload d'avatar avec recadrage simple
- [ ] Profil public en lecture (page dédiée)
- [ ] API GET /api/v1/profiles/:id, PATCH /api/v1/profiles/me
- [ ] RecomputeIcv (calcul du score ICV)

## Lot 3 — Domaine Flash (publication) (à faire)
- [ ] Migration flashes alignée spec + flash_responses + flash_reactions
- [ ] Use-cases ReactToFlash, RespondToFlash
- [ ] UI : réactions et réponses en fil

## Lot 4 — Domaine Mission (à faire)
## Lot 5 — Domaine Trust (en cours)
## Lot 6 — Sync offline (à faire)
## Lot 7 — Intelligence (à faire)
## Lot 8 — PWA (à faire)
## Lot 9 — Qualité (à faire)
## Lot 10 — Sécurité (à faire)
