import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');`;

const styles = `
  ${FONTS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #111118; }

  .app {
    min-height: 100vh;
    background: #111118;
    color: #e8e6e1;
    font-family: 'DM Mono', monospace;
    padding: 32px 24px;
    max-width: 780px;
    margin: 0 auto;
  }

  .header { margin-bottom: 48px; }
  .header-tag { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #9090a8; margin-bottom: 8px; }
  .header h1 { font-family: 'Syne', sans-serif; font-size: clamp(28px, 5vw, 42px); font-weight: 800; line-height: 1.05; color: #ffffff; letter-spacing: -0.02em; }
  .header h1 span { color: #c8f264; }

  .tab-row { display: flex; gap: 4px; margin-bottom: 40px; background: #1a1a24; border: 1px solid #2a2a38; border-radius: 8px; padding: 4px; }
  .tab {
    flex: 1; padding: 10px; text-align: center; cursor: pointer;
    border-radius: 6px; font-family: 'Syne', sans-serif; font-size: 13px;
    font-weight: 600; color: #9090a8; transition: all 0.15s; border: none; background: none;
  }
  .tab.active { background: #c8f264; color: #0a0a0f; }
  .tab:hover:not(.active) { color: #ffffff; }

  .section { margin-bottom: 40px; }
  .section-label { font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #9090a8; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; font-weight: 600; }
  .section-label::after { content: ''; flex: 1; height: 1px; background: #2a2a38; }

  /* Add mode toggle */
  .add-mode-toggle { display: flex; gap: 4px; margin-bottom: 14px; background: #111118; border: 1px solid #2a2a38; border-radius: 6px; padding: 3px; }
  .mode-btn { flex: 1; padding: 8px 12px; border: none; border-radius: 4px; font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s; color: #9090a8; background: none; }
  .mode-btn.active { background: #2a2a38; color: #c8f264; }
  .mode-btn:hover:not(.active) { color: #ffffff; }

  /* Channel/Feed subscription box */
  .sub-box { background: #1a1a24; border: 1px solid #2a2a38; border-radius: 8px; padding: 18px; display: flex; flex-direction: column; gap: 12px; }
  .sub-row { display: flex; gap: 10px; align-items: flex-end; flex-wrap: wrap; }
  .sub-field { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 200px; }
  .sub-field-label { font-size: 11px; color: #b0b0c8; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; }
  .sub-options { display: flex; gap: 8px; flex-wrap: wrap; }
  .sub-type-btn { padding: 7px 16px; border: 1px solid #2a2a38; border-radius: 20px; font-family: 'DM Mono', monospace; font-size: 12px; cursor: pointer; background: #111118; color: #c0c0d8; transition: all 0.15s; }
  .sub-type-btn.active { border-color: #c8f264; color: #c8f264; background: #1c2210; }
  .sub-hint { font-size: 12px; color: #b0b0c8; line-height: 1.6; padding: 10px 14px; background: #1a1a24; border-radius: 6px; border-left: 3px solid #c8f264; }

  .input-row { display: flex; gap: 10px; }
  .url-input { flex: 1; background: #1a1a24; border: 1px solid #2a2a38; border-radius: 6px; padding: 12px 16px; font-family: 'DM Mono', monospace; font-size: 13px; color: #ffffff; outline: none; transition: border-color 0.2s; }
  .url-input::placeholder { color: #5a5a78; }
  .url-input:focus { border-color: #c8f264; }

  .date-input { background: #1a1a24; border: 1px solid #2a2a38; border-radius: 6px; padding: 12px 14px; font-family: 'DM Mono', monospace; font-size: 13px; color: #ffffff; outline: none; transition: border-color 0.2s; color-scheme: dark; }
  .date-input:focus { border-color: #c8f264; }

  .text-input { width: 100%; background: #1a1a24; border: 1px solid #2a2a38; border-radius: 6px; padding: 12px 16px; font-family: 'DM Mono', monospace; font-size: 13px; color: #ffffff; outline: none; transition: border-color 0.2s; }
  .text-input::placeholder { color: #5a5a78; }
  .text-input:focus { border-color: #c8f264; }
  textarea.text-input { resize: vertical; min-height: 72px; line-height: 1.5; }

  .btn-add { background: #c8f264; color: #0a0a0f; border: none; border-radius: 6px; padding: 12px 20px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: opacity 0.15s, transform 0.1s; white-space: nowrap; }
  .btn-add:hover { opacity: 0.85; transform: translateY(-1px); }
  .btn-add:active { transform: translateY(0); }

  .btn-refresh { background: #2a2a38; color: #e0e0f0; border: 1px solid #3a3a50; border-radius: 6px; padding: 8px 14px; font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 6px; }
  .btn-refresh:hover { border-color: #c8f264; color: #c8f264; }

  .link-list { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
  .link-item { background: #1a1a24; border: 1px solid #2a2a38; border-radius: 6px; padding: 10px 14px; display: flex; align-items: center; gap: 12px; animation: fadeIn 0.2s ease; }
  .link-item.is-sub { border-left: 3px solid #c8f264; }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

  .link-icon { font-size: 16px; flex-shrink: 0; }
  .link-info { flex: 1; overflow: hidden; }
  .link-url { font-size: 13px; color: #d0d0e8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .link-meta { font-size: 11px; color: #9090a8; margin-top: 3px; }
  .link-badge { display: inline-flex; align-items: center; gap: 4px; background: #1c2210; border: 1px solid #c8f264; border-radius: 10px; padding: 2px 8px; font-size: 10px; color: #c8f264; letter-spacing: 0.05em; margin-left: 6px; }
  .btn-remove { background: none; border: none; color: #6060808; cursor: pointer; font-size: 16px; padding: 2px 6px; border-radius: 4px; transition: color 0.15s, background 0.15s; flex-shrink: 0; color: #707090; }
  .btn-remove:hover { color: #ff6b6b; background: #2a2a38; }

  /* Auto-update toggle */
  .auto-row { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: #1a1a24; border: 1px solid #2a2a38; border-radius: 6px; margin-top: 10px; }
  .toggle { position: relative; width: 36px; height: 20px; flex-shrink: 0; }
  .toggle input { opacity: 0; width: 0; height: 0; }
  .toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: #2a2a38; border-radius: 20px; transition: 0.2s; border: 1px solid #3a3a50; }
  .toggle-slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 2px; bottom: 2px; background: #7070908; border-radius: 50%; transition: 0.2s; background: #9090a8; }
  .toggle input:checked + .toggle-slider { background: #1c2210; border-color: #c8f264; }
  .toggle input:checked + .toggle-slider:before { transform: translateX(16px); background: #c8f264; }
  .auto-label { font-size: 13px; color: #c0c0d8; flex: 1; }
  .auto-label strong { color: #ffffff; font-weight: 600; }

  .option-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px; }
  .option-card { background: #1a1a24; border: 1px solid #2a2a38; border-radius: 6px; padding: 14px 12px; cursor: pointer; transition: all 0.15s; text-align: center; }
  .option-card:hover { border-color: #4a4a60; background: #1e1e2c; }
  .option-card.selected { border-color: #c8f264; background: #1c2210; }
  .option-card .opt-icon { font-size: 20px; margin-bottom: 6px; }
  .option-card .opt-label { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600; color: #e0e0f0; }
  .option-card.selected .opt-label { color: #c8f264; }
  .option-card .opt-sub { font-size: 11px; color: #9090a8; margin-top: 3px; }

  .time-row { display: flex; align-items: center; gap: 16px; margin-top: 16px; flex-wrap: wrap; }
  .time-label { font-size: 12px; color: #b0b0c8; letter-spacing: 0.05em; }
  .time-select { background: #1a1a24; border: 1px solid #2a2a38; border-radius: 6px; padding: 8px 14px; font-family: 'DM Mono', monospace; font-size: 13px; color: #ffffff; outline: none; cursor: pointer; transition: border-color 0.2s; -webkit-appearance: none; }
  .time-select:focus { border-color: #c8f264; }

  .delivery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px; }
  .delivery-card { background: #1a1a24; border: 1px solid #2a2a38; border-radius: 6px; padding: 14px 16px; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 12px; }
  .delivery-card:hover { border-color: #4a4a60; }
  .delivery-card.selected { border-color: #c8f264; background: #1c2210; }
  .delivery-card .d-icon { font-size: 20px; flex-shrink: 0; }
  .delivery-card .d-info { flex: 1; }
  .delivery-card .d-name { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600; color: #e0e0f0; }
  .delivery-card.selected .d-name { color: #c8f264; }
  .delivery-card .d-sub { font-size: 11px; color: #9090a8; margin-top: 3px; }
  .delivery-card .d-check { width: 16px; height: 16px; border-radius: 4px; border: 1px solid #4a4a60; background: transparent; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 10px; transition: all 0.15s; }
  .delivery-card.selected .d-check { background: #c8f264; border-color: #c8f264; color: #0a0a0f; font-weight: 700; }

  .delivery-inputs-row { display: flex; flex-direction: column; gap: 12px; margin-top: 14px; }
  .delivery-input-block { display: flex; flex-direction: column; gap: 6px; animation: fadeIn 0.2s ease; }
  .delivery-input-label { font-size: 11px; color: #b0b0c8; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; }
  .delivery-input-field { background: #1a1a24; border: 1px solid #2a2a38; border-radius: 6px; padding: 10px 14px; font-family: 'DM Mono', monospace; font-size: 13px; color: #ffffff; outline: none; transition: border-color 0.2s; width: 100%; }
  .delivery-input-field::placeholder { color: #5a5a78; }
  .delivery-input-field:focus { border-color: #c8f264; }

  .style-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px; }
  .style-card { background: #1a1a24; border: 1px solid #2a2a38; border-radius: 6px; padding: 16px; cursor: pointer; transition: all 0.15s; }
  .style-card:hover { border-color: #4a4a60; }
  .style-card.selected { border-color: #c8f264; background: #1c2210; }
  .style-card .s-icon { font-size: 22px; margin-bottom: 8px; }
  .style-card .s-name { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #ffffff; margin-bottom: 4px; }
  .style-card.selected .s-name { color: #c8f264; }
  .style-card .s-desc { font-size: 12px; color: #9090a8; line-height: 1.5; }

  .preview-box { background: #1a1a24; border: 1px solid #2a2a38; border-radius: 8px; padding: 24px; position: relative; overflow: hidden; }
  .preview-box::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, #c8f264, transparent); }
  .preview-loading { display: flex; align-items: center; gap: 10px; color: #9090a8; font-size: 13px; }
  .spinner { width: 16px; height: 16px; border: 2px solid #2a2a38; border-top-color: #c8f264; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .preview-meta { font-size: 11px; color: #9090a8; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px; font-weight: 600; }
  .preview-content { font-size: 14px; color: #e0e0f0; line-height: 1.8; }
  .preview-content strong { color: #ffffff; font-weight: 600; }
  .preview-delivery-row { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 14px; padding-top: 14px; border-top: 1px solid #2a2a38; align-items: center; }
  .preview-badge { display: inline-flex; align-items: center; gap: 5px; background: #1a1a24; border: 1px solid #3a3a50; border-radius: 20px; padding: 4px 10px; font-size: 11px; color: #c0c0d8; }

  .error-box { background: #200a0a; border: 1px solid #5a1010; border-radius: 6px; padding: 12px 16px; font-size: 13px; color: #ff8080; line-height: 1.5; }
  .warning-note { margin-top: 10px; padding: 10px 14px; background: #1e1608; border: 1px solid #5a3a10; border-radius: 6px; font-size: 12px; color: #e0a840; line-height: 1.5; }

  .share-box { background: #1a1a24; border: 1px solid #2a2a38; border-radius: 8px; padding: 24px; position: relative; overflow: hidden; }
  .share-box::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, #c8f264, transparent); }
  .share-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #ffffff; margin-bottom: 4px; }
  .share-desc { font-size: 13px; color: #9090a8; margin-bottom: 20px; line-height: 1.5; }

  .share-link-row { display: flex; gap: 8px; margin-bottom: 16px; }
  .share-link-input { flex: 1; background: #111118; border: 1px solid #2a2a38; border-radius: 6px; padding: 10px 14px; font-family: 'DM Mono', monospace; font-size: 11px; color: #b0b0c8; outline: none; cursor: text; }
  .btn-copy { background: #2a2a38; color: #e0e0f0; border: none; border-radius: 6px; padding: 10px 16px; font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
  .btn-copy:hover { background: #3a3a50; }
  .btn-copy.copied { background: #1c2210; color: #c8f264; border: 1px solid #c8f264; }

  .qr-box { display: flex; justify-content: center; margin-top: 16px; padding: 16px; background: #ffffff; border-radius: 8px; }

  .playlist-header { background: #1a1a24; border: 1px solid #2a2a38; border-radius: 8px; padding: 20px 24px; margin-bottom: 24px; position: relative; overflow: hidden; }
  .playlist-header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, #c8f264, transparent); }
  .playlist-header-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #ffffff; margin-bottom: 6px; }
  .playlist-header-desc { font-size: 13px; color: #b0b0c8; line-height: 1.6; }
  .playlist-header-meta { font-size: 11px; color: #9090a8; margin-top: 10px; letter-spacing: 0.1em; text-transform: uppercase; }

  .cta-row { display: flex; gap: 12px; flex-wrap: wrap; }
  .btn-primary { background: #c8f264; color: #0a0a0f; border: none; border-radius: 6px; padding: 14px 28px; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: opacity 0.15s, transform 0.1s; }
  .btn-primary:hover { opacity: 0.85; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }
  .btn-secondary { background: transparent; color: #c0c0d8; border: 1px solid #2a2a38; border-radius: 6px; padding: 14px 28px; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
  .btn-secondary:hover { border-color: #9090a8; color: #ffffff; }
  .btn-secondary:disabled { opacity: 0.35; cursor: not-allowed; }
  .btn-ghost { background: transparent; color: #9090a8; border: 1px solid #2a2a38; border-radius: 6px; padding: 10px 18px; font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
  .btn-ghost:hover { border-color: #c8f264; color: #c8f264; }

  .status-pill { display: inline-flex; align-items: center; gap: 6px; background: #1c2210; border: 1px solid #c8f264; border-radius: 20px; padding: 6px 14px; font-size: 12px; color: #c8f264; letter-spacing: 0.05em; animation: fadeIn 0.3s ease; }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: #c8f264; }

  .empty-state { padding: 20px; text-align: center; color: #6060808; font-size: 13px; border: 1px dashed #2a2a38; border-radius: 6px; color: #7070908; color: #9090a8; }
  .divider { height: 1px; background: #2a2a38; margin: 32px 0; }
`;

