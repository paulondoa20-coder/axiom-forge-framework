import { useState, useRef, useEffect } from "react";
import { MessageCircle, Bell, X, Send, Sparkles, Zap, Radar, ScanSearch, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONVERSATIONS, type HubContext as MsgContext } from "@/lib/messaging";
import { NOTIFICATIONS, CONTEXT_META, PRIORITY_META, type HubContext } from "@/lib/notifications";

type TabType = "assistant" | "messages" | "notifications";
type ChatMsg = { role: "user" | "assistant"; content: string };

const SUGGESTED_PROMPTS = [
  "Comment fonctionne le Radar ?",
  "C'est quoi le score Trust ?",
  "Que faire en premier ?",
  "Explique-moi Flash",
];

const WELCOME: ChatMsg = {
  role: "assistant",
  content: "Bonjour 👋 Je suis ton guide VITALA. Pose-moi une question sur l'app ou choisis une suggestion ci-dessous.",
};

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("assistant");
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [messages, setMessages] = useState<ChatMsg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const assistantRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const totalMessages = CONVERSATIONS.reduce((n, c) => n + c.unread, 0);
  const totalNotifications = NOTIFICATIONS.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (assistantRef.current && !assistantRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    const openHandler = () => {
      setIsOpen(true);
      setActiveTab("assistant");
    };
    window.addEventListener("open-assistant", openHandler);
    return () => window.removeEventListener("open-assistant", openHandler);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isStreaming]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    const next: ChatMsg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setIsStreaming(true);

    let acc = "";
    const upsert = (chunk: string) => {
      acc += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > next.length) {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: acc } : m));
        }
        return [...prev, { role: "assistant", content: acc }];
      });
    };

    try {
      const resp = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.filter((m) => m !== WELCOME).map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({ error: "Erreur" }));
        upsert(err.error || "Une erreur est survenue.");
        setIsStreaming(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let done = false;

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            done = true;
            break;
          }
          try {
            const parsed = JSON.parse(jsonStr);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) upsert(c);
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e) {
      upsert("Impossible de joindre l'assistant.");
    } finally {
      setIsStreaming(false);
    }
  };

  const filteredNotifications = NOTIFICATIONS.filter((n) => !dismissed.has(n.id));

  return (
    <div ref={assistantRef} className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div
          className="glass-surface rounded-3xl shadow-[var(--shadow-float)] overflow-hidden w-[min(420px,calc(100vw-2rem))] max-h-[min(600px,calc(100vh-8rem))] flex flex-col animate-[scale-in_0.3s_var(--ease-spring)_both] origin-bottom-right"
          style={{ boxShadow: "0 20px 60px -12px rgba(0, 0, 0, 0.3)" }}
        >
          <div className="shrink-0 flex items-center justify-between border-b border-white/8 px-5 py-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-medium">
                {activeTab === "assistant" ? "Guide IA" : "Hub"}
              </p>
              <h2 className="text-lg font-semibold">
                {activeTab === "assistant" ? "Assistant VITALA" : "Messages & Alertes"}
              </h2>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="shrink-0 flex gap-1 border-b border-white/8 px-1 py-1 bg-white/2">
            {[
              { id: "assistant" as const, label: "Guide", icon: Sparkles, color: "var(--scan)", badge: 0 },
              { id: "messages" as const, label: "Messages", icon: MessageCircle, color: "var(--radar)", badge: totalMessages },
              { id: "notifications" as const, label: "Alertes", icon: Bell, color: "var(--flash)", badge: totalNotifications },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-medium rounded-lg transition-all duration-200",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground/70",
                  )}
                  style={active ? { background: `color-mix(in oklch, ${tab.color} 16%, transparent)` } : undefined}
                >
                  <Icon className="h-3.5 w-3.5" style={active ? { color: tab.color } : undefined} />
                  <span>{tab.label}</span>
                  {tab.badge > 0 && (
                    <span
                      className="flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white"
                      style={{ background: "var(--live)" }}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {activeTab === "assistant" ? (
            <AssistantChat
              messages={messages}
              input={input}
              isStreaming={isStreaming}
              onInputChange={setInput}
              onSend={send}
              scrollRef={scrollRef}
            />
          ) : activeTab === "messages" ? (
            <div className="flex-1 overflow-y-auto">
              <MessagesList />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <NotificationsList
                notifications={filteredNotifications}
                onDismiss={(id) => setDismissed((prev) => new Set(prev).add(id))}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Assistant Chat ───────────────────────────────────────────────────────────

function AssistantChat({
  messages,
  input,
  isStreaming,
  onInputChange,
  onSend,
  scrollRef,
}: {
  messages: ChatMsg[];
  input: string;
  isStreaming: boolean;
  onInputChange: (v: string) => void;
  onSend: (text: string) => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  const showSuggestions = messages.length <= 1;
  return (
    <>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                m.role === "user"
                  ? "text-foreground"
                  : "text-foreground/90",
              )}
              style={
                m.role === "user"
                  ? {
                      background: "color-mix(in oklch, var(--primary) 22%, transparent)",
                      boxShadow: "inset 0 0 0 1px color-mix(in oklch, var(--primary) 35%, transparent)",
                    }
                  : {
                      background: "color-mix(in oklch, var(--scan) 10%, transparent)",
                      boxShadow: "inset 0 0 0 1px color-mix(in oklch, var(--scan) 20%, transparent)",
                    }
              }
            >
              {m.content || (isStreaming && i === messages.length - 1 ? "…" : "")}
            </div>
          </div>
        ))}
        {isStreaming && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <div
              className="rounded-2xl px-3.5 py-2.5 text-sm"
              style={{
                background: "color-mix(in oklch, var(--scan) 10%, transparent)",
                boxShadow: "inset 0 0 0 1px color-mix(in oklch, var(--scan) 20%, transparent)",
              }}
            >
              <span className="inline-flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "var(--scan)" }} />
                <span className="h-1.5 w-1.5 rounded-full animate-pulse [animation-delay:150ms]" style={{ background: "var(--scan)" }} />
                <span className="h-1.5 w-1.5 rounded-full animate-pulse [animation-delay:300ms]" style={{ background: "var(--scan)" }} />
              </span>
            </div>
          </div>
        )}
      </div>

      {showSuggestions && (
        <div className="shrink-0 px-4 pb-2 flex flex-wrap gap-1.5">
          {SUGGESTED_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => onSend(p)}
              disabled={isStreaming}
              className="text-[11px] px-2.5 py-1.5 rounded-full text-muted-foreground hover:text-foreground transition-all disabled:opacity-50"
              style={{
                background: "color-mix(in oklch, var(--scan) 8%, transparent)",
                boxShadow: "inset 0 0 0 1px color-mix(in oklch, var(--scan) 18%, transparent)",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSend(input);
        }}
        className="shrink-0 flex items-center gap-2 border-t border-white/8 px-3 py-2.5"
      >
        <input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Pose ta question..."
          disabled={isStreaming}
          className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground/60 focus:outline-none px-2 py-1.5 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!input.trim() || isStreaming}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-all disabled:opacity-40 active:scale-95"
          style={{
            background: "color-mix(in oklch, var(--scan) 22%, transparent)",
            boxShadow: "inset 0 0 0 1px color-mix(in oklch, var(--scan) 40%, transparent), 0 0 12px -4px var(--scan)",
            color: "var(--scan)",
          }}
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </>
  );
}

// ─── Messages List ────────────────────────────────────────────────────────────

function MessagesList() {
  return (
    <div className="divide-y divide-white/5">
      {CONVERSATIONS.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center px-4">
          <MessageCircle className="h-8 w-8 text-muted-foreground/40 mb-2" />
          <p className="text-sm text-muted-foreground">Aucun message pour le moment</p>
        </div>
      ) : (
        CONVERSATIONS.map((conv) => {
          const isUnread = conv.unread > 0;
          const hubColor = getHubColor(conv.context);
          return (
            <div
              key={conv.id}
              className={cn("px-4 py-3 hover:bg-white/5 transition cursor-pointer", isUnread && "bg-white/3")}
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                  style={{
                    background: `color-mix(in oklch, ${hubColor} 20%, var(--surface-2))`,
                    color: hubColor,
                  }}
                >
                  {conv.contact.avatarInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold truncate">{conv.contact.name}</span>
                    <span
                      className="text-[9px] rounded px-1.5 py-0.5"
                      style={{
                        background: `color-mix(in oklch, ${hubColor} 16%, transparent)`,
                        color: hubColor,
                      }}
                    >
                      {conv.context.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
                </div>
                {isUnread && (
                  <span
                    className="flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white shrink-0"
                    style={{ background: hubColor }}
                  >
                    {conv.unread}
                  </span>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// ─── Notifications List ───────────────────────────────────────────────────────

function NotificationsList({
  notifications,
  onDismiss,
}: {
  notifications: typeof NOTIFICATIONS;
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="divide-y divide-white/5">
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center px-4">
          <Bell className="h-8 w-8 text-muted-foreground/40 mb-2" />
          <p className="text-sm text-muted-foreground">Aucune alerte pour le moment</p>
        </div>
      ) : (
        notifications.slice(0, 8).map((notif) => {
          const meta = CONTEXT_META[notif.context];
          const priorityMeta = PRIORITY_META[notif.priority];
          const isUnread = !notif.read;
          return (
            <div
              key={notif.id}
              className={cn("px-4 py-3 hover:bg-white/5 transition group", isUnread && "bg-white/3")}
            >
              <div className="flex items-start gap-2.5">
                {notif.avatarInitials ? (
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold mt-0.5"
                    style={{
                      background: `color-mix(in oklch, ${meta.color} 18%, var(--surface-2))`,
                      color: meta.color,
                    }}
                  >
                    {notif.avatarInitials}
                  </div>
                ) : (
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-0.5"
                    style={{
                      background: `color-mix(in oklch, ${meta.color} 14%, transparent)`,
                      color: meta.color,
                    }}
                  >
                    <ContextIcon context={notif.context} size={14} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-1.5">
                    <div className="flex-1">
                      <p className={cn("text-xs font-semibold leading-snug", isUnread ? "text-foreground" : "text-foreground/80")}>
                        {notif.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground/70 leading-tight mt-0.5">{notif.description}</p>
                    </div>
                    <button
                      onClick={() => onDismiss(notif.id)}
                      className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition shrink-0 -mt-0.5"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {notif.priority !== "normal" && notif.priority !== "info" && (
                    <div className="mt-1.5 flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: priorityMeta.color }} />
                      <span className="text-[10px] font-medium" style={{ color: priorityMeta.color }}>
                        {priorityMeta.label}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

function ContextIcon({ context, size = 14 }: { context: HubContext; size?: number }) {
  const props = { style: { width: size, height: size } };
  if (context === "flash") return <Zap {...props} />;
  if (context === "radar") return <Radar {...props} />;
  if (context === "scan") return <ScanSearch {...props} />;
  if (context === "trust") return <ShieldCheck {...props} />;
  return <MessageCircle {...props} />;
}

function getHubColor(context: MsgContext): string {
  const colors: Record<MsgContext, string> = {
    flash: "var(--flash)",
    radar: "var(--radar)",
    scan: "var(--scan)",
    trust: "var(--trust)",
  };
  return colors[context] || "var(--primary)";
}
