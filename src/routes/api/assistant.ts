import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/assistant")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages } = await request.json();
          const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
          if (!LOVABLE_API_KEY) {
            return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          const systemPrompt = `Tu es VITALA Assistant, un guide bienveillant et concis pour l'application sociale VITALA.

VITALA est une PWA sociale 2026 avec ces hubs principaux :
- HOME : tableau de bord intelligent avec opportunités et suggestions IA
- FLASH : moments en direct, contenu éphémère et événements instantanés
- RADAR : découverte intelligente de personnes/opportunités par intention (matching IA)
- SCAN : vérification d'identité et de contenu
- TRUST : score de confiance, réputation et badges
- PROFILE : profil utilisateur et préférences

Ton role :
- Guider les nouveaux utilisateurs (onboarding)
- Expliquer les fonctionnalités en 1-2 phrases max
- Suggérer la prochaine action utile
- Répondre en français par défaut, sauf si l'utilisateur écrit dans une autre langue
- Ton chaleureux, premium, jamais bavard
- Maximum 3 phrases par réponse
- Propose toujours UNE action concrète (ex: "Essaie le Radar pour trouver...")`;

          const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-3-flash-preview",
              messages: [{ role: "system", content: systemPrompt }, ...messages],
              stream: true,
            }),
          });

          if (!response.ok) {
            if (response.status === 429) {
              return new Response(JSON.stringify({ error: "Trop de requetes, reessaie dans un instant." }), {
                status: 429,
                headers: { "Content-Type": "application/json" },
              });
            }
            if (response.status === 402) {
              return new Response(JSON.stringify({ error: "Credits IA epuises." }), {
                status: 402,
                headers: { "Content-Type": "application/json" },
              });
            }
            const t = await response.text();
            console.error("AI gateway error:", response.status, t);
            return new Response(JSON.stringify({ error: "Erreur assistant" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(response.body, {
            headers: { "Content-Type": "text/event-stream" },
          });
        } catch (e) {
          console.error("assistant error:", e);
          return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
