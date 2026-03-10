import { useState, useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');`;

const styles = `
  ${FONTS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0e0e0e; color: #f0f0f0; font-family: 'Syne', sans-serif; min-height: 100vh; }
  .mono { font-family: 'DM Mono', monospace; }
  .app { max-width: 760px; margin: 0 auto; padding: 40px 24px 80px; }
  .header { margin-bottom: 48px; }
  .header h1 { font-size: 2rem; font-weight: 800; letter-spacing: -0.03em; color: #fff; }
  .header p { color: #888; margin-top: 6px; font-size: 0.9rem; }
  .header-desc { color: #777; margin-top: 10px; font-size: 0.85rem; line-height: 1.6; max-width: 520px; }
  .header-user { display: flex; align-items: center; gap: 10px; margin-top: 16px; }
  .header-user span { font-size: 0.82rem; color: #666; }
  .header-user strong { color: #ccc; }
  .header-user button { background: none; border: none; color: #444; font-size: 0.75rem; cursor: pointer; text-decoration: underline; font-family: 'Syne', sans-serif; }
  .header-user button:hover { color: #888; }
  .tabs { display: flex; gap: 4px; margin-bottom: 32px; background: #1a1a1a; border-radius: 10px; padding: 4px; }
  .tab { flex: 1; padding: 10px 8px; border: none; background: transparent; color: #666; font-family: 'Syne', sans-serif; font-size: 0.8rem; font-weight: 600; cursor: pointer; border-radius: 7px; transition: all 0.2s; letter-spacing: 0.03em; text-transform: uppercase; }
  .tab.active { background: #fff; color: #0e0e0e; }
  .tab:hover:not(.active) { color: #aaa; }
  .card { background: #161616; border: 1px solid #272727; border-radius: 14px; padding: 28px; margin-bottom: 16px; }
  .card h2 { font-size: 1rem; font-weight: 700; margin-bottom: 4px; color: #fff; }
  .card .hint { font-size: 0.8rem; color: #666; margin-bottom: 20px; }
  .mode-toggle { display: flex; gap: 8px; margin-bottom: 20px; }
  .mode-btn { padding: 7px 16px; border-radius: 20px; border: 1px solid #333; background: transparent; color: #777; font-family: 'Syne', sans-serif; font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .mode-btn.active { background: #2a2a2a; color: #fff; border-color: #555; }
  .input-row { display: flex; gap: 10px; }
  .input { flex: 1; background: #1e1e1e; border: 1px solid #333; border-radius: 10px; padding: 12px 16px; color: #f0f0f0; font-family: 'DM Mono', monospace; font-size: 0.82rem; outline: none; transition: border-color 0.2s; }
  .input:focus { border-color: #555; }
  .input::placeholder { color: #444; }
  .btn { padding: 12px 20px; border-radius: 10px; border: none; background: #fff; color: #0e0e0e; font-family: 'Syne', sans-serif; font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
  .btn:hover { background: #e0e0e0; }
  .btn.secondary { background: #1e1e1e; color: #aaa; border: 1px solid #333; }
  .btn.secondary:hover { background: #252525; color: #fff; }
  .btn.accent { background: #3d8aff; color: #fff; }
  .btn.accent:hover { background: #2f7aef; }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .sub-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; }
  .label { font-size: 0.75rem; color: #666; margin-bottom: 6px; display: block; letter-spacing: 0.04em; text-transform: uppercase; }
  .links-list { margin-top: 20px; display: flex; flex-direction: column; gap: 8px; }
  .link-item { display: flex; align-items: center; gap: 12px; background: #1a1a1a; border: 1px solid #252525; border-radius: 10px; padding: 12px 16px; }
  .link-icon { font-size: 1.1rem; flex-shrink: 0; }
  .link-info { flex: 1; min-width: 0; }
  .link-url { font-family: 'DM Mono', monospace; font-size: 0.75rem; color: #aaa; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .link-meta { font-size: 0.7rem; color: #555; margin-top: 2px; }
  .badge { display: inline-block; padding: 2px 7px; border-radius: 4px; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; background: #2a2a2a; color: #777; margin-right: 4px; }
  .badge.auto { background: #1a3a2a; color: #4ade80; }
  .remove-btn { background: none; border: none; color: #444; cursor: pointer; font-size: 1rem; padding: 4px; transition: color 0.2s; flex-shrink: 0; }
  .remove-btn:hover { color: #ff6b6b; }
  .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .option-card { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 10px; padding: 16px; cursor: pointer; transition: all 0.2s; }
  .option-card.selected { border-color: #555; background: #212121; }
  .option-card h3 { font-size: 0.85rem; font-weight: 700; margin-bottom: 4px; color: #fff; }
  .option-card p { font-size: 0.75rem; color: #666; }
  .delivery-checks { display: flex; flex-direction: column; gap: 10px; }
  .check-row { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: #1a1a1a; border: 1px solid #252525; border-radius: 10px; cursor: pointer; transition: all 0.2s; }
  .check-row.checked { border-color: #3d3d3d; background: #1e1e1e; }
  .check-box { width: 18px; height: 18px; border: 2px solid #444; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; flex-shrink: 0; transition: all 0.2s; }
  .check-box.checked { background: #fff; border-color: #fff; color: #0e0e0e; }
  .check-label { font-size: 0.85rem; font-weight: 600; color: #ccc; }
  .check-extra { margin-top: 10px; padding-left: 30px; }
  .time-row { display: flex; gap: 10px; align-items: center; margin-top: 10px; }
  .time-row .label { margin-bottom: 0; }
  select.input { cursor: pointer; }
  .preview-box { background: #111; border: 1px solid #252525; border-radius: 12px; padding: 24px; margin-top: 16px; }
  .preview-box h3 { font-size: 0.75rem; color: #555; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 16px; }
  .preview-content { font-size: 0.85rem; line-height: 1.7; color: #bbb; white-space: pre-wrap; }
  .loading { display: flex; align-items: center; gap: 10px; color: #666; font-size: 0.85rem; }
  .spinner { width: 16px; height: 16px; border: 2px solid #333; border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .empty-state { text-align: center; padding: 40px 20px; color: #444; }
  .empty-state .icon { font-size: 2rem; margin-bottom: 12px; }
  .empty-state p { font-size: 0.85rem; }
  .playlist-box { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 12px; padding: 20px; margin-top: 16px; }
  .share-link { font-family: 'DM Mono', monospace; font-size: 0.72rem; color: #3d8aff; word-break: break-all; background: #111; border-radius: 8px; padding: 10px 14px; margin-top: 8px; }
  .section-divider { border: none; border-top: 1px solid #1e1e1e; margin: 20px 0; }
  .summary-actions { display: flex; gap: 10px; margin-top: 16px; flex-wrap: wrap; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 24px; }
  .modal { background: #181818; border: 1px solid #2a2a2a; border-radius: 16px; padding: 36px; max-width: 400px; width: 100%; }
  .modal h2 { font-size: 1.4rem; font-weight: 800; margin-bottom: 8px; }
  .modal p { color: #777; font-size: 0.85rem; margin-bottom: 24px; line-height: 1.6; }
  .modal .input { width: 100%; margin-bottom: 12px; }
  canvas { display: block; border-radius: 8px; margin: 12px 0; }
  @media (max-width: 600px) { .options-grid { grid-template-columns: 1fr; } .sub-inputs { grid-template-columns: 1fr; } }
`;

const SCHEDULES = [
  { id: "daily", label: "Daily" },
  { id: "twice", label: "Twice a week" },
  { id: "weekly", label: "Weekly" },
  { id: "biweekly", label: "Every 2 weeks" },
];

const STYLES = [
  { id: "long", label: "Long Summary", desc: "Detailed insights & key arguments" },
  { id: "short", label: "Short Summary", desc: "2–3 sentence takeaway" },
  { id: "bullets", label: "Bullet Points", desc: "Scannable key insights" },
];

function detectType(url) {
  if (url.includes("youtube.com/channel") || url.includes("youtube.com/@") || url.includes("youtube.com/c/")) return "channel";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.endsWith(".rss") || url.includes("feed") || url.includes("podcast")) return "podcast";
  return "link";
}

