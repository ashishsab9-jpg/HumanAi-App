"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Heart, X, MessageCircle, Home, Search, User, Send, Mic,
  Video, Phone, PhoneOff, ArrowLeft, LogOut
} from "lucide-react";
import { supabase } from "../lib/supabase";

const C = {
  bg: "#0F0817", surface: "#1B1025", surface2: "#241832", surface3: "#2A1B3D",
  border: "rgba(255,255,255,0.06)", border10: "rgba(255,255,255,0.1)",
  text: "#F4EFFA", textDim: "#E4DCEF", muted: "#9B8AAE", mutedDark: "#6E5F82",
  coral: "#FF6B6B", gold: "#FFD166", green: "#4ADE80", red: "#FF3B30",
};
const gradCoralGold = `linear-gradient(135deg, ${C.coral}, ${C.gold})`;

/* ---------------- Auth Screen ---------------- */
function AuthScreen({ onAuthed }) {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(""); setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      onAuthed();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: 28 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: C.text, marginBottom: 6 }}>HumanAI</h1>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 28 }}>
        {mode === "signup" ? "Naya account banao" : "Login karke aage badho"}
      </p>
      <input
        value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
        style={{ padding: "14px 16px", borderRadius: 14, background: C.surface3, border: `1px solid ${C.border10}`, color: C.text, fontSize: 14, marginBottom: 12, outline: "none" }}
      />
      <input
        value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password"
        style={{ padding: "14px 16px", borderRadius: 14, background: C.surface3, border: `1px solid ${C.border10}`, color: C.text, fontSize: 14, marginBottom: 12, outline: "none" }}
      />
      {error && <p style={{ color: C.coral, fontSize: 12, marginBottom: 12 }}>{error}</p>}
      <button
        onClick={submit} disabled={loading || !email || !password}
        style={{ padding: 15, borderRadius: 14, border: "none", background: gradCoralGold, color: "white", fontSize: 15, fontWeight: 600, opacity: loading ? 0.6 : 1 }}
      >
        {loading ? "Please wait..." : mode === "signup" ? "Sign Up" : "Sign In"}
      </button>
      <button
        onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
        style={{ marginTop: 14, background: "none", border: "none", color: C.muted, fontSize: 13 }}
      >
        {mode === "signup" ? "Already have an account? Sign in" : "New here? Create account"}
      </button>
    </div>
  );
}

/* ---------------- Avatar ---------------- */
function Avatar({ name, photo, size = 48, online, ring = true }) {
  const [imgError, setImgError] = useState(false);
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  const showPhoto = photo && !imgError;
  return (
    <div style={{ width: size, height: size, position: "relative", flexShrink: 0 }}>
      {ring && <div style={{ position: "absolute", inset: 0, borderRadius: "9999px", background: gradCoralGold, padding: 2 }} />}
      {showPhoto ? (
        <img src={photo} alt={name} onError={() => setImgError(true)}
          style={{ position: "absolute", inset: ring ? 2 : 0, borderRadius: "9999px", width: ring ? size - 4 : size, height: ring ? size - 4 : size, objectFit: "cover" }} />
      ) : (
        <div style={{ position: "absolute", inset: ring ? 2 : 0, borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, color: "white", background: gradCoralGold, fontSize: size * 0.32 }}>
          {initials}
        </div>
      )}
      {online && <div style={{ position: "absolute", borderRadius: "9999px", border: `2px solid ${C.surface}`, width: size * 0.26, height: size * 0.26, background: C.green, right: -2, bottom: -2 }} />}
    </div>
  );
}

/* ---------------- Discover ---------------- */
function Discover({ personas, onMatch }) {
  const [deck, setDeck] = useState(personas);
  useEffect(() => setDeck(personas), [personas]);
  const swipe = (dir) => {
    if (!deck.length) return;
    if (dir === "right") onMatch(deck[0]);
    setDeck((d) => d.slice(1));
  };
  const top = deck[0];
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "8px 16px 96px" }}>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {!top ? (
          <p style={{ color: C.muted }}>Sab dekh liya! 👀</p>
        ) : (
          <div style={{ width: "100%", maxWidth: 300, height: 420, borderRadius: 28, overflow: "hidden", position: "relative", backgroundImage: `url(${top.photo})`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent 60%)" }} />
            <div style={{ position: "absolute", bottom: 0, padding: 20, color: "white" }}>
              <h3 style={{ fontSize: 22, fontWeight: 700 }}>{top.name}</h3>
              <p style={{ fontSize: 13, opacity: 0.85 }}>{top.tag}</p>
              <p style={{ fontSize: 13, marginTop: 6 }}>{top.bio}</p>
            </div>
          </div>
        )}
      </div>
      {top && (
        <div style={{ display: "flex", justifyContent: "center", gap: 24, paddingTop: 20 }}>
          <button onClick={() => swipe("left")} style={{ width: 56, height: 56, borderRadius: "9999px", background: C.surface2, border: "none" }}><X color={C.coral} /></button>
          <button onClick={() => swipe("right")} style={{ width: 64, height: 64, borderRadius: "9999px", background: gradCoralGold, border: "none" }}><Heart color="white" fill="white" /></button>
        </div>
      )}
    </div>
  );
}

