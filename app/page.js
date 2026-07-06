"use client";
import { useState, useRef, useEffect } from "react";

const PEOPLE = [
  { id: 1, name: "Simran", emoji: "🎤", color: "#F43F5E", skin: "#E8B08A", hair: "#2b1a12", prof: "Podcast Host", loc: "Chandigarh", bestie: true, female: true,
    system: "You are Simran, 26, Punjabi bestie from Chandigarh. Fun, warm, funny. Mix Hindi/Punjabi naturally (yaar, oye, ki scene hai). Talk like a very close best friend. 2-3 sentences max." },
  { id: 2, name: "Ananya", emoji: "📖", color: "#8B5CF6", skin: "#D9A273", hair: "#111111", prof: "Novelist & Poet", loc: "Kolkata", bestie: true, female: true,
    system: "You are Ananya, 24, Bengali bestie from Kolkata. Deep, thoughtful, warm. Mix Hindi naturally. Talk books, life, feelings like a close friend. 2-3 sentences max." },
  { id: 3, name: "Arjun", emoji: "🎤", color: "#F97316", skin: "#C68855", hair: "#0d0d0d", prof: "Delhi Rapper", loc: "Delhi", bestie: true, female: false,
    system: "You are Arjun, 25, Delhi rapper bestie. Hype, loyal, funny. Mix Hindi/English street style (bhai, yaar, bro). Talk like ride-or-die best friend. 2-3 sentences max." },
  { id: 4, name: "Kavya", emoji: "🎨", color: "#06B6D4", skin: "#B5713D", hair: "#1a1005", prof: "UX Designer", loc: "Bangalore", bestie: true, female: true,
    system: "You are Kavya, 27, UX designer bestie from Bangalore. Witty, no filter, honest. Mix English/Hindi casually. Talk design, startup life, give real advice. 2-3 sentences max." },
  { id: 5, name: "Nisha", emoji: "🔬", color: "#10B981", skin: "#F0CBA0", hair: "#3a2a1a", prof: "Scientist", loc: "Pune", bestie: true, female: true,
    system: "You are Nisha, 26, scientist bestie from Pune. Nerdy, adorable, funny. Mix science into normal chat naturally. Very warm close friend. 2-3 sentences max." },
  { id: 6, name: "Dev", emoji: "🎮", color: "#A855F7", skin: "#C68855", hair: "#0d0d0d", prof: "Pro Gamer", loc: "Hyderabad", bestie: true, female: false,
    system: "You are Dev, 24, pro gamer bestie from Hyderabad. Chill, loyal, funny. Talk gaming, anime, life casually. Very easy to talk to. 2-3 sentences max." },
  { id: 7, name: "Priya", emoji: "💃", color: "#FF8C42", skin: "#B5713D", hair: "#0d0d0d", prof: "Bollywood Choreographer", loc: "Mumbai", bestie: false, female: true,
    system: "You are Priya, 28, Bollywood choreographer from Mumbai. Vibrant, expressive, warm. Mix Hindi/English. Talk dance, films, Mumbai life. 2-3 sentences max." },
  { id: 8, name: "Rohan", emoji: "💻", color: "#00C9A7", skin: "#C68855", hair: "#1a1a1a", prof: "Tech Entrepreneur", loc: "Bangalore", bestie: false, female: false,
    system: "You are Rohan, 28, tech entrepreneur from Bangalore. Sharp, witty. Use Hindi (yaar, bhai). Talk startups, cricket, tech. 2-3 sentences max." },
  { id: 9, name: "Luna", emoji: "🌙", color: "#A855F7", skin: "#D9A273", hair: "#2b1a12", prof: "Vedic Astrologer", loc: "Bali", bestie: false, female: true,
    system: "You are Luna, 24, Vedic astrologer from Bali. Mystical, intuitive, spiritual. Reference planets and cosmic energy gently. 2-3 sentences max." },
  { id: 10, name: "Marco", emoji: "🍝", color: "#F59E0B", skin: "#E8B08A", hair: "#4a2f1a", prof: "Michelin Chef", loc: "Rome", bestie: false, female: false,
    system: "You are Marco, 31, Michelin chef from Rome. Passionate about food, occasionally uses Italian words. Warm and expressive. 2-3 sentences max." }
];

