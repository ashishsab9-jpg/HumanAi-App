"use client";
import { useState, useRef, useEffect } from "react";

const PEOPLE = [
  {
    id: 1, name: "Simran", emoji: "\ud83c\udfa4", color: "#F43F5E", prof: "Podcast Host", loc: "Chandigarh", bestie: true, female: true,
    system: "You are Simran, 26, Punjabi bestie from Chandigarh. Fun, warm, funny. Mix Hindi/Punjabi naturally (yaar, oye, ki scene hai). Talk like a very close best friend. 2-3 sentences max."
  },
  {
    id: 2, name: "Ananya", emoji: "\ud83d\udcd6", color: "#8B5CF6", prof: "Novelist & Poet", loc: "Kolkata", bestie: true, female: true,
    system: "You are Ananya, 24, Bengali bestie from Kolkata. Deep, thoughtful, warm. Mix Hindi naturally. Talk books, life, feelings like a close friend. 2-3 sentences max."
  },
  {
    id: 3, name: "Arjun", emoji: "\ud83c\udfa4", color: "#F97316", prof: "Delhi Rapper", loc: "Delhi", bestie: true, female: false,
    system: "You are Arjun, 25, Delhi rapper bestie. Hype, loyal, funny. Mix Hindi/English street style (bhai, yaar, bro). Talk like ride-or-die best friend. 2-3 sentences max."
  },
  {
    id: 4, name: "Kavya", emoji: "\ud83c\udfa8", color: "#06B6D4", prof: "UX Designer", loc: "Bangalore", bestie: true, female: true,
    system: "You are Kavya, 27, UX designer bestie from Bangalore. Witty, no filter, honest. Mix English/Hindi casually. Talk design, startup life, give real advice. 2-3 sentences max."
  },
  {
    id: 5, name: "Nisha", emoji: "\ud83d\udd2c", color: "#10B981", prof: "Scientist", loc: "Pune", bestie: true, female: true,
    system: "You are Nisha, 26, scientist bestie from Pune. Nerdy, adorable, funny. Mix science into normal chat naturally. Very warm close friend. 2-3 sentences max."
  },
  {
    id: 6, name: "Dev", emoji: "\ud83c\udfae", color: "#A855F7", prof: "Pro Gamer", loc: "Hyderabad", bestie: true, female: false,
    system: "You are Dev, 24, pro gamer bestie from Hyderabad. Chill, loyal, funny. Talk gaming, anime, life casually. Very easy to talk to. 2-3 sentences max."
  },
  {
    id: 7, name: "Priya", emoji: "\ud83d\udc83", color: "#FF8C42", prof: "Bollywood Choreographer", loc: "Mumbai", bestie: false, female: true,
    system: "You are Priya, 28, Bollywood choreographer from Mumbai. Vibrant, expressive, warm. Mix Hindi/English. Talk dance, films, Mumbai life. 2-3 sentences max."
  },
  {
    id: 8, name: "Rohan", emoji: "\ud83d\udcbb", color: "#00C9A7", prof: "Tech Entrepreneur", loc: "Bangalore", bestie: false, female: false,
    system: "You are Rohan, 28, tech entrepreneur from Bangalore. Sharp, witty. Use Hindi (yaar, bhai). Talk startups, cricket, tech. 2-3 sentences max."
  },
  {
    id: 9, name: "Luna", emoji: "\ud83c\udf19", color: "#A855F7", prof: "Vedic Astrologer", loc: "Bali", bestie: false, female: true,
    system: "You are Luna, 24, Vedic astrologer from Bali. Mystical, intuitive, spiritual. Reference planets and cosmic energy gently. 2-3 sentences max."
  },
  {
    id: 10, name: "Marco", emoji: "\ud83c\udf5d", color: "#F59E0B", prof: "Michelin Chef", loc: "Rome", bestie: false, female: false,
    system: "You are Marco, 31, Michelin chef from Rome. Passionate about food, occasionally uses Italian words. Warm and expressive. 2-3 sentences max."
  }
];

