"use client";
import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Mic, MicOff, PhoneOff, MessageCircle, Phone, Send } from "lucide-react";

const C = {
  bg: "#0F0817", surface: "#1B1025", surface2: "#241832", surface3: "#2A1B3D",
  border: "rgba(255,255,255,0.06)", border10: "rgba(255,255,255,0.1)",
  text: "#F4EFFA", textDim: "#E4DCEF", muted: "#9B8AAE", mutedDark: "#6E5F82",
  coral: "#FF6B6B", gold: "#FFD166", green: "#4ADE80", red: "#FF3B30",
};
const gradCoralGold = `linear-gradient(135deg, ${C.coral}, ${C.gold})`;

const SUPPORT_SYSTEM_PROMPT = `You are Aria, a warm and efficient customer support agent for the HumanAI app.
Help users with: account/login issues, how to use features (chat, discover, video call), billing questions, and general troubleshooting.
Keep replies SHORT (1-3 sentences) since some responses are spoken aloud during a live call — no long paragraphs, no markdown, no lists.
Reply in the same language style the user uses (Hindi/English mix is fine). Be genuinely helpful and polite. If you don't know something specific about their account, say so honestly and suggest they contact the team via email.`;

async function askSupportAI(history, userMessage) {
  const messages = [...history, { role: "user", content: userMessage }].map((m) => ({
    role: m.role,
    content: m.content,
  }));
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 150,
        system: SUPPORT_SYSTEM_PROMPT,
        messages,
      }),
    });
    const data = await response.json();
    const block = (data.content || []).find((b) => b.type === "text");
    return block ? block.text.trim() : "Sorry, thoda connection issue ho raha hai. Please try again.";
  } catch (e) {
    return "Sorry, message nahi gaya. Please try again ya email kar dein.";
  }
}