/* ---------------- Chat (real DB + real AI) ---------------- */
function ChatThread({ persona, userId, onBack }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    loadHistory();
    const unsub = supabase
      .channel(`ai_chat:${userId}:${persona.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "ai_chat_messages", filter: `user_id=eq.${userId}` }, (payload) => {
        if (payload.new.persona_id === persona.id) {
          setMessages((m) => (m.find((x) => x.id === payload.new.id) ? m : [...m, payload.new]));
        }
      })
      .subscribe();
    return () => supabase.removeChannel(unsub);
  }, [persona.id]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  async function loadHistory() {
    const { data } = await supabase
      .from("ai_chat_messages")
      .select("*")
      .eq("user_id", userId)
      .eq("persona_id", persona.id)
      .order("created_at", { ascending: true });
    setMessages(data || []);
  }

  async function send() {
    if (!text.trim() || typing) return;
    const userMsg = text.trim();
    setText("");
    await supabase.from("ai_chat_messages").insert({ user_id: userId, persona_id: persona.id, role: "user", content: userMsg });
    setTyping(true);

    const systemPrompt = `You are roleplaying as ${persona.name}, a fictional character on a social app. Profile: "${persona.tag}". Bio: "${persona.bio}". Reply in casual Hinglish, 1-2 lines, warm and in-character. Never mention being an AI.`;
    const history = [...messages, { role: "user", content: userMsg }].map((m) => ({ role: m.role, content: m.content }));

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 200, system: systemPrompt, messages: history }),
      });
      const data = await response.json();
      const textBlock = (data.content || []).find((b) => b.type === "text");
      const reply = textBlock ? textBlock.text.trim() : "Thoda network issue ho raha hai, phir try karo?";
      await supabase.from("ai_chat_messages").insert({ user_id: userId, persona_id: persona.id, role: "assistant", content: reply });
    } catch (e) {
      await supabase.from("ai_chat_messages").insert({ user_id: userId, persona_id: persona.id, role: "assistant", content: "Message nahi gaya, try again?" });
    } finally {
      setTyping(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, borderBottom: `1px solid ${C.border}` }}>
        <button onClick={onBack} style={{ background: "none", border: "none" }}><ArrowLeft color={C.text} /></button>
        <Avatar name={persona.name} photo={persona.photo} size={38} ring={false} />
        <p style={{ color: C.text, fontWeight: 600 }}>{persona.name}</p>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((m) => (
          <div key={m.id || Math.random()} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ padding: "10px 16px", borderRadius: 16, maxWidth: "75%", fontSize: 14, background: m.role === "user" ? gradCoralGold : C.surface3, color: m.role === "user" ? "white" : C.text }}>
              {m.content}
            </div>
          </div>
        ))}
        {typing && <div style={{ color: C.muted, fontSize: 12 }}>typing...</div>}
        <div ref={endRef} />
      </div>
      <div style={{ display: "flex", gap: 8, padding: 12, borderTop: `1px solid ${C.border}` }}>
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Message likho..." style={{ flex: 1, background: C.surface3, borderRadius: "9999px", padding: "10px 16px", color: C.text, border: "none", outline: "none" }} />
        <button onClick={send} style={{ padding: 10, borderRadius: "9999px", background: gradCoralGold, border: "none" }}><Send size={16} color="white" /></button>
      </div>
    </div>
  );
}

/* ---------------- Video Call (real PeerJS) ---------------- */
function VideoCallScreen({ userId, onClose }) {
  const [myId, setMyId] = useState("Generating...");
  const [remoteId, setRemoteId] = useState("");
  const [inCall, setInCall] = useState(false);
  const peerRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    let Peer;
    import("peerjs").then((mod) => {
      Peer = mod.default;
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        const peer = new Peer();
        peerRef.current = peer;
        peer.on("open", (id) => setMyId(id));
        peer.on("call", (call) => {
          call.answer(stream);
          call.on("stream", (remoteStream) => {
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
            setInCall(true);
          });
        });
      });
    });
    return () => { peerRef.current?.destroy(); localStreamRef.current?.getTracks().forEach((t) => t.stop()); };
  }, []);

  const joinCall = () => {
    if (!remoteId || !peerRef.current) return;
    const call = peerRef.current.call(remoteId, localStreamRef.current);
    call.on("stream", (remoteStream) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
      setInCall(true);
    });
  };

  return (
    <div style={{ position: "absolute", inset: 0, background: C.surface, zIndex: 50, display: "flex", flexDirection: "column", padding: 20 }}>
      <button onClick={onClose} style={{ alignSelf: "flex-start", background: "none", border: "none", color: C.muted, marginBottom: 16 }}>← Back</button>
      {!inCall ? (
        <>
          <p style={{ color: C.text, fontWeight: 600, marginBottom: 8 }}>Aapka call code:</p>
          <p style={{ color: C.gold, fontSize: 18, marginBottom: 20, wordBreak: "break-all" }}>{myId}</p>
          <input value={remoteId} onChange={(e) => setRemoteId(e.target.value)} placeholder="Doosre ka code paste karo"
            style={{ padding: 14, borderRadius: 12, background: C.surface3, border: "none", color: C.text, marginBottom: 12 }} />
          <button onClick={joinCall} style={{ padding: 14, borderRadius: 12, background: gradCoralGold, border: "none", color: "white", fontWeight: 600 }}>Connect Karo</button>
        </>
      ) : null}
      <div style={{ flex: 1, display: "flex", gap: 8, marginTop: 16 }}>
        <video ref={remoteVideoRef} autoPlay playsInline style={{ flex: 1, background: "#000", borderRadius: 12, objectFit: "cover" }} />
        <video ref={localVideoRef} autoPlay playsInline muted style={{ width: 100, borderRadius: 12, objectFit: "cover", transform: "scaleX(-1)" }} />
      </div>
    </div>
  );
}

/* ---------------- Main App ---------------- */
export default function HumanAIApp() {
  const [session, setSession] = useState(undefined);
  const [personas, setPersonas] = useState([]);
  const [tab, setTab] = useState("discover");
  const [activeChat, setActiveChat] = useState(null);
  const [showCall, setShowCall] = useState(false);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    supabase.from("ai_personas").select("*").order("id").then(({ data }) => setPersonas(data || []));
  }, [session]);

  if (session === undefined) {
    return <div style={{ height: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>Loading...</div>;
  }

  if (!session) {
    return (
      <div style={{ height: "100vh", background: C.bg, display: "flex", flexDirection: "column" }}>
        <AuthScreen onAuthed={() => {}} />
      </div>
    );
  }

  const userId = session.user.id;

  return (
    <div style={{ height: "100vh", background: C.bg, display: "flex", flexDirection: "column", fontFamily: "sans-serif", position: "relative", maxWidth: 480, margin: "0 auto" }}>
      {!activeChat && !showCall && (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 20px" }}>
          <p style={{ color: C.text, fontWeight: 700, fontSize: 18 }}>HumanAI</p>
          <button onClick={() => supabase.auth.signOut()} style={{ background: "none", border: "none" }}><LogOut size={18} color={C.muted} /></button>
        </div>
      )}

      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {activeChat ? (
          <ChatThread persona={activeChat} userId={userId} onBack={() => setActiveChat(null)} />
        ) : tab === "discover" ? (
          <Discover personas={personas} onMatch={(p) => setMatches((m) => [p, ...m])} />
        ) : tab === "chats" ? (
          <div style={{ padding: 16, overflowY: "auto", height: "100%" }}>
            {(matches.length ? matches : personas.slice(0, 5)).map((p) => (
              <button key={p.id} onClick={() => setActiveChat(p)} style={{ display: "flex", gap: 12, width: "100%", padding: 12, background: "none", border: "none", borderBottom: `1px solid ${C.border}` }}>
                <Avatar name={p.name} photo={p.photo} size={48} online={p.is_online} />
                <div style={{ textAlign: "left" }}>
                  <p style={{ color: C.text, fontWeight: 600 }}>{p.name}</p>
                  <p style={{ color: C.muted, fontSize: 12 }}>{p.tag}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div style={{ padding: 40, textAlign: "center", color: C.muted }}>Profile: {session.user.email}</div>
        )}
        {showCall && <VideoCallScreen userId={userId} onClose={() => setShowCall(false)} />}
      </div>

      {!activeChat && !showCall && (
        <div style={{ display: "flex", justifyContent: "space-around", padding: 12, borderTop: `1px solid ${C.border}` }}>
          <button onClick={() => setTab("discover")} style={{ background: "none", border: "none" }}><Search color={tab === "discover" ? C.coral : C.mutedDark} /></button>
          <button onClick={() => setTab("chats")} style={{ background: "none", border: "none" }}><MessageCircle color={tab === "chats" ? C.coral : C.mutedDark} /></button>
          <button onClick={() => setShowCall(true)} style={{ background: "none", border: "none" }}><Video color={C.mutedDark} /></button>
          <button onClick={() => setTab("profile")} style={{ background: "none", border: "none" }}><User color={tab === "profile" ? C.coral : C.mutedDark} /></button>
        </div>
      )}
    </div>
  );
}
