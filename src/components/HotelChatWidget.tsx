import { useEffect, useMemo, useRef, useState } from "react";

type DemoMessage = {
  id: string;
  sender: "guest" | "hotel";
  text: string;
  createdAt: number;
};

const DEMO_MESSAGES_KEY = "faby_chat_demo_messages";
const TAWK_SCRIPT_ID = "faby-tawk-script";

function readDemoMessages() {
  if (typeof window === "undefined") {
    return [] as DemoMessage[];
  }

  const raw = window.localStorage.getItem(DEMO_MESSAGES_KEY);
  if (!raw) {
    return [] as DemoMessage[];
  }

  try {
    const parsed = JSON.parse(raw) as DemoMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getInitialDemoMessages() {
  const stored = readDemoMessages();
  if (stored.length > 0) {
    return stored;
  }

  return [
    {
      id: "welcome",
      sender: "hotel" as const,
      text: "Bonjour et bienvenue chez FABY Hotel. La reception est disponible pour vos questions.",
      createdAt: Date.now(),
    },
  ];
}

function persistDemoMessages(messages: DemoMessage[]) {
  window.localStorage.setItem(DEMO_MESSAGES_KEY, JSON.stringify(messages));
}

function formatTime(timestamp: number) {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);
}

function buildHotelReply(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("prix") || normalized.includes("tarif")) {
    return "Nous pouvons vous guider vers les chambres et offres disponibles. Indiquez-nous vos dates pour une estimation rapide.";
  }

  if (normalized.includes("reservation") || normalized.includes("reserver")) {
    return "Pour reserver, choisissez vos dates dans la section Reservation rapide. Si vous voulez, nous pouvons aussi vous orienter vers le bon type de chambre.";
  }

  if (normalized.includes("suite") || normalized.includes("chambre")) {
    return "Nous proposons des chambres Standard, Deluxe et Suite. Dites-nous le niveau de confort souhaite et le nombre de voyageurs.";
  }

  if (normalized.includes("bonjour") || normalized.includes("salut")) {
    return "Bonjour. La reception FABY Hotel est ravie de vous aider.";
  }

  return "Merci pour votre message. Pour la production, vous pourrez repondre depuis le tableau de bord Tawk. Ici, le mode demo simule une reponse de la reception.";
}

export default function HotelChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<DemoMessage[]>(() => getInitialDemoMessages());
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const tawkPropertyId = import.meta.env.VITE_TAWK_PROPERTY_ID?.trim();
  const tawkWidgetId = import.meta.env.VITE_TAWK_WIDGET_ID?.trim();
  const hasTawkConfig = Boolean(tawkPropertyId && tawkWidgetId);
  const modeLabel = hasTawkConfig ? "Reception en ligne" : "Demo locale";

  useEffect(() => {
    if (hasTawkConfig) {
      const existing = document.getElementById(TAWK_SCRIPT_ID);
      if (existing) {
        return;
      }

      const w = window as typeof window & {
        Tawk_API?: Record<string, unknown>;
        Tawk_LoadStart?: Date;
      };

      w.Tawk_API = w.Tawk_API ?? {};
      w.Tawk_LoadStart = new Date();

      const script = document.createElement("script");
      script.id = TAWK_SCRIPT_ID;
      script.async = true;
      script.src = `https://embed.tawk.to/${tawkPropertyId}/${tawkWidgetId}`;
      script.charset = "UTF-8";
      script.setAttribute("crossorigin", "*");
      document.body.appendChild(script);
      return;
    }

    persistDemoMessages(messages);
  }, [hasTawkConfig, messages, tawkPropertyId, tawkWidgetId]);

  useEffect(() => {
    if (!isOpen || hasTawkConfig) {
      return;
    }

    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [hasTawkConfig, isOpen, messages]);

  const unreadBadge = useMemo(() => {
    if (hasTawkConfig || isOpen) {
      return null;
    }

    const hotelMessages = messages.filter((message) => message.sender === "hotel");
    return hotelMessages.length > 1 ? "1" : null;
  }, [hasTawkConfig, isOpen, messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || hasTawkConfig) {
      return;
    }

    const guestMessage: DemoMessage = {
      id: `guest_${Date.now()}`,
      sender: "guest",
      text: trimmed,
      createdAt: Date.now(),
    };

    setMessages((current) => [...current, guestMessage]);
    setInput("");

    window.setTimeout(() => {
      const hotelMessage: DemoMessage = {
        id: `hotel_${Date.now()}`,
        sender: "hotel",
        text: buildHotelReply(trimmed),
        createdAt: Date.now(),
      };

      setMessages((current) => [...current, hotelMessage]);
    }, 700);
  };

  return (
    <>
      {!hasTawkConfig && isOpen ? (
        <div className="fixed bottom-24 right-4 z-40 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-[1.75rem] border border-emerald-200/80 bg-white/95 shadow-[0_25px_80px_-30px_rgba(5,150,105,0.6)] backdrop-blur dark:border-emerald-400/20 dark:bg-slate-950/95">
          <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-500 px-5 py-4 text-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-100">
                  FABY Hotel
                </p>
                <h2 className="mt-1 text-lg font-semibold">Reception</h2>
                <p className="mt-1 text-sm text-emerald-50/90">
                  Chat de demonstration en attendant l’activation de Tawk.to.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
                aria-label="Fermer le chat"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z" />
                </svg>
              </button>
            </div>
          </div>

          <div ref={scrollerRef} className="max-h-80 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "guest" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    message.sender === "guest"
                      ? "rounded-br-md bg-emerald-600 text-white"
                      : "rounded-bl-md bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-slate-100"
                  }`}
                >
                  <p>{message.text}</p>
                  <p
                    className={`mt-1 text-[11px] ${
                      message.sender === "guest" ? "text-emerald-50/80" : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200/80 bg-white/80 px-4 py-4 dark:border-white/10 dark:bg-slate-950/80">
            <div className="mb-3 rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-100">
              Mode demo : pour la production, configurez `VITE_TAWK_PROPERTY_ID` et `VITE_TAWK_WIDGET_ID`.
            </div>
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSend();
                  }
                }}
                rows={2}
                placeholder="Ecrivez a la reception..."
                className="min-h-[56px] flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim()}
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none dark:disabled:bg-slate-700"
                aria-label="Envoyer le message"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                  <path d="M3.4 20.4 21 12 3.4 3.6 3 10l12 2-12 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => {
          if (hasTawkConfig && typeof window !== "undefined") {
            const w = window as typeof window & {
              Tawk_API?: {
                maximize?: () => void;
              };
            };
            w.Tawk_API?.maximize?.();
            return;
          }

          setIsOpen((current) => !current);
        }}
        className="fixed bottom-5 right-4 z-40 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_50px_-20px_rgba(5,150,105,0.9)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-20px_rgba(5,150,105,1)]"
        aria-label="Ouvrir le chat de l'hotel"
      >
        <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/14">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8A2.5 2.5 0 0 1 17.5 16H9l-4.5 4v-4.5A2.5 2.5 0 0 1 4 13.5z" />
          </svg>
          {unreadBadge ? (
            <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-bold text-slate-950">
              {unreadBadge}
            </span>
          ) : null}
        </span>
        <span className="text-left leading-tight">
          <span className="block text-[11px] uppercase tracking-[0.28em] text-emerald-100/90">
            {modeLabel}
          </span>
          <span className="block">Contacter l'hotel</span>
        </span>
      </button>
    </>
  );
}
