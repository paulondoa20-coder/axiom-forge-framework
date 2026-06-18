export type NotificationType = "message" | "radar_response" | "flash_new" | "scan_discovery" | "trust_verification" | "trust_activity";
export type NotificationPriority = "urgent" | "important" | "normal" | "info";
export type HubContext = "flash" | "radar" | "scan" | "trust" | "message";

export interface Notification {
  id: string;
  type: NotificationType;
  context: HubContext;
  title: string;
  description: string;
  timestamp: string;
  date: "today" | "yesterday" | "this_week";
  priority: NotificationPriority;
  read: boolean;
  avatar?: string;
  avatarInitials?: string;
  actionUrl?: string;
  actions?: Array<{
    id: string;
    label: string;
    type: "primary" | "secondary";
  }>;
}

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "radar_response",
    context: "radar",
    title: "Réponse à votre besoin",
    description: "Sami Koné a répondu à votre demande de plombier. Disponible ce soir dès 18h.",
    timestamp: "14:32",
    date: "today",
    priority: "important",
    read: false,
    avatarInitials: "SK",
    actionUrl: "/messages",
    actions: [
      { id: "view", label: "Voir", type: "primary" },
      { id: "ignore", label: "Ignorer", type: "secondary" },
    ],
  },
  {
    id: "n2",
    type: "message",
    context: "message",
    title: "Nouveau message",
    description: "Marc Dupont: 'Je peux descendre à 850 si vous venez ce soir.'",
    timestamp: "14:32",
    date: "today",
    priority: "normal",
    read: false,
    avatarInitials: "MD",
    actionUrl: "/messages",
    actions: [
      { id: "reply", label: "Répondre", type: "primary" },
      { id: "read", label: "Marquer comme lu", type: "secondary" },
    ],
  },
  {
    id: "n3",
    type: "flash_new",
    context: "flash",
    title: "Nouvelle offre Flash",
    description: "iPhone 15 Pro à 900€ — 25% de réduction. Valable 2h seulement.",
    timestamp: "13:15",
    date: "today",
    priority: "important",
    read: false,
    avatarInitials: "MD",
    actionUrl: "/flash",
    actions: [
      { id: "view", label: "Voir l'offre", type: "primary" },
      { id: "ignore", label: "Pas intéressé", type: "secondary" },
    ],
  },
  {
    id: "n4",
    type: "scan_discovery",
    context: "scan",
    title: "Nouvelle opportunité détectée",
    description: "Café Nuage — espace coworking à 0.3 km. Wifi rapide, café inclus.",
    timestamp: "11:47",
    date: "today",
    priority: "normal",
    read: false,
    avatarInitials: "CN",
    actionUrl: "/scan",
    actions: [
      { id: "explore", label: "Explorer", type: "primary" },
      { id: "ignore", label: "Ignorer", type: "secondary" },
    ],
  },
  {
    id: "n5",
    type: "trust_verification",
    context: "trust",
    title: "Vérification complétée",
    description: "Votre profil a été vérifié avec succès. Score de confiance : 92/100.",
    timestamp: "Hier 16:20",
    date: "yesterday",
    priority: "normal",
    read: false,
    actionUrl: "/trust",
    actions: [
      { id: "view", label: "Voir détails", type: "primary" },
    ],
  },
  {
    id: "n6",
    type: "message",
    context: "message",
    title: "Atelier Léa a répondu",
    description: "Pour une robe de soirée comptez 5 jours, tarif 120–180 €.",
    timestamp: "Hier 16:42",
    date: "yesterday",
    priority: "normal",
    read: true,
    avatarInitials: "AL",
    actionUrl: "/messages",
    actions: [
      { id: "reply", label: "Répondre", type: "primary" },
    ],
  },
  {
    id: "n7",
    type: "trust_activity",
    context: "trust",
    title: "Activité fiable détectée",
    description: "3 utilisateurs ont confirmé vos informations. Niveau de confiance en hausse.",
    timestamp: "Hier 14:10",
    date: "yesterday",
    priority: "info",
    read: true,
    actionUrl: "/trust",
  },
  {
    id: "n8",
    type: "radar_response",
    context: "radar",
    title: "Nouvelle réponse à votre besoin",
    description: "Un prestataire a répondu à votre demande de service de livraison.",
    timestamp: "Lun 10:15",
    date: "this_week",
    priority: "normal",
    read: true,
    avatarInitials: "LX",
    actionUrl: "/messages",
    actions: [
      { id: "view", label: "Voir", type: "primary" },
    ],
  },
  {
    id: "n9",
    type: "flash_new",
    context: "flash",
    title: "Flash sale en cours",
    description: "Macbook Air M2 à 999€ au lieu de 1299€. Temps limité !",
    timestamp: "Lun 09:30",
    date: "this_week",
    priority: "important",
    read: true,
    avatarInitials: "TB",
    actionUrl: "/flash",
  },
  {
    id: "n10",
    type: "scan_discovery",
    context: "scan",
    title: "Service découvert près de vous",
    description: "Atelier de couture à 0.5 km. Retouches, confection, réparations.",
    timestamp: "Dim 18:45",
    date: "this_week",
    priority: "info",
    read: true,
    avatarInitials: "AC",
    actionUrl: "/scan",
  },
];

export const PRIORITY_META: Record<NotificationPriority, { label: string; color: string; bgColor: string }> = {
  urgent: { label: "Urgent", color: "var(--destructive)", bgColor: "color-mix(in oklch, var(--destructive) 14%, transparent)" },
  important: { label: "Important", color: "var(--live)", bgColor: "color-mix(in oklch, var(--live) 14%, transparent)" },
  normal: { label: "Normal", color: "var(--foreground)", bgColor: "transparent" },
  info: { label: "Info", color: "var(--muted-foreground)", bgColor: "transparent" },
};

export const CONTEXT_META: Record<HubContext, { label: string; color: string }> = {
  flash: { label: "Flash", color: "var(--flash)" },
  radar: { label: "Radar", color: "var(--radar)" },
  scan: { label: "Scan", color: "var(--scan)" },
  trust: { label: "Trust", color: "var(--trust)" },
  message: { label: "Message", color: "var(--scan)" },
};