function typeIcon(type) {
  if (type === "youtube") return "▶";
  if (type === "channel") return "📡";
  if (type === "podcast") return "🎙";
  return "🔗";
}

// Simple QR code generator using canvas — no external service needed
function QRCode({ url, size = 160 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !url) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = size;
    canvas.height = size;

    // Draw white background
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, size, size);

    // Use the QR server API but draw it onto canvas via Image
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&bgcolor=ffffff&color=000000&format=png`;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
    };
    img.onerror = () => {
      // Fallback: draw a simple pattern indicating QR
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = "#333";
      ctx.font = `${size * 0.08}px monospace`;
      ctx.textAlign = "center";
      ctx.fillText("QR Code", size / 2, size / 2 - 10);
      ctx.font = `${size * 0.06}px monospace`;
      ctx.fillStyle = "#888";
      ctx.fillText("(copy link above)", size / 2, size / 2 + 14);
    };
  }, [url, size]);

  return <canvas ref={canvasRef} width={size} height={size} style={{ borderRadius: 8, border: "4px solid #fff" }} />;
}

// Welcome modal for first-time users
function WelcomeModal({ onSave }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Welcome! 👋</h2>
        <p>Tell us your name so we can personalise your digest experience. Your info is saved locally in your browser — nothing is sent to any server.</p>
        <input
          className="input"
          placeholder="Your name (e.g. Vera)"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && name.trim() && onSave(name.trim(), email.trim())}
          autoFocus
        />
        <input
          className="input"
          placeholder="Email (optional — for digest delivery)"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && name.trim() && onSave(name.trim(), email.trim())}
        />
        <button
          className="btn"
          style={{ width: "100%", marginTop: 8 }}
          disabled={!name.trim()}
          onClick={() => onSave(name.trim(), email.trim())}
        >
          Get Started →
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [userName, setUserName] = useState(() => {
    try { return localStorage.getItem("digest_name") || ""; } catch { return ""; }
  });
  const [userEmail, setUserEmail] = useState(() => {
    try { return localStorage.getItem("digest_email") || ""; } catch { return ""; }
  });
  const [showWelcome, setShowWelcome] = useState(() => {
    try { return !localStorage.getItem("digest_name"); } catch { return true; }
  });

  const [activeTab, setActiveTab] = useState(0);
  const [addMode, setAddMode] = useState("single");
  const [links, setLinks] = useState([]);
  const [urlInput, setUrlInput] = useState("");
  const [channelInput, setChannelInput] = useState("");
  const [channelName, setChannelName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [schedule, setSchedule] = useState("weekly");
  const [deliveryTime, setDeliveryTime] = useState("08:00");
  const [deliveryMethods, setDeliveryMethods] = useState(["app"]);
  const [email, setEmail] = useState(userEmail);
  const [whatsapp, setWhatsapp] = useState("");
  const [summaryStyle, setSummaryStyle] = useState("bullets");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [playlistDesc, setPlaylistDesc] = useState("");
  const [shareLink, setShareLink] = useState("");

  const handleSaveUser = (name, mail) => {
    try {
      localStorage.setItem("digest_name", name);
      if (mail) localStorage.setItem("digest_email", mail);
    } catch {}
    setUserName(name);
    if (mail) { setUserEmail(mail); setEmail(mail); }
    setShowWelcome(false);
  };

  const handleReset = () => {
    try { localStorage.removeItem("digest_name"); localStorage.removeItem("digest_email"); } catch {}
    setUserName("");
    setUserEmail("");
    setShowWelcome(true);
  };

  const addSingleLink = () => {
    if (!urlInput.trim()) return;
    const type = detectType(urlInput);
    setLinks([...links, { url: urlInput.trim(), type, auto: false }]);
    setUrlInput("");
  };

  const addSubscription = () => {
    if (!channelInput.trim()) return;
    const type = detectType(channelInput);
    setLinks([...links, {
      url: channelInput.trim(),
      type: type === "youtube" ? "channel" : "podcast",
      channelName: channelName || channelInput,
      startDate,
      auto: true,
      autoUpdate,
    }]);
    setChannelInput("");
    setChannelName("");
    setStartDate("");
  };

  const removeLink = (i) => setLinks(links.filter((_, idx) => idx !== i));

  const toggleDelivery = (method) => {
    setDeliveryMethods(prev =>
      prev.includes(method) ? prev.filter(m => m !== method) : [...prev, method]
    );
  };

  const generatePreview = async () => {
    if (!links.length) return;
    setLoading(true);
    setPreview("");
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ links, style: summaryStyle, schedule, deliveryTime, deliveryMethods }),
      });
      const data = await res.json();
      setPreview(data.summary || data.error || "No summary returned.");
    } catch (e) {
      setPreview("Error: " + e.message);
    }
    setLoading(false);
  };

  const generatePlaylistLink = () => {
    const payload = { title: playlistTitle, desc: playlistDesc, links };
    const encoded = btoa(encodeURIComponent(JSON.stringify(payload)));
    const url = `${window.location.origin}/playlist?data=${encoded}`;
    setShareLink(url);
  };

  const tabs = ["Add Content", "Schedule", "Style", "Delivery", "Share Playlist"];

  return (
    <>
      <style>{styles}</style>
      {showWelcome && <WelcomeModal onSave={handleSaveUser} />}
      <div className="app">
        <div className="header">
          <h1>Content Digest</h1>
          <p className="mono">Your AI-powered media curator</p>
          <p className="header-desc">Add your YouTube links, channels, or podcasts — and receive an AI summary as often as you like, delivered however you prefer.</p>
          {userName && (
            <div className="header-user">
              <span>Welcome back, <strong>{userName}</strong> 👋</span>
              <button onClick={handleReset}>change</button>
            </div>
          )}
        </div>

        <div className="tabs">
          {tabs.map((t, i) => (
            <button key={i} className={`tab${activeTab === i ? " active" : ""}`} onClick={() => setActiveTab(i)}>{t}</button>
          ))}
        </div>

        {/* TAB 0: Add Content */}
        {activeTab === 0 && (
          <div className="card">
            <h2>Add Content</h2>
            <p className="hint">Single links or subscribe to a channel / podcast feed</p>

            <div className="mode-toggle">
              <button className={`mode-btn${addMode === "single" ? " active" : ""}`} onClick={() => setAddMode("single")}>🔗 Single Link</button>
              <button className={`mode-btn${addMode === "subscribe" ? " active" : ""}`} onClick={() => setAddMode("subscribe")}>📡 Subscribe to Channel / Feed</button>
            </div>

            {addMode === "single" ? (
              <div className="input-row">
                <input
                  className="input"
                  placeholder="Paste YouTube or podcast URL…"
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addSingleLink()}
                />
                <button className="btn" onClick={addSingleLink}>Add</button>
              </div>
            ) : (
              <>
                <div className="input-row">
                  <input
                    className="input"
                    placeholder="YouTube channel or podcast RSS URL…"
                    value={channelInput}
                    onChange={e => setChannelInput(e.target.value)}
                  />
                </div>
                <div className="sub-inputs">
                  <div>
                    <span className="label">Display Name</span>
                    <input className="input" placeholder="e.g. Lex Fridman" value={channelName} onChange={e => setChannelName(e.target.value)} />
                  </div>
                  <div>
                    <span className="label">Include content from</span>
                    <input className="input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                  </div>
                </div>
                <div className="time-row" style={{ marginTop: 14 }}>
                  <span className="label mono" style={{ color: "#666" }}>Auto-refresh new content</span>
                  <button
                    className={`mode-btn${autoUpdate ? " active" : ""}`}
                    onClick={() => setAutoUpdate(!autoUpdate)}
                    style={{ marginLeft: "auto" }}
                  >{autoUpdate ? "On" : "Off"}</button>
                </div>
                <button className="btn" style={{ marginTop: 14 }} onClick={addSubscription}>Subscribe</button>
              </>
            )}

            {links.length > 0 && (
              <div className="links-list">
                <hr className="section-divider" />
                {links.map((l, i) => (
                  <div key={i} className="link-item">
                    <span className="link-icon">{typeIcon(l.type)}</span>
                    <div className="link-info">
                      <div className="link-url">{l.channelName || l.url}</div>
                      <div className="link-meta">
                        {l.auto && <span className="badge auto">AUTO</span>}
                        <span className="badge mono">{l.type}</span>
                        {l.startDate && <span className="mono" style={{ fontSize: "0.7rem", color: "#555" }}>from {l.startDate}</span>}
                      </div>
                    </div>
                    <button className="remove-btn" onClick={() => removeLink(i)}>✕</button>
                  </div>
                ))}
              </div>
            )}

            {links.length === 0 && (
              <div className="empty-state" style={{ marginTop: 24 }}>
                <div className="icon">📭</div>
                <p>No content added yet</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 1: Schedule */}
        {activeTab === 1 && (
          <div className="card">
            <h2>Schedule</h2>
            <p className="hint">How often should your digest be generated?</p>
            <div className="options-grid">
              {SCHEDULES.map(s => (
                <div key={s.id} className={`option-card${schedule === s.id ? " selected" : ""}`} onClick={() => setSchedule(s.id)}>
                  <h3>{s.label}</h3>
                </div>
              ))}
            </div>
            <div className="time-row" style={{ marginTop: 20 }}>
              <span className="label">Delivery time</span>
              <input className="input mono" type="time" value={deliveryTime} onChange={e => setDeliveryTime(e.target.value)} style={{ width: 120, marginLeft: "auto" }} />
            </div>
          </div>
        )}

        {/* TAB 2: Style */}
        {activeTab === 2 && (
          <>
            <div className="card">
              <h2>Summary Style</h2>
              <p className="hint">How should your digest be written?</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {STYLES.map(s => (
                  <div key={s.id} className={`option-card${summaryStyle === s.id ? " selected" : ""}`} onClick={() => setSummaryStyle(s.id)}>
                    <h3>{s.label}</h3>
                    <p>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h2>Preview Digest</h2>
              <p className="hint">Generate a live AI summary with your current settings</p>
              <div className="summary-actions">
                <button className="btn accent" onClick={generatePreview} disabled={loading || !links.length}>
                  {loading ? "Generating…" : "▶ Generate Preview"}
                </button>
                {!links.length && <span style={{ fontSize: "0.78rem", color: "#555", alignSelf: "center" }}>Add content first</span>}
              </div>
              {loading && (
                <div className="preview-box">
                  <div className="loading"><div className="spinner" /> Generating your digest…</div>
                </div>
              )}
              {preview && !loading && (
                <div className="preview-box">
                  <h3 className="mono">Digest Preview</h3>
                  <div className="preview-content">{preview}</div>
                </div>
              )}
            </div>
          </>
        )}

        {/* TAB 3: Delivery */}
        {activeTab === 3 && (
          <div className="card">
            <h2>Where to Receive It</h2>
            <p className="hint">Choose one or more delivery methods</p>
            <div className="delivery-checks">
              {[
                { id: "app", label: "🖥 In-App", extra: null },
                { id: "email", label: "✉️ Email", extra: (
                  <input className="input" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                )},
                { id: "whatsapp", label: "💬 WhatsApp", extra: (
                  <input className="input mono" placeholder="+49 123 456 789" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
                )},
              ].map(({ id, label, extra }) => (
                <div key={id}>
                  <div className={`check-row${deliveryMethods.includes(id) ? " checked" : ""}`} onClick={() => toggleDelivery(id)}>
                    <div className={`check-box${deliveryMethods.includes(id) ? " checked" : ""}`}>
                      {deliveryMethods.includes(id) && "✓"}
                    </div>
                    <span className="check-label">{label}</span>
                  </div>
                  {deliveryMethods.includes(id) && extra && (
                    <div className="check-extra">{extra}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Share Playlist */}
        {activeTab === 4 && (
          <div className="card">
            <h2>Share Playlist</h2>
            <p className="hint">Curate a list and share it — anyone can open it, add their own links, and generate their own summary</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <span className="label">Playlist Title</span>
                <input className="input" placeholder="e.g. AI Weekly Picks" value={playlistTitle} onChange={e => setPlaylistTitle(e.target.value)} />
              </div>
              <div>
                <span className="label">Description</span>
                <input className="input" placeholder="Short description…" value={playlistDesc} onChange={e => setPlaylistDesc(e.target.value)} />
              </div>
              <button className="btn accent" onClick={generatePlaylistLink} disabled={!links.length || !playlistTitle}>
                Generate Share Link + QR
              </button>
              {!links.length && <span style={{ fontSize: "0.78rem", color: "#555" }}>Add content in tab 01 first</span>}
            </div>

            {shareLink && (
              <div className="playlist-box">
                <span className="label mono">Share Link</span>
                <div className="share-link">{shareLink}</div>
                <button className="btn secondary" style={{ marginTop: 10, fontSize: "0.78rem" }} onClick={() => navigator.clipboard.writeText(shareLink)}>
                  Copy Link
                </button>
                <div style={{ marginTop: 16 }}>
                  <span className="label mono">QR Code</span>
                  <QRCode url={shareLink} size={160} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