function SupportChat({ history, setHistory }) {
  const [text, setText] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [history, thinking]);

  const send = async () => {
    if (!text.trim() || thinking) return;
    const userMsg = text.trim();
    setText("");
    const newHistory = [...history, { role: "user", content: userMsg }];
    setHistory(newHistory);
    setThinking(true);
    const reply = await askSupportAI(history, userMsg);
    setHistory([...newHistory, { role: "assistant", content: reply }]);
    setThinking(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {history.length === 0 && (
          <p style={{ color: C.muted, fontSize: 13, textAlign: "center", marginTop: 20 }}>
            Hi! Main Aria hoon, aapki support agent. Kya poochna hai?
          </p>
        )}
        {history.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              padding: "10px 16px", borderRadius: 16, maxWidth: "78%", fontSize: 14,
              background: m.role === "user" ? gradCoralGold : C.surface3,
              color: m.role === "user" ? "white" : C.text,
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {thinking && <div style={{ color: C.muted, fontSize: 12, paddingLeft: 4 }}>Aria typing...</div>}
        <div ref={endRef} />
      </div>
      <div style={{ display: "flex", gap: 8, padding: 12, borderTop: `1px solid ${C.border}` }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Apna sawal likho..."
          style={{ flex: 1, background: C.surface3, borderRadius: "9999px", padding: "10px 16px", color: C.text, border: "none", outline: "none", fontSize: 14 }}
        />
        <button onClick={send} style={{ padding: 10, borderRadius: "9999px", background: gradCoralGold, border: "none" }}>
          <Send size={16} color="white" />
        </button>
      </div>
    </div>
  );
}

function SupportCall({ history, setHistory, onEnd }) {
  const [status, setStatus] = useState("idle");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [muted, setMuted] = useState(false);
  const [supported, setSupported] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const recognitionRef = useRef(null);
  const mutedRef = useRef(false);
  const historyRef = useRef(history);

  useEffect(() => { historyRef.current = history; }, [history]);
  useEffect(() => { mutedRef.current = muted; }, [muted]);

  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition || !window.speechSynthesis) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += transcriptPiece;
        else interim += transcriptPiece;
      }
      setLiveTranscript(interim || final);
      if (final.trim()) handleFinalTranscript(final.trim());
    };

    recognition.onerror = () => {
      setStatus("idle");
    };

    recognition.onend = () => {
      if (!mutedRef.current) {
        setStatus((s) => (s === "listening" ? "idle" : s));
      }
    };

    recognitionRef.current = recognition;
    startListening();

    return () => {
      recognition.abort();
      window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startListening() {
    if (mutedRef.current || !recognitionRef.current) return;
    try {
      setStatus("listening");
      setLiveTranscript("");
      recognitionRef.current.start();
    } catch (e) {
      /* already started, ignore */
    }
  }

  async function handleFinalTranscript(userText) {
    recognitionRef.current?.stop();
    setStatus("thinking");
    const newHistory = [...historyRef.current, { role: "user", content: userText }];
    setHistory(newHistory);
    setLiveTranscript("");

    const reply = await askSupportAI(historyRef.current, userText);
    const updated = [...newHistory, { role: "assistant", content: reply }];
    setHistory(updated);

    speak(reply);
  }

  function speak(textToSpeak) {
    setStatus("speaking");
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(textToSpeak);
    utter.lang = "en-IN";
    utter.rate = 1.02;
    utter.onend = () => {
      setStatus("idle");
      setTimeout(() => startListening(), 400);
    };
    utter.onerror = () => {
      setStatus("idle");
      setTimeout(() => startListening(), 400);
    };
    window.speechSynthesis.speak(utter);
  }

  function toggleMute() {
    setMuted((m) => {
      const next = !m;
      if (next) {
        recognitionRef.current?.abort();
        window.speechSynthesis.cancel();
        setStatus("idle");
      } else {
        setTimeout(() => startListening(), 300);
      }
      return next;
    });
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  if (!supported) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 30, textAlign: "center" }}>
        <p style={{ color: C.text, fontWeight: 600, marginBottom: 8 }}>Voice call is browser mein support nahi hai</p>
        <p style={{ color: C.muted, fontSize: 13 }}>Chrome (Android/Desktop) try karo, ya text chat use karo.</p>
      </div>
    );
  }

  const statusLabel = {
    idle: "Bolne ke liye ready 🎤",
    listening: "Sun raha hoon...",
    thinking: "Soch raha hoon...",
    speaking: "Aria bol rahi hai...",
  }[status];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 30 }}>
      <div
        style={{
          width: 110, height: 110, borderRadius: "9999px", background: gradCoralGold,
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
          animation: status === "listening" || status === "speaking" ? "pulse 1.4s ease-in-out infinite" : "none",
        }}
      >
        <span style={{ fontSize: 34, fontWeight: 700, color: "white" }}>A</span>
      </div>
      <style>{`@keyframes pulse { 0%,100% { transform: scale(1); opacity:1; } 50% { transform: scale(1.08); opacity:0.8; } }`}</style>

      <p style={{ color: C.text, fontSize: 18, fontWeight: 600 }}>Aria · Support</p>
      <p style={{ color: C.mutedDark, fontSize: 12, marginTop: 2 }}>{mm}:{ss}</p>
      <p style={{ color: C.gold, fontSize: 14, marginTop: 16, minHeight: 20 }}>{statusLabel}</p>
      {liveTranscript && (
        <p style={{ color: C.muted, fontSize: 13, marginTop: 10, fontStyle: "italic", textAlign: "center", maxWidth: 280 }}>
          "{liveTranscript}"
        </p>
      )}

      <div style={{ display: "flex", gap: 24, marginTop: 40 }}>
        <button
          onClick={toggleMute}
          style={{
            width: 56, height: 56, borderRadius: "9999px", border: "none",
            background: muted ? "white" : "rgba(255,255,255,0.12)",
            color: muted ? C.surface : "white",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {muted ? <MicOff size={22} /> : <Mic size={22} />}
        </button>
        <button
          onClick={onEnd}
          style={{ width: 64, height: 64, borderRadius: "9999px", border: "none", background: C.red, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <PhoneOff size={26} color="white" />
        </button>
      </div>
    </div>
  );
}

export default function SupportPage() {
  const [mode, setMode] = useState("chat");
  const [history, setHistory] = useState([]);

  return (
    <div style={{ height: "100vh", background: C.bg, display: "flex", flexDirection: "column", fontFamily: "sans-serif", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: `1px solid ${C.border}` }}>
        <a href="/" style={{ color: C.text, display: "flex" }}><ArrowLeft size={20} /></a>
        <div>
          <p style={{ color: C.text, fontWeight: 700, fontSize: 16, margin: 0 }}>Customer Support</p>
          <p style={{ color: C.green, fontSize: 11, margin: 0 }}>Aria is online</p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button
            onClick={() => setMode("chat")}
            style={{ padding: 8, borderRadius: 10, border: "none", background: mode === "chat" ? gradCoralGold : "rgba(255,255,255,0.06)" }}
          >
            <MessageCircle size={18} color={mode === "chat" ? "white" : C.muted} />
          </button>
          <button
            onClick={() => setMode("call")}
            style={{ padding: 8, borderRadius: 10, border: "none", background: mode === "call" ? gradCoralGold : "rgba(255,255,255,0.06)" }}
          >
            <Phone size={18} color={mode === "call" ? "white" : C.muted} />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {mode === "chat" ? (
          <SupportChat history={history} setHistory={setHistory} />
        ) : (
          <SupportCall history={history} setHistory={setHistory} onEnd={() => setMode("chat")} />
        )}
      </div>
    </div>
  );
}