const SCHEDULES = [
  { id: "daily",      icon: "☀️", label: "Daily",       sub: "Every day" },
  { id: "twice_week", icon: "⚡", label: "Twice/Week",  sub: "Mon & Thu" },
  { id: "weekly",     icon: "📅", label: "Weekly",      sub: "Once a week" },
  { id: "biweekly",   icon: "🌙", label: "Biweekly",    sub: "Every 2 weeks" },
];
const HOURS = Array.from({ length: 24 }, (_, i) => {
  const h = i.toString().padStart(2, "0");
  return { value: `${h}:00`, label: `${h}:00` };
});
const DELIVERY_METHODS = [
  { id: "app",      icon: "🖥️", name: "In-App",   sub: "View inside the tool" },
  { id: "email",    icon: "✉️", name: "Email",    sub: "Sent to your inbox" },
  { id: "whatsapp", icon: "💬", name: "WhatsApp", sub: "Via WATI / number" },
];
const STYLES = [
  { id: "long",    icon: "📖",  name: "Long Summary",   desc: "Full detailed breakdown of each piece of content" },
  { id: "short",   icon: "⚡",  name: "Short Summary",  desc: "Quick 2–3 sentence recap per item" },
  { id: "bullets", icon: "•••", name: "Bullet Points",  desc: "Key takeaways as scannable bullet points only" },
];

