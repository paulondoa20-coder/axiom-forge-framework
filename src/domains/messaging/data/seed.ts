import type { Conversation } from "../entities/Conversation";
import { ME_ID } from "../entities/Message";

// Seed data — deterministic, isomorphic (SSR-safe). Repositories hydrate
// Dexie from this on first client run.
export const CONVERSATION_SEED: Conversation[] = [
  {
    id: "c1",
    contact: { id: "u1", name: "Marc Dupont", handle: "@marc.d", trustScore: 92, verified: true, avatarInitials: "MD" },
    context: "flash",
    contextTitle: "iPhone 15 Pro — vente flash",
    contextSummary: "Neuf, sous garantie. -25% pendant 2h. Prix : 900 €",
    status: "unread",
    lastMessage: "Je peux descendre à 850 si vous venez ce soir.",
    lastTs: "14:32",
    unread: 2,
    messages: [
      { id: "m1", senderId: ME_ID, text: "Bonjour, l'iPhone est encore disponible ?", timestamp: "14:10", status: "read" },
      { id: "m2", senderId: "u1", text: "Oui, toujours dispo ! Vous êtes intéressé ?", timestamp: "14:12", status: "read" },
      { id: "m3", senderId: ME_ID, text: "Oui. C'est bien le modèle 256 Go ?", timestamp: "14:18", status: "read" },
      { id: "m4", senderId: "u1", text: "Exactement, titane naturel, acheté il y a 3 mois.", timestamp: "14:20", status: "read" },
      { id: "m5", senderId: ME_ID, text: "Est-ce que vous pouvez faire un geste sur le prix ?", timestamp: "14:28", status: "read" },
      { id: "m6", senderId: "u1", text: "Je peux descendre à 850 si vous venez ce soir.", timestamp: "14:32", status: "delivered" },
    ],
  },
  {
    id: "c2",
    contact: { id: "u2", name: "Sami Koné", handle: "@sami.k", trustScore: 88, verified: true, avatarInitials: "SK" },
    context: "radar",
    contextTitle: "Besoin : plombier urgent",
    contextSummary: "Fuite sous évier, Akwa Douala. Intervention rapide souhaitée.",
    status: "active",
    lastMessage: "Je suis disponible ce soir à partir de 18h.",
    lastTs: "11:47",
    unread: 0,
    messages: [
      { id: "m1", senderId: "u2", text: "Bonjour ! J'ai vu votre besoin sur Radar. Je suis plombier à Akwa.", timestamp: "11:30", status: "read" },
      { id: "m2", senderId: ME_ID, text: "Super ! Pouvez-vous intervenir rapidement ?", timestamp: "11:35", status: "read" },
      { id: "m3", senderId: "u2", text: "Oui, j'ai de l'expérience sur ce type de fuite. Quel est votre disponibilité ?", timestamp: "11:38", status: "read" },
      { id: "m4", senderId: ME_ID, text: "Ce soir si possible, ou demain matin.", timestamp: "11:42", status: "read" },
      { id: "m5", senderId: "u2", text: "Je suis disponible ce soir à partir de 18h.", timestamp: "11:47", status: "read" },
    ],
  },
  {
    id: "c3",
    contact: { id: "u3", name: "Atelier Léa", handle: "@lea.atelier", trustScore: 96, verified: true, avatarInitials: "AL" },
    context: "trust",
    contextTitle: "Vérification : service couture",
    contextSummary: "Demande de clarification sur les délais et tarifs pour une robe de soirée.",
    status: "active",
    lastMessage: "Pour une robe de soirée comptez 5 jours, tarif 120–180 €.",
    lastTs: "Hier",
    unread: 0,
    messages: [
      { id: "m1", senderId: ME_ID, text: "Bonjour, je cherche quelqu'un pour retoucher une robe de soirée.", timestamp: "Hier 16:10", status: "read" },
      { id: "m2", senderId: "u3", text: "Bonjour ! Oui je fais ce type de retouche. Quelle est la demande exactement ?", timestamp: "Hier 16:20", status: "read" },
      { id: "m3", senderId: ME_ID, text: "Ourlet + ajustement de buste. Quel est votre délai ?", timestamp: "Hier 16:35", status: "read" },
      { id: "m4", senderId: "u3", text: "Pour une robe de soirée comptez 5 jours, tarif 120–180 €.", timestamp: "Hier 16:42", status: "read" },
    ],
  },
  {
    id: "c4",
    contact: { id: "u4", name: "Café Nuage", handle: "@cafe.nuage", trustScore: 90, verified: true, avatarInitials: "CN" },
    context: "scan",
    contextTitle: "Coworking · Café Nuage",
    contextSummary: "Espace de coworking, wifi rapide, café et snacks. 0.3 km.",
    status: "new",
    lastMessage: "Nous avons des places disponibles dès demain !",
    lastTs: "Lun",
    unread: 1,
    messages: [
      { id: "m1", senderId: ME_ID, text: "Bonjour, est-ce que vous avez des postes disponibles pour la semaine prochaine ?", timestamp: "Lun 10:15", status: "read" },
      { id: "m2", senderId: "u4", text: "Nous avons des places disponibles dès demain !", timestamp: "Lun 10:30", status: "delivered" },
    ],
  },
  {
    id: "c5",
    contact: { id: "u5", name: "Livreur Express", handle: "@livraison.x", trustScore: 74, verified: false, avatarInitials: "LX" },
    context: "radar",
    contextTitle: "Mission : livraison ponctuelle",
    contextSummary: "Livraison urgente, 2h, bien rémunérée. Paris 11e.",
    status: "resolved",
    lastMessage: "Mission accomplie, merci !",
    lastTs: "Mar",
    unread: 0,
    messages: [
      { id: "m1", senderId: "u5", text: "Bonjour, je peux effectuer cette livraison.", timestamp: "Mar 09:00", status: "read" },
      { id: "m2", senderId: ME_ID, text: "Parfait, pouvez-vous partir à 10h ?", timestamp: "Mar 09:10", status: "read" },
      { id: "m3", senderId: "u5", text: "Oui, c'est confirmé pour 10h.", timestamp: "Mar 09:15", status: "read" },
      { id: "m4", senderId: ME_ID, text: "Super merci !", timestamp: "Mar 12:30", status: "read", type: "action", actionLabel: "Marquer résolu" },
      { id: "m5", senderId: "u5", text: "Mission accomplie, merci !", timestamp: "Mar 12:35", status: "read" },
    ],
  },
];

export const QUICK_REPLIES = [
  "Je suis intéressé",
  "Est-ce toujours disponible ?",
  "Pouvez-vous préciser ?",
  "Je confirme",
  "Quel est votre tarif ?",
  "Quand êtes-vous disponible ?",
];

export const SMART_ACTIONS = [
  { id: "price", label: "Proposer un prix", icon: "tag" },
  { id: "availability", label: "Demander disponibilité", icon: "clock" },
  { id: "location", label: "Partager localisation", icon: "map-pin" },
  { id: "resolve", label: "Marquer comme résolu", icon: "check-circle" },
];