function FaceAvatar({ person, speaking, size }) {
  const [mouthOpen, setMouthOpen] = useState(false);
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    let interval;
    if (speaking) {
      interval = setInterval(() => setMouthOpen(v => !v), 160);
    } else {
      setMouthOpen(false);
    }
    return () => clearInterval(interval);
  }, [speaking]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
    }, 2800 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  const s = size || 160;
  const cx = s / 2;
  const cy = s / 2;
  const r = s * 0.36;

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <circle cx={cx} cy={cy} r={s * 0.47} fill={person.color} opacity="0.15" />
      <ellipse cx={cx} cy={cy - r * 0.75} rx={r * 1.05} ry={r * 0.5} fill={person.hair} />
      <ellipse cx={cx} cy={cy + s * 0.02} rx={r} ry={r * 1.15} fill={person.skin} />
      <ellipse cx={cx - r * 0.35} cy={cy - r * 0.1} rx={r * 0.16} ry={blink ? 1.5 : r * 0.13} fill="#1a1a1a" />
      <ellipse cx={cx + r * 0.35} cy={cy - r * 0.1} rx={r * 0.16} ry={blink ? 1.5 : r * 0.13} fill="#1a1a1a" />
      <path d={`M${cx - r * 0.45},${cy - r * 0.32} Q${cx - r * 0.35},${cy - r * 0.42} ${cx - r * 0.2},${cy - r * 0.32}`} stroke={person.hair} strokeWidth={s * 0.015} fill="none" strokeLinecap="round" />
      <path d={`M${cx + r * 0.2},${cy - r * 0.32} Q${cx + r * 0.35},${cy - r * 0.42} ${cx + r * 0.45},${cy - r * 0.32}`} stroke={person.hair} strokeWidth={s * 0.015} fill="none" strokeLinecap="round" />
      <path
        d={mouthOpen
          ? `M${cx - r * 0.22},${cy + r * 0.42} Q${cx},${cy + r * 0.62} ${cx + r * 0.22},${cy + r * 0.42}`
          : `M${cx - r * 0.2},${cy + r * 0.42} Q${cx},${cy + r * 0.5} ${cx + r * 0.2},${cy + r * 0.42}`}
        stroke="#7a3b2e"
        strokeWidth={s * 0.02}
        fill={mouthOpen ? "#5a2a20" : "none"}
        strokeLinecap="round"
      />
      {speaking && (
        <circle cx={cx} cy={cy} r={s * 0.49} fill="none" stroke={person.color} strokeWidth={s * 0.012} opacity="0.6">
          <animate attributeName="r" values={`${s * 0.47};${s * 0.5};${s * 0.47}`} dur="0.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0.1;0.6" dur="0.8s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  );
}

function CameraPreview({ active }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [camError, setCamError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (!mounted) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCamError("");
      } catch (err) {
        setCamError("Camera unavailable");
      }
    }
    if (active) {
      start();
    }
    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, [active]);

  if (!active) return null;

  return (
    <div style={{ position: "absolute", bottom: 10, right: 10, width: 84, height: 112, borderRadius: 12, overflow: "hidden", border: "2px solid rgba(255,255,255,0.3)", background: "#000" }}>
      {camError ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 9, color: "#aaa", textAlign: "center", padding: 4 }}>
          {camError}
        </div>
      ) : (
        <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} />
      )}
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [person, setPerson] = useState(null);
  const [chats, setChats] = useState({});
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [tab, setTab] = useState("all");
  const [voiceSupported, setVoiceSupported] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.speechSynthesis) {
      setVoiceSupported(false);
    }
  }, []);

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
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setVoiceSupported(false);
      return;
    }
    try {
      window.speechSynthesis.cancel();
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

  function lastAssistantMessage() {
    if (!person) return null;
    const msgs = getMessages(person.id);
    const list = msgs.filter(m => m.role === "assistant");
    return list.length ? list[list.length - 1] : null;
  }

  function toggleAudioButton() {
    if (speaking) {
      stopSpeech();
    } else {
      const last = lastAssistantMessage();
      if (last) speakText(last.content, person);
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
      const reply = data.reply || "Hey!";
      const aiMsg = { role: "assistant", content: reply };
      setChats(prev => ({ ...prev, [person.id]: [...updated, aiMsg] }));
      if (videoOpen) {
        setTimeout(() => speakText(reply, person), 300);
      }
    } catch {
      setChats(prev => ({ ...prev, [person.id]: [...updated, { role: "assistant", content: "Oops! Try again" }] }));
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
            Back
          </button>
          <div style={{ fontSize: 28 }}>{person.emoji}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>
              {person.name} {person.bestie && <span style={{ color: "#F59E0B", fontSize: 10, background: "rgba(245,158,11,0.15)", padding: "1px 6px", borderRadius: 6 }}>BESTIE</span>}
            </div>
            <div style={{ fontSize: 11, color: person.color }}>{person.prof} - {person.loc}</div>
          </div>
          <button
            onClick={() => { setVideoOpen(v => !v); if (videoOpen) stopSpeech(); }}
            style={{ background: videoOpen ? person.color : "#2a2a38", color: "#fff", border: "none", borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: 600 }}
          >
            {videoOpen ? "End Call" : "Video"}
          </button>
        </div>

        {videoOpen && (
          <div style={{ background: "#12121e", padding: "20px 16px", textAlign: "center", borderBottom: "1px solid #2a2a38", position: "relative" }}>
            <FaceAvatar person={person} speaking={speaking} size={160} />
            <div style={{ fontWeight: 700, fontSize: 18, marginTop: 6 }}>{person.name}</div>
            <div style={{ fontSize: 12, color: person.color, marginTop: 4, marginBottom: 12 }}>
              {speaking ? "Speaking..." : "Connected - Live"}
            </div>
            {!voiceSupported && (
              <div style={{ fontSize: 11, color: "#EF4444", marginBottom: 8 }}>Voice not supported in this browser</div>
            )}
            <button onClick={toggleAudioButton} style={{ background: "#2a2a38", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12 }}>
              {speaking ? "Stop" : "Play Last Reply"}
            </button>
            <CameraPreview active={videoOpen} />
          </div>
        )}

        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <div style={{ fontSize: 52, marginBottom: 8 }}>{person.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{person.name}</div>
              <div style={{ color: "#888", fontSize: 13, marginBottom: 16 }}>{person.prof} - {person.loc}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                {(person.bestie
                  ? ["Yaar kya haal hai!", "Kuch baat karni thi", "Kuch funny hua aaj"]
                  : ["Hey! How are you?", "Tell me about yourself!", "What's your passion?"]
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
                    Listen
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
              placeholder={person.bestie ? "Bol yaar, kya hua?" : `Message ${person.name}...`}
              style={{ flex: 1, padding: "11px 16px", fontSize: 14, borderRadius: 20, border: `1px solid ${person.color}50`, background: "#0f0f17", color: "#fff", outline: "none" }}
            />
            <button
              onClick={sendMessage}
              disabled={busy || !input.trim()}
              style={{ background: input.trim() && !busy ? person.color : "#2a2a38", color: "#fff", border: "none", borderRadius: 12, padding: "11px 18px", fontSize: 16, opacity: busy || !input.trim() ? 0.5 : 1 }}
            >
              Send
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
        HumanAI
      </div>
      <div style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>Real AI Chat - Video - Voice - Bestie Zone</div>

      {(tab === "all" || tab === "bestie") && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#F59E0B", marginBottom: 8 }}>BESTIE ZONE</div>
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
        {[["all", "All"], ["bestie", "Besties"], ["desi", "Desi"]].map(([v, l]) => (
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
              <div style={{ fontSize: 12, color: p.color, marginTop: 2 }}>{p.prof} - {p.loc}</div>
              {count > 0 && <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{count} messages</div>}
            </div>
          </button>
        );
      })}

      <div style={{ textAlign: "center", marginTop: 16, fontSize: 10, color: "#555" }}>
        Powered by Groq AI - {PEOPLE.length} Personalities
      </div>
    </div>
  );
}