function detectType(url) {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("spotify.com") || url.includes("podcasts.apple.com") || url.includes("podcast") || url.includes(".rss") || url.includes("/feed")) return "podcast";
  return "link";
}
function typeIcon(t, isSub) {
  if (isSub) return t === "youtube" ? "📺" : "🎙️";
  if (t === "youtube") return "▶️";
  if (t === "podcast") return "🎙️";
  return "🔗";
}
function shortUrl(url) {
  try {
    const u = new URL(url);
    return u.hostname + u.pathname.slice(0, 28) + (u.pathname.length > 28 ? "…" : "");
  } catch { return url.slice(0, 40) + "…"; }
}

function encodePlaylist(playlist) {
  return btoa(encodeURIComponent(JSON.stringify(playlist)));
}
function decodePlaylist(str) {
  try { return JSON.parse(decodeURIComponent(atob(str))); }
  catch { return null; }
}

function QRCode({ url }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(url)}`;
  return <img src={qrUrl} alt="QR Code" width={160} height={160} style={{ display: 'block' }} />;
}

function renderContent(text) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**"))
      return <div key={i} style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: "#e8e4dc", marginBottom: 12 }}>{line.replace(/\*\*/g, "")}</div>;
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <div key={i} style={{ marginBottom: line === "" ? 8 : 4 }}>
        {parts.map((p, j) => p.startsWith("**") ? <strong key={j}>{p.replace(/\*\*/g, "")}</strong> : p)}
      </div>
    );
  });
}

// ─── Channel/Feed Subscription Input ─────────────────────────────────────────
function SubscribeInput({ onAdd }) {
  const [subType, setSubType] = useState("youtube");
  const [subUrl, setSubUrl] = useState("");
  const [subName, setSubName] = useState("");
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split("T")[0];
  });

  const hints = {
    youtube: "e.g. https://www.youtube.com/@channelname or /channel/UCxxxx",
    podcast: "Paste the RSS feed URL — usually found on the podcast's website or via Spotify/Apple Podcasts"
  };

  const handleAdd = () => {
    if (!subUrl.trim()) return;
    onAdd({
      id: Date.now(),
      url: subUrl.trim(),
      type: subType,
      isSub: true,
      channelName: subName.trim() || shortUrl(subUrl.trim()),
      fromDate,
    });
    setSubUrl("");
    setSubName("");
  };

  return (
    <div className="sub-box">
      <div>
        <div className="sub-field-label" style={{ marginBottom: 8 }}>Source type</div>
        <div className="sub-options">
          <button className={`sub-type-btn${subType === "youtube" ? " active" : ""}`} onClick={() => setSubType("youtube")}>▶️ YouTube Channel</button>
          <button className={`sub-type-btn${subType === "podcast" ? " active" : ""}`} onClick={() => setSubType("podcast")}>🎙️ Podcast Feed</button>
        </div>
      </div>

      <div className="sub-row">
        <div className="sub-field">
          <div className="sub-field-label">Channel / Feed URL</div>
          <input className="url-input" value={subUrl} onChange={e => setSubUrl(e.target.value)} placeholder={hints[subType]} />
        </div>
        <div className="sub-field" style={{ maxWidth: 180 }}>
          <div className="sub-field-label">Display name (optional)</div>
          <input className="url-input" value={subName} onChange={e => setSubName(e.target.value)} placeholder="e.g. Lex Fridman" />
        </div>
      </div>

      <div className="sub-row" style={{ alignItems: "center" }}>
        <div className="sub-field" style={{ maxWidth: 220 }}>
          <div className="sub-field-label">Include content from</div>
          <input className="date-input" type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
        </div>
        <button className="btn-add" style={{ marginTop: 20 }} onClick={handleAdd}>+ Subscribe</button>
      </div>

      <div className="sub-hint">
        📌 All new episodes / videos published after the selected date will be automatically included in your digest.
      </div>
    </div>
  );
}

// ─── Shared Playlist View ─────────────────────────────────────────────────────
function SharedPlaylistView({ playlist, onBack }) {
  const [links, setLinks] = useState([...playlist.links]);
  const [inputUrl, setInputUrl] = useState("");
  const [summaryStyle, setSummaryStyle] = useState("bullets");
  const [previewing, setPreviewing] = useState(false);
  const [previewText, setPreviewText] = useState(null);
  const [previewError, setPreviewError] = useState(null);

  const addLink = () => {
    const trimmed = inputUrl.trim();
    if (!trimmed) return;
    setLinks(prev => [...prev, { id: Date.now(), url: trimmed, type: detectType(trimmed) }]);
    setInputUrl("");
  };
  const removeLink = (id) => setLinks(prev => prev.filter(l => l.id !== id));
  const handleKeyDown = (e) => { if (e.key === "Enter") addLink(); };

  const generatePreview = async () => {
    if (links.length === 0) return;
    setPreviewing(true); setPreviewText(null); setPreviewError(null);
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ links, style: summaryStyle, schedule: 'now', deliveryTime: '', deliveryMethods: ['app'] })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setPreviewText(data.summary);
    } catch (err) {
      setPreviewError(err.message);
    } finally {
      setPreviewing(false);
    }
  };

  return (
    <div>
      <div className="playlist-header">
        <div className="playlist-header-title">🎵 {playlist.title}</div>
        {playlist.description && <div className="playlist-header-desc">{playlist.description}</div>}
        <div className="playlist-header-meta">{playlist.links.length} original link{playlist.links.length !== 1 ? 's' : ''} · shared playlist</div>
      </div>

      <div className="section">
        <div className="section-label">Links</div>
        <div className="link-list">
          {links.map(l => (
            <div className={`link-item${l.isSub ? " is-sub" : ""}`} key={l.id}>
              <span className="link-icon">{typeIcon(l.type, l.isSub)}</span>
              <div className="link-info">
                <div className="link-url">{l.channelName || shortUrl(l.url)}</div>
                {l.isSub && <div className="link-meta">From {l.fromDate} onwards<span className="link-badge">AUTO</span></div>}
              </div>
              <button className="btn-remove" onClick={() => removeLink(l.id)}>✕</button>
            </div>
          ))}
        </div>
        <div className="input-row" style={{ marginTop: 10 }}>
          <input className="url-input" value={inputUrl} onChange={e => setInputUrl(e.target.value)}
            onKeyDown={handleKeyDown} placeholder="Add your own links…" />
          <button className="btn-add" onClick={addLink}>+ Add</button>
        </div>
      </div>

      <div className="section">
        <div className="section-label">Your Summary Style</div>
        <div className="style-grid">
          {STYLES.map(s => (
            <div key={s.id} className={`style-card${summaryStyle === s.id ? " selected" : ""}`}
              onClick={() => { setSummaryStyle(s.id); setPreviewText(null); }}>
              <div className="s-icon">{s.icon}</div>
              <div className="s-name">{s.name}</div>
              <div className="s-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {links.length > 0 && (
        <div className="section">
          <div className="preview-box">
            {!previewText && !previewing && !previewError && (
              <div style={{ color: "#3a3a4e", fontSize: 12, textAlign: "center", padding: "12px 0" }}>
                Generate your AI summary below
              </div>
            )}
            {previewing && <div className="preview-loading"><div className="spinner" />Summarizing {links.length} item{links.length > 1 ? 's' : ''}…</div>}
            {previewError && <div className="error-box">⚠ {previewError}</div>}
            {previewText && !previewing && (
              <>
                <div className="preview-meta">AI summary · {STYLES.find(s => s.id === summaryStyle)?.name}</div>
                <div className="preview-content">{renderContent(previewText)}</div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="cta-row">
        <button className="btn-primary" onClick={generatePreview} disabled={previewing || links.length === 0}>
          {previewing ? "Generating…" : "Generate My Summary"}
        </button>
        <button className="btn-ghost" onClick={onBack}>← Back</button>
      </div>
    </div>
  );
}


// ─── Auth styles ──────────────────────────────────────────────────────────────
const authStyles = `
  .auth-wrap { min-height: 100vh; background: #111118; display: flex; align-items: center; justify-content: center; padding: 24px; }
  .auth-box { background: #1a1a24; border: 1px solid #2a2a38; border-radius: 12px; padding: 40px 36px; width: 100%; max-width: 420px; position: relative; overflow: hidden; }
  .auth-box::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #c8f264, transparent); }
  .auth-tag { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #9090a8; margin-bottom: 10px; font-family: 'DM Mono', monospace; }
  .auth-title { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: #ffffff; margin-bottom: 6px; }
  .auth-title span { color: #c8f264; }
  .auth-sub { font-size: 13px; color: #9090a8; margin-bottom: 32px; line-height: 1.5; font-family: 'DM Mono', monospace; }
  .auth-label { font-size: 11px; color: #b0b0c8; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; margin-bottom: 8px; display: block; font-family: 'DM Mono', monospace; }
  .auth-input { width: 100%; background: #111118; border: 1px solid #2a2a38; border-radius: 6px; padding: 13px 16px; font-family: 'DM Mono', monospace; font-size: 14px; color: #ffffff; outline: none; transition: border-color 0.2s; margin-bottom: 16px; }
  .auth-input::placeholder { color: #5a5a78; }
  .auth-input:focus { border-color: #c8f264; }
  .auth-btn { width: 100%; background: #c8f264; color: #0a0a0f; border: none; border-radius: 6px; padding: 14px; font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; transition: opacity 0.15s; margin-top: 4px; }
  .auth-btn:hover { opacity: 0.88; }
  .auth-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .auth-success { background: #1c2210; border: 1px solid #c8f264; border-radius: 8px; padding: 16px 20px; text-align: center; }
  .auth-success-icon { font-size: 28px; margin-bottom: 10px; }
  .auth-success-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #c8f264; margin-bottom: 6px; }
  .auth-success-sub { font-size: 12px; color: #9090a8; line-height: 1.6; font-family: 'DM Mono', monospace; }
  .auth-error { background: #200a0a; border: 1px solid #5a1010; border-radius: 6px; padding: 10px 14px; font-size: 12px; color: #ff8080; margin-bottom: 14px; font-family: 'DM Mono', monospace; }
  .user-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; padding: 10px 14px; background: #1a1a24; border: 1px solid #2a2a38; border-radius: 6px; }
  .user-email { font-size: 12px; color: #9090a8; font-family: 'DM Mono', monospace; }
  .user-email span { color: #c8f264; }
  .btn-signout { background: none; border: 1px solid #2a2a38; border-radius: 4px; padding: 5px 12px; font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 600; color: #9090a8; cursor: pointer; transition: all 0.15s; }
  .btn-signout:hover { border-color: #ff6b6b; color: #ff6b6b; }
  .sync-indicator { font-size: 10px; color: #9090a8; font-family: 'DM Mono', monospace; display: flex; align-items: center; gap: 5px; }
  .sync-dot { width: 6px; height: 6px; border-radius: 50%; background: #c8f264; animation: pulse 2s infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
`;

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    if (!email.trim()) return;
    setLoading(true); setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin }
    });
    if (error) { setError(error.message); setLoading(false); }
    else { setSent(true); setLoading(false); }
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');${authStyles}`}</style>
      <div className="auth-wrap">
        <div className="auth-box">
          <div className="auth-tag">Content Intelligence Tool</div>
          <div className="auth-title">Your <span>Digest</span></div>
          <div style={{fontSize:"14px", color:"#e0e0f0", lineHeight:1.6, marginBottom:"20px", fontFamily:"'DM Mono', monospace"}}>Add YouTube videos, podcasts or entire channels — and get an AI-generated summary delivered to you on your schedule.</div>
          <div className="auth-sub">Enter your email to receive a magic link — no password needed.</div>

          {sent ? (
            <div className="auth-success">
              <div className="auth-success-icon">📬</div>
              <div className="auth-success-title">Check your inbox!</div>
              <div className="auth-success-sub">We sent a magic link to <strong style={{color:"#e0e0f0"}}>{email}</strong>. Click it to sign in — no password needed.</div>
            </div>
          ) : (
            <>
              {error && <div className="auth-error">⚠ {error}</div>}
              <label className="auth-label">Your email</label>
              <input
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                autoFocus
              />
              <button className="auth-btn" onClick={handleLogin} disabled={loading || !email.trim()}>
                {loading ? "Sending…" : "✉️ Send Magic Link"}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [activeTab, setActiveTab] = useState("digest");
  const [sharedPlaylist, setSharedPlaylist] = useState(null);
  const [addMode, setAddMode] = useState("single");
  const [dbLoading, setDbLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Digest state
  const [links, setLinks] = useState([]);
  const [inputUrl, setInputUrl] = useState("");
  const [schedule, setSchedule] = useState("weekly");
  const [deliveryTime, setDeliveryTime] = useState("08:00");
  const [deliveryMethods, setDeliveryMethods] = useState(["app"]);
  const [emailAddress, setEmailAddress] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [summaryStyle, setSummaryStyle] = useState("bullets");
  const [previewing, setPreviewing] = useState(false);
  const [previewText, setPreviewText] = useState(null);
  const [previewError, setPreviewError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);

  // Playlist state
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [playlistDesc, setPlaylistDesc] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  // ── Auth listener ────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  // ── Load user config from DB ─────────────────────────────────────────────────
  const loadConfig = useCallback(async (userId) => {
    setDbLoading(true);
    const { data } = await supabase
      .from("digest_configs")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (data) {
      if (data.links) setLinks(data.links);
      if (data.schedule) setSchedule(data.schedule);
      if (data.delivery_time) setDeliveryTime(data.delivery_time);
      if (data.delivery_methods) setDeliveryMethods(data.delivery_methods);
      if (data.email_address) setEmailAddress(data.email_address);
      if (data.whatsapp_number) setWhatsappNumber(data.whatsapp_number);
      if (data.summary_style) setSummaryStyle(data.summary_style);
      if (data.auto_update !== undefined) setAutoUpdate(data.auto_update);
    }
    setDbLoading(false);
  }, []);

  useEffect(() => {
    if (session?.user?.id) loadConfig(session.user.id);
  }, [session, loadConfig]);

  // ── Save config to DB ────────────────────────────────────────────────────────
  const syncToDb = useCallback(async (patch) => {
    if (!session?.user?.id) return;
    setSyncing(true);
    await supabase.from("digest_configs").upsert({
      user_id: session.user.id,
      updated_at: new Date().toISOString(),
      ...patch
    }, { onConflict: "user_id" });
    setSyncing(false);
  }, [session]);

  // ── Check for shared playlist in URL ────────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get("playlist");
    if (data) {
      const decoded = decodePlaylist(data);
      if (decoded) { setSharedPlaylist(decoded); setActiveTab("shared"); }
    }
  }, []);

  // ── Auth guard ───────────────────────────────────────────────────────────────
  if (session === undefined) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap'); body{background:#111118;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;} p{color:#9090a8;font-family:monospace;font-size:13px;}`}</style>
        <p>Loading…</p>
      </>
    );
  }
  if (!session) return <LoginScreen />;

  // ── Actions ──────────────────────────────────────────────────────────────────
  const toggleDelivery = (id) => {
    const next = deliveryMethods.includes(id)
      ? (deliveryMethods.length > 1 ? deliveryMethods.filter(m => m !== id) : deliveryMethods)
      : [...deliveryMethods, id];
    setDeliveryMethods(next);
    syncToDb({ delivery_methods: next });
  };

  const addSingleLink = () => {
    const trimmed = inputUrl.trim();
    if (!trimmed) return;
    const next = [...links, { id: Date.now(), url: trimmed, type: detectType(trimmed) }];
    setLinks(next); setInputUrl(""); setPreviewText(null); setPreviewError(null);
    syncToDb({ links: next });
  };

  const addSubscription = (sub) => {
    const next = [...links, sub];
    setLinks(next); setPreviewText(null); setPreviewError(null);
    syncToDb({ links: next });
  };

  const removeLink = (id) => {
    const next = links.filter(l => l.id !== id);
    setLinks(next); setPreviewText(null);
    syncToDb({ links: next });
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") addSingleLink(); };

  const generatePreview = async () => {
    if (links.length === 0) return;
    setPreviewing(true); setPreviewText(null); setPreviewError(null);
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ links, style: summaryStyle, schedule, deliveryTime, deliveryMethods })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate summary');
      setPreviewText(data.summary);
    } catch (err) {
      setPreviewError(err.message);
    } finally {
      setPreviewing(false);
    }
  };

  const saveConfig = () => {
    syncToDb({ links, schedule, delivery_time: deliveryTime, delivery_methods: deliveryMethods, email_address: emailAddress, whatsapp_number: whatsappNumber, summary_style: summaryStyle, auto_update: autoUpdate });
    setSaved(true); setTimeout(() => setSaved(false), 3500);
  };

  const generateShareLink = () => {
    if (links.length === 0 || !playlistTitle.trim()) return;
    const playlist = { title: playlistTitle, description: playlistDesc, links, createdAt: new Date().toISOString() };
    const encoded = encodePlaylist(playlist);
    setShareUrl(`${window.location.origin}${window.location.pathname}?playlist=${encoded}`);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const hasSubscriptions = links.some(l => l.isSub);
  const needsEmail = deliveryMethods.includes("email");
  const needsWhatsapp = deliveryMethods.includes("whatsapp");
  const deliveryIncomplete = (needsEmail && !emailAddress.trim()) || (needsWhatsapp && !whatsappNumber.trim());
  const missingFields = [needsEmail && !emailAddress.trim() ? "email address" : null, needsWhatsapp && !whatsappNumber.trim() ? "WhatsApp number" : null].filter(Boolean).join(" and ");

  if (activeTab === "shared" && sharedPlaylist) {
    return (
      <>
        <style>{styles}</style>
        <div className="app">
          <div className="header">
            <div className="header-tag">Content Intelligence Tool</div>
            <h1>Your <span>Digest</span><br />on your terms.</h1>
          </div>
          <SharedPlaylistView playlist={sharedPlaylist} onBack={() => { setActiveTab("digest"); setSharedPlaylist(null); window.history.replaceState({}, '', window.location.pathname); }} />
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <style>{authStyles}</style>
      <div className="app">
        <div className="header">
          <div className="header-tag">Content Intelligence Tool</div>
          <h1>Your <span>Digest</span><br />on your terms.</h1>
        </div>

        {/* User bar */}
        <div className="user-bar">
          <div className="user-email">Signed in as <span>{session.user.email}</span></div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            {syncing && <div className="sync-indicator"><div className="sync-dot"/>Syncing…</div>}
            <button className="btn-signout" onClick={() => supabase.auth.signOut()}>Sign out</button>
          </div>
        </div>

        {dbLoading ? (
          <div style={{textAlign:"center",padding:"40px 0",color:"#9090a8",fontSize:13}}>Loading your config…</div>
        ) : (
          <>
            <div className="tab-row">
              <button className={`tab${activeTab === "digest" ? " active" : ""}`} onClick={() => setActiveTab("digest")}>📋 My Digest</button>
              <button className={`tab${activeTab === "playlist" ? " active" : ""}`} onClick={() => setActiveTab("playlist")}>🎵 Share Playlist</button>
            </div>

            {/* ── DIGEST TAB ── */}
            {activeTab === "digest" && (
              <>
                <div className="section">
                  <div className="section-label">01 — Add Content</div>
                  <div className="add-mode-toggle">
                    <button className={`mode-btn${addMode === "single" ? " active" : ""}`} onClick={() => setAddMode("single")}>🔗 Single Link</button>
                    <button className={`mode-btn${addMode === "subscribe" ? " active" : ""}`} onClick={() => setAddMode("subscribe")}>📡 Subscribe to Channel / Feed</button>
                  </div>

                  {addMode === "single" && (
                    <div className="input-row">
                      <input className="url-input" value={inputUrl} onChange={e => setInputUrl(e.target.value)} onKeyDown={handleKeyDown} placeholder="Paste YouTube video or Podcast episode URL…" />
                      <button className="btn-add" onClick={addSingleLink}>+ Add</button>
                    </div>
                  )}
                  {addMode === "subscribe" && <SubscribeInput onAdd={addSubscription} />}

                  {links.length === 0
                    ? <div className="empty-state" style={{ marginTop: 12 }}>No content yet — add a link or subscribe to a channel above</div>
                    : (
                      <>
                        <div className="link-list">
                          {links.map(l => (
                            <div className={`link-item${l.isSub ? " is-sub" : ""}`} key={l.id}>
                              <span className="link-icon">{typeIcon(l.type, l.isSub)}</span>
                              <div className="link-info">
                                <div className="link-url">{l.channelName || shortUrl(l.url)}</div>
                                {l.isSub
                                  ? <div className="link-meta">From {l.fromDate} onwards<span className="link-badge">AUTO</span></div>
                                  : <div className="link-meta">{shortUrl(l.url)}</div>
                                }
                              </div>
                              <button className="btn-remove" onClick={() => removeLink(l.id)}>✕</button>
                            </div>
                          ))}
                        </div>
                        {hasSubscriptions && (
                          <div className="auto-row">
                            <label className="toggle">
                              <input type="checkbox" checked={autoUpdate} onChange={e => { setAutoUpdate(e.target.checked); syncToDb({ auto_update: e.target.checked }); }} />
                              <span className="toggle-slider"></span>
                            </label>
                            <div className="auto-label"><strong>Auto-update</strong> — new content from subscribed channels is added automatically each digest cycle</div>
                            <button className="btn-refresh">↻ Refresh</button>
                          </div>
                        )}
                      </>
                    )
                  }
                </div>

                <div className="section">
                  <div className="section-label">02 — Delivery Schedule</div>
                  <div className="option-grid">
                    {SCHEDULES.map(s => (
                      <div key={s.id} className={`option-card${schedule === s.id ? " selected" : ""}`} onClick={() => { setSchedule(s.id); syncToDb({ schedule: s.id }); }}>
                        <div className="opt-icon">{s.icon}</div>
                        <div className="opt-label">{s.label}</div>
                        <div className="opt-sub">{s.sub}</div>
                      </div>
                    ))}
                  </div>
                  <div className="time-row">
                    <span className="time-label">Deliver at</span>
                    <select className="time-select" value={deliveryTime} onChange={e => { setDeliveryTime(e.target.value); syncToDb({ delivery_time: e.target.value }); }}>
                      {HOURS.map(h => <option key={h.value} value={h.value}>{h.label}</option>)}
                    </select>
                    <span className="time-label">your local time</span>
                  </div>
                </div>

                <div className="section">
                  <div className="section-label">03 — Where to Receive It</div>
                  <div className="delivery-grid">
                    {DELIVERY_METHODS.map(m => (
                      <div key={m.id} className={`delivery-card${deliveryMethods.includes(m.id) ? " selected" : ""}`} onClick={() => toggleDelivery(m.id)}>
                        <span className="d-icon">{m.icon}</span>
                        <div className="d-info"><div className="d-name">{m.name}</div><div className="d-sub">{m.sub}</div></div>
                        <div className="d-check">{deliveryMethods.includes(m.id) ? "✓" : ""}</div>
                      </div>
                    ))}
                  </div>
                  {(needsEmail || needsWhatsapp) && (
                    <div className="delivery-inputs-row">
                      {needsEmail && <div className="delivery-input-block"><div className="delivery-input-label">✉️ Email address</div><input className="delivery-input-field" type="email" placeholder="you@example.com" value={emailAddress} onChange={e => setEmailAddress(e.target.value)} onBlur={() => syncToDb({ email_address: emailAddress })} /></div>}
                      {needsWhatsapp && <div className="delivery-input-block"><div className="delivery-input-label">💬 WhatsApp number (incl. country code)</div><input className="delivery-input-field" type="tel" placeholder="+49 176 12345678" value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} onBlur={() => syncToDb({ whatsapp_number: whatsappNumber })} /></div>}
                    </div>
                  )}
                  {deliveryIncomplete && <div className="warning-note">⚠ Please fill in your {missingFields} to save.</div>}
                </div>

                <div className="section">
                  <div className="section-label">04 — Summary Style</div>
                  <div className="style-grid">
                    {STYLES.map(s => (
                      <div key={s.id} className={`style-card${summaryStyle === s.id ? " selected" : ""}`} onClick={() => { setSummaryStyle(s.id); setPreviewText(null); syncToDb({ summary_style: s.id }); }}>
                        <div className="s-icon">{s.icon}</div><div className="s-name">{s.name}</div><div className="s-desc">{s.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {links.length > 0 && (
                  <div className="section">
                    <div className="section-label">05 — Preview Digest</div>
                    <div className="preview-box">
                      {!previewText && !previewing && !previewError && <div style={{ color: "#9090a8", fontSize: 13, textAlign: "center", padding: "12px 0" }}>Click "Preview" to generate a real AI summary</div>}
                      {previewing && <div className="preview-loading"><div className="spinner" />AI is summarizing your {links.length} item{links.length > 1 ? 's' : ''}…</div>}
                      {previewError && <div className="error-box">⚠ {previewError}</div>}
                      {previewText && !previewing && (
                        <>
                          <div className="preview-meta">AI summary · {STYLES.find(s => s.id === summaryStyle)?.name}</div>
                          <div className="preview-content">{renderContent(previewText)}</div>
                          <div className="preview-delivery-row">
                            <span style={{ fontSize: 11, color: "#9090a8", marginRight: 4 }}>DELIVERED VIA</span>
                            {deliveryMethods.map(id => { const m = DELIVERY_METHODS.find(d => d.id === id); return <span key={id} className="preview-badge">{m.icon} {m.name}</span>; })}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                <div className="section">
                  <div className="cta-row">
                    <button className="btn-primary" onClick={saveConfig} disabled={deliveryIncomplete}>Save Config</button>
                    {links.length > 0 && <button className="btn-secondary" onClick={generatePreview} disabled={previewing}>{previewing ? "Generating…" : "Preview Digest"}</button>}
                  </div>
                  {saved && <div style={{ marginTop: 14 }}><div className="status-pill"><div className="dot" />Saved & synced · {SCHEDULES.find(s => s.id === schedule)?.label} at {deliveryTime} · {deliveryMethods.map(id => DELIVERY_METHODS.find(d => d.id === id)?.name).join(" + ")} · {STYLES.find(s => s.id === summaryStyle)?.name}</div></div>}
                </div>
              </>
            )}

            {/* ── PLAYLIST TAB ── */}
            {activeTab === "playlist" && (
              <>
                <div className="section">
                  <div className="section-label">Playlist Details</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <input className="text-input" placeholder="Playlist title e.g. 'AI & Support Weekly'" value={playlistTitle} onChange={e => { setPlaylistTitle(e.target.value); setShareUrl(""); }} />
                    <textarea className="text-input" placeholder="Short description (optional)" value={playlistDesc} onChange={e => { setPlaylistDesc(e.target.value); setShareUrl(""); }} />
                  </div>
                </div>

                <div className="section">
                  <div className="section-label">Links in this Playlist</div>
                  {links.length === 0
                    ? <div className="empty-state">No links yet — add them in the My Digest tab first</div>
                    : <div className="link-list">{links.map(l => (
                        <div className={`link-item${l.isSub ? " is-sub" : ""}`} key={l.id}>
                          <span className="link-icon">{typeIcon(l.type, l.isSub)}</span>
                          <div className="link-info">
                            <div className="link-url">{l.channelName || shortUrl(l.url)}</div>
                            {l.isSub && <div className="link-meta">From {l.fromDate}<span className="link-badge">AUTO</span></div>}
                          </div>
                        </div>
                      ))}</div>
                  }
                  <div className="input-row" style={{ marginTop: 10 }}>
                    <input className="url-input" value={inputUrl} onChange={e => setInputUrl(e.target.value)} onKeyDown={handleKeyDown} placeholder="Add more links…" />
                    <button className="btn-add" onClick={addSingleLink}>+ Add</button>
                  </div>
                </div>

                <div className="section">
                  <div className="cta-row" style={{ marginBottom: 20 }}>
                    <button className="btn-primary" onClick={generateShareLink} disabled={links.length === 0 || !playlistTitle.trim()}>🔗 Generate Share Link</button>
                  </div>
                  {shareUrl && (
                    <div className="share-box">
                      <div className="share-title">🎵 {playlistTitle}</div>
                      {playlistDesc && <div className="share-desc">{playlistDesc}</div>}
                      <div className="section-label" style={{ marginTop: 16 }}>Share Link</div>
                      <div className="share-link-row">
                        <input className="share-link-input" readOnly value={shareUrl} />
                        <button className={`btn-copy${copied ? " copied" : ""}`} onClick={copyLink}>{copied ? "✓ Copied!" : "Copy"}</button>
                      </div>
                      <div className="section-label" style={{ marginTop: 20 }}>QR Code</div>
                      <div className="qr-box"><QRCode url={shareUrl} /></div>
                      <div style={{ marginTop: 16, fontSize: 11, color: "#9090a8", lineHeight: 1.6 }}>Anyone with this link can view your playlist, add their own links, and generate their own AI summary.</div>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
