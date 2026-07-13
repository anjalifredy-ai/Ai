import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/useAuth";

const MODELS = [
  { id: "flash", label: "Space Flash", desc: "Fastest, great for quick answers" },
  { id: "fast", label: "Space Fast", desc: "Fast + balanced" },
  { id: "medium", label: "Space Medium", desc: "Stronger reasoning" },
  { id: "pro", label: "Space Pro", desc: "Best quality, slower" },
];

export default function Home() {
  const { user, loading, login, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState(MODELS[0]);
  const [modelOpen, setModelOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function newChat() {
    setMessages([]);
    setInput("");
  }

  async function handleSend() {
    if (!input.trim() || sending) return;

    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, model: model.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠️ ${err.message}` },
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-space-gradient">
        <p className="text-white/80 text-sm">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-space-gradient px-6 text-center">
        <h1 className="text-white text-4xl font-bold mb-3">Space AI</h1>
        <p className="text-white/80 mb-8">Sign in to start chatting</p>
        <button
          onClick={login}
          className="bg-white text-gray-900 font-semibold rounded-full px-6 py-3 flex items-center gap-2 shadow-lg"
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.7 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.4-.4-3.5z"/>
            <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.6 15.9 19 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.5 6.1 29.5 4 24 4c-7.6 0-14.2 4.3-17.7 10.7z"/>
            <path fill="#4CAF50" d="M24 44c5.3 0 10.2-2 13.8-5.3l-6.4-5.4C29.4 34.9 26.8 36 24 36c-5.3 0-9.8-3.3-11.4-8l-6.6 5.1C9.7 39.6 16.3 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.4 5.6-6.4 7.2l6.4 5.4C39.5 37 43 31 43 24c0-1.2-.1-2.4-.4-3.5z"/>
          </svg>
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-space-gradient overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={newChat}
          className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white text-2xl transition"
          aria-label="New chat"
        >
          +
        </button>
        <h1 className="text-white font-semibold text-lg">Space AI</h1>
        <button
          onClick={logout}
          className="w-9 h-9 rounded-full overflow-hidden border border-white/30"
        >
          {user.photoURL ? (
            <img src={user.photoURL} alt="profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-white text-xs">{user.email?.[0]?.toUpperCase()}</span>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <h2 className="text-white text-3xl font-bold mb-2">Meet Space AI</h2>
            <p className="text-white/80 mb-6">Ask anything. Get real answers.</p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto py-4 space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-2xl px-4 py-2.5 max-w-[85%] text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-white text-gray-900"
                      : "bg-white/15 text-white"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-4 py-2.5 bg-white/15 text-white text-sm">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="px-4 pb-2 max-w-2xl w-full mx-auto relative">
        <button
          onClick={() => setModelOpen((v) => !v)}
          className="text-white/90 text-sm bg-white/10 rounded-full px-3 py-1.5 flex items-center gap-1"
        >
          {model.label}
          <span className="text-xs">▾</span>
        </button>
        {modelOpen && (
          <div className="absolute bottom-full mb-2 left-4 bg-white rounded-xl shadow-xl overflow-hidden w-64 z-10">
            {MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setModel(m);
                  setModelOpen(false);
                }}
                className={`w-full text-left px-4 py-3 hover:bg-gray-100 transition ${
                  m.id === model.id ? "bg-gray-100" : ""
                }`}
              >
                <div className="text-sm font-medium text-gray-900">{m.label}</div>
                <div className="text-xs text-gray-500">{m.desc}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 pb-6 max-w-2xl w-full mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl px-5 py-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Space AI anything..."
            rows={2}
            className="w-full resize-none outline-none text-gray-900 placeholder-gray-400 text-base"
          />
          <div className="flex items-center justify-between mt-2">
            <button
              onClick={newChat}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 text-xl"
              aria-label="New chat"
            >
              +
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="w-10 h-10 rounded-full bg-gray-900 disabled:bg-gray-300 flex items-center justify-center text-white transition"
              aria-label="Send"
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
          }
