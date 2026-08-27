import type { TrustFeedback, TrustProfile } from "../entities/TrustProfile";

export const TRUST_FEEDBACK_SEED: TrustFeedback[] = [
  {
    id: "fb-1",
    authorName: "Camille R.",
    authorVerified: true,
    text: "Collaboration très professionnelle. Livraison dans les délais, communication claire tout au long du projet.",
    tags: ["Fiable", "Ponctuel", "Qualité"],
    createdAt: "2026-07-10",
  },
  {
    id: "fb-2",
    authorName: "Marc D.",
    authorVerified: true,
    text: "Excellente réactivité et grande transparence sur l'avancement. Je recommande sans hésitation.",
    tags: ["Transparent", "Réactif"],
    createdAt: "2026-06-28",
  },
  {
    id: "fb-3",
    authorName: "Sophia K.",
    authorVerified: false,
    text: "Très bonne expérience, quelques ajustements de planning mais toujours communiqués en amont.",
    tags: ["Proactif", "Sérieux"],
    createdAt: "2026-05-15",
  },
];

export const DEFAULT_TRUST_PROFILE: TrustProfile = {
  id: "profile-demo",
  name: "Vitala Conseil",
  handle: "@vitala.conseil",
  role: "Consultant stratégie digitale",
  status: "Actif",
  verified: true,
  score: 94,
  breakdown: [
    { label: "Identité", value: 98 },
    { label: "Historique", value: 91 },
    { label: "Réseau", value: 89 },
    { label: "Activité", value: 96 },
  ],
  verifications: [
    { label: "Identité vérifiée", verified: true },
    { label: "Email confirmé", verified: true },
    { label: "Téléphone vérifié", verified: true },
    { label: "Diplôme vérifié", verified: false },
  ],
  badges: [
    { type: "verified", label: "Vérifié" },
    { type: "active", label: "Actif" },
    { type: "trusted", label: "Trusted" },
    { type: "professional", label: "Pro" },
  ],
  indicators: [
    { label: "Taux de réponse", value: "98 %", pct: 98 },
    { label: "Missions réalisées", value: "47", pct: 94 },
    { label: "Délai moyen", value: "< 2 h", pct: 88 },
    { label: "Satisfaction globale", value: "4.9 / 5", pct: 98 },
  ],
  proofs: [
    { label: "Pièce d'identité", verified: true },
    { label: "Kbis entreprise", verified: true },
    { label: "Diplôme Master", verified: false },
    { label: "Références clients", verified: true },
  ],
  timeline: [
    { text: "Mission complétée avec Agence Nova", when: "Il y a 3 jours" },
    { text: "Vérification d'identité renouvelée", when: "Il y a 1 semaine" },
    { text: "Nouveau retour 5 étoiles reçu", when: "Il y a 2 semaines" },
    { text: "Score Trust mis à jour : +2 pts", when: "Il y a 1 mois" },
  ],
  transparency: [
    { label: "Membre depuis", value: "Janvier 2025" },
    { label: "Dernière activité", value: "Aujourd'hui" },
    { label: "Missions actives", value: "2" },
    { label: "Secteurs couverts", value: "Tech, Finance, RH" },
  ],
  feedbacks: TRUST_FEEDBACK_SEED,
};

export const TRUST_SEED: TrustProfile[] = [DEFAULT_TRUST_PROFILE];