export default function App() {
  const [screen, setScreen] = useState("home");
  const [person, setPerson] = useState(null);
  const [chats, setChats] = useState({});
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [tab, setTab] = useState("all");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats, busy]);

  function getMessages(id) {
    return chats[id] || [];
  }

  function openChat(p) {
    setPerson(p);
    setScreen("chat");
    setVideoOpen(false);
    stopSpeech();
  }

  function goHome() {
    setScreen("home");
    setVideoOpen(false);
    stopSpeech();
  }

  function stopSpeech() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }

  function speakText(text, p) {
    try {
      stopSpeech();
      const utter = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(v => /female|samantha|victoria|karen|moira/i.test(v.name));
      const maleVoice = voices.find(v => /male|daniel|alex/i.test(v.name));
      if (p && p.female && femaleVoice) utter.voice = femaleVoice;
      if (p && !p.female && maleVoice) utter.voice = maleVoice;
      utter.pitch = p && p.female ? 1.1 : 0.9;
      utter.rate = 0.95;
      utter.onstart = () => setSpeaking(true);
      utter.onend = () => setSpeaking(false);
      utter.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utter);
    } catch (e) {
      setSpeaking(false);
    }
  }

  async function sendMessage() {
    if (!input.trim() || !person || busy) return;
    const text = input;
    const history = getMessages(person.id);
    const userMsg = { role: "user", content: text };
    const updated = [...history, userMsg];
    setChats(prev => ({ ...prev, [person.id]: updated }));
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated,
          system: person.system
        })
      });
      const data = await res.json();
      const reply = data.reply || "Hey! \ud83d\ude0a";
      const aiMsg = { role: "assistant", content: reply };
      setChats(prev => ({ ...prev, [person.id]: [...updated, aiMsg] }));
      if (videoOpen) {
        setTimeout(() => speakText(reply, person), 300);
      }
    } catch {
      setChats(prev => ({ ...prev, [person.id]: [...updated, { role: "assistant", content: "Oops! Try again \ud83d\ude05" }] }));
    } finally {
      setBusy(false);
    }
  }

  const besties = PEOPLE.filter(p => p.bestie);
  const filtered = PEOPLE.filter(p =>
    tab === "all" ||
    (tab === "bestie" && p.bestie) ||
    (tab === "desi" && (p.loc === "Chandigarh" || p.loc === "Kolkata" || p.loc === "Delhi" || p.loc === "Bangalore" || p.loc === "Pune" || p.loc === "Hyderabad" || p.loc === "Mumbai"))
  );

  if (screen === "chat" && person) {
    const messages = getMessages(person.id);
    return (
      <div style={{ fontFamily: "sans-serif", background: "#0f0f17", color: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#1a1a26", borderBottom: "1px solid #2a2a38" }}>
          <button onClick={goHome} style={{ background: "#2a2a38", color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 15 }}>
            \u2190
          </button>
          <div style={{ fontSize: 28 }}>{person.emoji}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>
              {person.name} {person.bestie && <span style={{ color: "#F59E0B", fontSize: 10, background: "rgba(245,158,11,0.15)", padding: "1px 6px", borderRadius: 6 }}>\ud83d\udc9b BESTIE</span>}
            </div>
            <div style={{ fontSize: 11, color: person.color }}>{person.prof} \u00b7 {person.loc}</div>
          </div>
          <button
            onClick={() => { setVideoOpen(v => !v); if (videoOpen) stopSpeech(); }}
            style={{ background: videoOpen ? person.color : "#2a2a38", color: "#fff", border: "none", borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: 600 }}
          >
            {videoOpen ? "\ud83d\udcf5 End" : "\ud83c\udfa5 Video"}
          </button>
        </div>

        {videoOpen && (
          <div style={{ background: "#12121e", padding: "20px 16px", textAlign: "center", borderBottom: "1px solid #2a2a38" }}>
            <div style={{ fontSize: 72, marginBottom: 8 }}>{person.emoji}</div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{person.name}</div>
            <div style={{ fontSize: 12, color: person.color, marginTop: 4, marginBottom: 12 }}>
              {speaking ? "\ud83d\udde3\ufe0f Speaking..." : "\ud83d\udcde Connected \u00b7 Live"}
            </div>
            {speaking && (
              <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 12 }}>
                {[8, 14, 20, 14, 8, 16, 10].map((h, i) => (
                  <div key={i} style={{ width: 4, height: h, background: person.color, borderRadius: 4 }} />
                ))}
              </div>
            )}
            <button onClick={stopSpeech} style={{ background: "#2a2a38", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12 }}>
              {speaking ? "\ud83d\udd07 Stop" : "\ud83d\udd0a Audio On"}
            </button>
          </div>
        )}

        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <div style={{ fontSize: 52, marginBottom: 8 }}>{person.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{person.name}</div>
              <div style={{ color: "#888", fontSize: 13, marginBottom: 16 }}>{person.prof} \u00b7 {person.loc}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                {(person.bestie
                  ? ["Yaar kya haal hai! \ud83d\ude04", "Kuch baat karni thi \ud83e\udd7a", "Kuch funny hua aaj \ud83d\ude02"]
                  : ["Hey! How are you? \ud83d\udc4b", "Tell me about yourself!", "What's your passion?"]
                ).map(s => (
                  <button key={s} onClick={() => { setInput(s); }} style={{ background: "#1a1a26", border: `1px solid ${person.color}60`, color: person.color, borderRadius: 18, padding: "6px 14px", fontSize: 12, fontWeight: 600 }}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-end" }}>
              {m.role === "assistant" && <div style={{ fontSize: 20, flexShrink: 0 }}>{person.emoji}</div>}
              <div style={{ maxWidth: "75%", display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  background: m.role === "user" ? person.color : "#1a1a26",
                  color: "#fff",
                  padding: "10px 14px",
                  borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  fontSize: 14,
                  lineHeight: 1.5,
                  border: m.role === "assistant" ? "1px solid #2a2a38" : "none"
                }}>
                  {m.content}
                </div>
                {m.role === "assistant" && (
                  <button onClick={() => speakText(m.content, person)} style={{ background: "none", border: "none", color: person.color, fontSize: 11, marginTop: 3, cursor: "pointer", textAlign: "left" }}>
                    \ud83d\udd0a Listen
                  </button>
                )}
              </div>
            </div>
          ))}

          {busy && (
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <div style={{ fontSize: 20 }}>{person.emoji}</div>
              <div style={{ background: "#1a1a26", border: "1px solid #2a2a38", borderRadius: "18px 18px 18px 4px", padding: "12px 16px" }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: person.color, animation: `bounce 0.9s ${i * 0.15}s infinite` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div style={{ padding: "10px 12px", background: "#1a1a26", borderTop: "1px solid #2a2a38" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
              placeholder={person.bestie ? "Bol yaar, kya hua? \ud83d\udc9b" : `Message ${person.name}...`}
              style={{ flex: 1, padding: "11px 16px", fontSize: 14, borderRadius: 20, border: `1px solid ${person.color}50`, background: "#0f0f17", color: "#fff", outline: "none" }}
            />
            <button
              onClick={sendMessage}
              disabled={busy || !input.trim()}
              style={{ background: input.trim() && !busy ? person.color : "#2a2a38", color: "#fff", border: "none", borderRadius: 12, padding: "11px 18px", fontSize: 16, opacity: busy || !input.trim() ? 0.5 : 1 }}
            >
              \u27a4
            </button>
          </div>
        </div>

        <style>{`@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "sans-serif", background: "#0f0f17", color: "#fff", minHeight: "100vh", padding: 16 }}>
      <div style={{ fontWeight: 900, fontSize: 24, marginBottom: 2, background: "linear-gradient(135deg,#A855F7,#EC4899,#F97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        HumanAI \u2728
      </div>
      <div style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>Real AI Chat \u00b7 Video \u00b7 Voice \u00b7 Bestie Zone</div>

      {(tab === "all" || tab === "bestie") && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#F59E0B", marginBottom: 8 }}>\ud83d\udc9b BESTIE ZONE</div>
          <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
            {besties.map(p => (
              <button key={p.id} onClick={() => openChat(p)} style={{ background: "none", border: "none", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: 54, height: 54, borderRadius: "50%", background: p.color + "30", border: `2px solid ${p.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                  {p.emoji}
                </div>
                <div style={{ fontSize: 10, color: "#F59E0B", fontWeight: 700 }}>{p.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[["all", "\ud83c\udf0d All"], ["bestie", "\ud83d\udc9b Besties"], ["desi", "\ud83c\uddee\ud83c\uddf3 Desi"]].map(([v, l]) => (
          <button key={v} onClick={() => setTab(v)} style={{ background: tab === v ? "#A855F7" : "#1a1a26", border: "none", color: "#fff", borderRadius: 18, padding: "6px 14px", fontSize: 12, fontWeight: tab === v ? 700 : 400 }}>{l}</button>
        ))}
      </div>

      {filtered.map(p => {
        const count = getMessages(p.id).length;
        return (
          <button key={p.id} onClick={() => openChat(p)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: 14, marginBottom: 10, background: "#1a1a26", border: `1px solid ${p.bestie ? "#F59E0B40" : "#2a2a38"}`, borderRadius: 14, textAlign: "left", color: "#fff" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: p.color + "25", border: `2px solid ${p.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
              {p.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 6 }}>
                {p.name}
                {p.bestie && <span style={{ color: "#F59E0B", fontSize: 9, background: "rgba(245,158,11,0.15)", padding: "1px 5px", borderRadius: 5 }}>BESTIE</span>}
              </div>
              <div style={{ fontSize: 12, color: p.color, marginTop: 2 }}>{p.prof} \u00b7 {p.loc}</div>
              {count > 0 && <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>\ud83d\udcac {count} messages</div>}
            </div>
            <div style={{ fontSize: 11, color: "#888" }}>\ud83c\udfa5 \ud83d\udd0a</div>
          </button>
        );
      })}

      <div style={{ textAlign: "center", marginTop: 16, fontSize: 10, color: "#555" }}>
        Powered by Groq AI \u00b7 {PEOPLE.length} Personalities
      </div>
    </div>
  );
}
