  import { useState, useEffect } from "react";

  // ─── GAS DATABASE (from project SDS + PPT) ─────────────────────────────────
  const GAS_DB = [
    {
      id: "lpg",
      name: "LPG",
      formula: "C₃H₈ / C₄H₁₀",
      icon: "🔥",
      color: "#f59e0b",
      sensor: "MQ-2 / MQ-6",
      threshold: 500,
      dangerLevel: "high",
      sources: ["Cooking gas cylinders", "Industrial solvents", "Petroleum refining"],
      health: "Flammable – explosion risk at 1.8–9.5% concentration. Causes asphyxiation in enclosed areas.",
      prevention: ["Ensure kitchen ventilation", "Check cylinder connections regularly", "Install gas leak detector", "Never use open flames near suspected leak"],
      firstAid: "Evacuate the area immediately. Ventilate the room. Do not ignite anything. Call emergency services."
    },
    {
      id: "methane",
      name: "Methane",
      formula: "CH₄",
      icon: "💨",
      color: "#3b82f6",
      sensor: "MQ-4",
      threshold: 300,
      dangerLevel: "high",
      sources: ["Natural gas pipelines", "Decomposing organic waste", "Coal mines", "Marshes / wetlands"],
      health: "Highly flammable and explosive (5–15% in air). Asphyxiant – displaces oxygen.",
      prevention: ["Regular pipeline inspections", "Seal all gas fittings tightly", "Use gas shutoff valves", "Monitor with continuous sensors"],
      firstAid: "Move to fresh air immediately. Ventilate the area. Do not create sparks. Call emergency services if symptoms occur."
    },
    {
      id: "co",
      name: "Carbon Monoxide",
      formula: "CO",
      icon: "☠️",
      color: "#ef4444",
      sensor: "MQ-7 / MQ-9",
      threshold: 50,
      dangerLevel: "critical",
      sources: ["Incomplete combustion of fuels", "Car exhaust", "Malfunctioning heaters", "Wood-burning stoves"],
      health: "Odorless & invisible. Binds to hemoglobin 200× stronger than O₂. Causes headache, nausea, unconsciousness, and death.",
      prevention: ["Install CO detectors in every room", "Ensure appliances are properly maintained", "Never run engines indoors", "Ventilate during heating season"],
      firstAid: "Move victim to fresh air immediately. If unconscious, place in recovery position. Call emergency services — oxygen therapy is required."
    },
    {
      id: "vocs",
      name: "VOCs",
      formula: "Various",
      icon: "🌫️",
      color: "#8b5cf6",
      sensor: "MQ-135",
      threshold: 200,
      dangerLevel: "medium",
      sources: ["Paints & coatings", "Cleaning solvents", "Adhesives", "Cigarette smoke", "Car exhaust"],
      health: "Long-term exposure linked to cancer, liver & kidney damage. Short-term: headaches, dizziness, nausea.",
      prevention: ["Use low-VOC products", "Ventilate painted/cleaned areas", "Store chemicals in sealed containers", "Use air purifiers indoors"],
      firstAid: "Move to well-ventilated area. If skin contact, wash with soap and water. Seek medical attention if symptoms persist."
    },
    {
      id: "ammonia",
      name: "Ammonia",
      formula: "NH₃",
      icon: "⚠️",
      color: "#f97316",
      sensor: "MQ-135",
      threshold: 25,
      dangerLevel: "high",
      sources: ["Household cleaning products", "Industrial refrigerants", "Agricultural fertilizers", "Mixing bleach with other cleaners"],
      health: "Pungent odor. Irritates eyes, skin, and respiratory tract. High concentrations cause chemical burns and pulmonary edema.",
      prevention: ["Never mix ammonia with bleach", "Use in well-ventilated areas", "Store away from acids", "Wear gloves and eye protection"],
      firstAid: "Move to fresh air. Flush eyes/skin with water for 15+ min. Seek medical attention if breathing difficulty."
    },
    {
      id: "smoke",
      name: "Smoke / Particulates",
      formula: "Mixed",
      icon: "💥",
      color: "#6b7280",
      sensor: "MQ-2",
      threshold: 100,
      dangerLevel: "high",
      sources: ["Fires", "Cooking", "Cigarettes", "Industrial emissions"],
      health: "Fine particulates damage lungs and cardiovascular system. Smoke from fires contains toxic CO and other chemicals.",
      prevention: ["Install smoke detectors", "Never leave cooking unattended", "Keep fire extinguisher accessible", "Maintain clear evacuation routes"],
      firstAid: "Evacuate immediately. Cover nose/mouth with cloth. Move to fresh air. Call emergency services."
    },
    {
      id: "co2",
      name: "Carbon Dioxide",
      formula: "CO₂",
      icon: "🌬️",
      color: "#10b981",
      sensor: "MH-Z19B (NDIR)",
      threshold: 1000,
      dangerLevel: "low",
      sources: ["Human respiration", "Combustion processes", "Fermentation", "Volcanic emissions"],
      health: "High concentrations cause headaches, confusion, rapid breathing. Very high levels (>5%) cause loss of consciousness.",
      prevention: ["Ensure room ventilation", "Limit occupancy in sealed spaces", "Monitor CO₂ levels in enclosed areas"],
      firstAid: "Move to fresh air. If dizzy, rest. Seek medical help if symptoms persist."
    },
    {
      id: "hydrogen_sulfide",
      name: "Hydrogen Sulfide",
      formula: "H₂S",
      icon: "💀",
      color: "#dc2626",
      sensor: "Electrochemical",
      threshold: 10,
      dangerLevel: "critical",
      sources: ["Sewage systems", "Oil & gas wells", "Rotten eggs / decaying matter", "Industrial wastewater"],
      health: "Toxic – smells like rotten eggs at low ppm but odor fades at high levels. Causes headache, nausea, and can be fatal.",
      prevention: ["Never enter sewers without ventilation", "Monitor in industrial settings", "Use respiratory protection", "Ensure proper drainage systems"],
      firstAid: "Move to fresh air immediately. If unconscious, do not enter – call emergency services. Oxygen therapy required."
    }
  ];

  // ─── SIMULATED DEVICE LIST ──────────────────────────────────────────────────
  const INITIAL_DEVICES = [
    { id: "dev1", name: "Kitchen Sensor", location: "Kitchen", connected: true, batteryLevel: 87, lastSeen: "Just now", signal: 4 },
    { id: "dev2", name: "Bedroom Sensor", location: "Bedroom", connected: true, batteryLevel: 62, lastSeen: "2 min ago", signal: 3 },
    { id: "dev3", name: "Hall Sensor", location: "Hall", connected: false, batteryLevel: 14, lastSeen: "1 hr ago", signal: 1 },
    { id: "dev4", name: "Garage Sensor", location: "Garage", connected: true, batteryLevel: 95, lastSeen: "Just now", signal: 4 }
  ];

  // ─── UTILITY ─────────────────────────────────────────────────────────────────
  function lerp(a, b, t) { return a + (b - a) * t; }

  // ─── SUB-COMPONENTS ─────────────────────────────────────────────────────────

  function StatusBadge({ level }) {
    const map = { safe: ["#22c55e", "Safe"], medium: ["#f59e0b", "Caution"], high: ["#f97316", "Warning"], critical: ["#ef4444", "Critical"] };
    const [color, label] = map[level] || map.safe;
    return (
      <span style={{ background: color + "22", color, border: `1px solid ${color}55`, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>{label}</span>
    );
  }

  function SignalDots({ count }) {
    return (
      <div style={{ display: "flex", gap: 3, alignItems: "flex-end" }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ width: 5, height: 5 + i * 3, borderRadius: 2, background: i <= count ? "#3b82f6" : "#33333366" }} />
        ))}
      </div>
    );
  }

  function BatteryIcon({ level }) {
    const color = level > 50 ? "#22c55e" : level > 20 ? "#f59e0b" : "#ef4444";
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <div style={{ width: 22, height: 11, border: `1.5px solid ${color}`, borderRadius: 3, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 1, top: 1, bottom: 1, width: `${level}%`, background: color, borderRadius: 1.5 }} />
        </div>
        <div style={{ width: 3, height: 6, background: color, borderRadius: "0 2px 2px 0" }} />
        <span style={{ fontSize: 10, color, fontWeight: 600 }}>{level}%</span>
      </div>
    );
  }

  // ─── NOTIFICATION TOAST ─────────────────────────────────────────────────────
  function NotificationToast({ notifications, onDismiss }) {
    return (
      <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 999, display: "flex", flexDirection: "column", gap: 8, width: "90%", maxWidth: 380, pointerEvents: "none" }}>
        {notifications.map(n => {
          const gas = GAS_DB.find(g => g.id === n.gasId);
          const bg = n.severity === "critical" ? "#ef4444" : n.severity === "high" ? "#f97316" : "#f59e0b";
          return (
            <div key={n.id} style={{ background: bg, color: "#fff", borderRadius: 14, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", boxShadow: "0 4px 24px #00000044", pointerEvents: "auto", animation: "slideDown 0.35s cubic-bezier(.22,.61,0,1) both" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>{gas?.icon} {gas?.name} Detected!</div>
                <div style={{ fontSize: 11, opacity: 0.9, marginTop: 2 }}>{n.device} — {n.message}</div>
              </div>
              <button onClick={() => onDismiss(n.id)} style={{ background: "rgba(255,255,255,0.22)", border: "none", color: "#fff", borderRadius: 8, width: 22, height: 22, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            </div>
          );
        })}
      </div>
    );
  }

  // ─── DASHBOARD TAB ──────────────────────────────────────────────────────────
  function DashboardTab({ devices, notifications }) {
    const [readings, setReadings] = useState(() =>
      GAS_DB.map(g => ({ ...g, current: Math.random() * g.threshold * 0.6 + 10, history: Array.from({ length: 30 }, () => Math.random() * g.threshold * 0.5 + 5) }))
    );
    const [activeGas, setActiveGas] = useState(null);

    useEffect(() => {
      const iv = setInterval(() => {
        setReadings(prev => prev.map(r => {
          const delta = (Math.random() - 0.48) * (r.threshold * 0.08);
          const next = Math.max(2, Math.min(r.threshold * 1.3, r.current + delta));
          return { ...r, current: next, history: [...r.history.slice(1), next] };
        }));
      }, 1800);
      return () => clearInterval(iv);
    }, []);

    const connectedCount = devices.filter(d => d.connected).length;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Status cards row */}
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { label: "Devices", val: `${connectedCount}/${devices.length}`, icon: "📡", color: "#3b82f6" },
            { label: "Alerts", val: notifications.length, icon: "🔔", color: notifications.length ? "#ef4444" : "#22c55e" },
            { label: "Status", val: notifications.length ? "Active" : "All Clear", icon: notifications.length ? "⚡" : "✅", color: notifications.length ? "#f97316" : "#22c55e" }
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, background: "#1e1e2ecc", border: "1px solid #313244", borderRadius: 14, padding: "10px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 18 }}>{s.icon}</div>
              <div style={{ color: s.color, fontWeight: 700, fontSize: 17, marginTop: 2 }}>{s.val}</div>
              <div style={{ color: "#a1a1aa", fontSize: 10, marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Live readings grid */}
        <div>
          <div style={{ color: "#a1a1aa", fontSize: 11, fontWeight: 600, letterSpacing: 1.2, marginBottom: 8, textTransform: "uppercase" }}>Live Gas Readings</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {readings.map((r, i) => {
              const pct = Math.min(100, (r.current / r.threshold) * 100);
              const status = pct > 90 ? "critical" : pct > 60 ? "high" : pct > 35 ? "medium" : "safe";
              const barColor = status === "critical" ? "#ef4444" : status === "high" ? "#f97316" : status === "medium" ? "#f59e0b" : "#22c55e";
              return (
                <div key={r.id} onClick={() => setActiveGas(activeGas === r.id ? null : r.id)}
                  style={{ background: "#1e1e2ecc", border: `1px solid ${activeGas === r.id ? r.color : "#313244"}`, borderRadius: 14, padding: 12, cursor: "pointer", transition: "all 0.2s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 14 }}>{r.icon}</span>
                    <StatusBadge level={status} />
                  </div>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, marginTop: 6 }}>{r.name}</div>
                  <div style={{ color: "#a1a1aa", fontSize: 10 }}>{r.formula}</div>
                  <div style={{ marginTop: 8, background: "#11111166", borderRadius: 6, height: 5, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: barColor, borderRadius: 6, transition: "width 0.8s ease" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                    <span style={{ color: barColor, fontWeight: 700, fontSize: 12 }}>{r.current.toFixed(1)} <span style={{ fontWeight: 400, color: "#a1a1aa" }}>ppm</span></span>
                    <span style={{ color: "#52525b", fontSize: 10 }}>/{r.threshold}</span>
                  </div>

                  {/* Mini sparkline */}
                  {activeGas === r.id && (
                    <div style={{ marginTop: 10, borderTop: "1px solid #313244", paddingTop: 8 }}>
                      <svg width="100%" height="40" viewBox="0 0 200 40" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id={`grad_${r.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={r.color} stopOpacity="0.4" />
                            <stop offset="100%" stopColor={r.color} stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {(() => {
                          const max = Math.max(...r.history, r.threshold);
                          const pts = r.history.map((v, idx) => `${(idx / (r.history.length - 1)) * 200},${40 - (v / max) * 36}`).join(" ");
                          const areaPts = `0,40 ${pts} 200,40`;
                          return (
                            <>
                              <polygon points={areaPts} fill={`url(#grad_${r.id})`} />
                              <polyline points={pts} fill="none" stroke={r.color} strokeWidth="2" strokeLinejoin="round" />
                            </>
                          );
                        })()}
                      </svg>
                      <div style={{ color: "#a1a1aa", fontSize: 9, textAlign: "center", marginTop: 2 }}>Last 30 readings</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ─── GAS INFO TAB ───────────────────────────────────────────────────────────
  function GasInfoTab() {
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState("");

    const filtered = GAS_DB.filter(g => g.name.toLowerCase().includes(search.toLowerCase()) || g.formula.toLowerCase().includes(search.toLowerCase()));
    const gas = GAS_DB.find(g => g.id === selected);

    if (gas) {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: 13, textAlign: "left", padding: 0, display: "flex", alignItems: "center", gap: 4 }}>← Back</button>
          <div style={{ background: "#1e1e2ecc", borderRadius: 18, padding: 18, border: `1px solid ${gas.color}44` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: gas.color + "22", border: `1px solid ${gas.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{gas.icon}</div>
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 20 }}>{gas.name}</div>
                <div style={{ color: "#a1a1aa", fontSize: 12 }}>{gas.formula} · Sensor: {gas.sensor}</div>
              </div>
              <div style={{ marginLeft: "auto" }}><StatusBadge level={gas.dangerLevel} /></div>
            </div>
          </div>

          {/* Health impact */}
          <div style={{ background: "#1e1e2ecc", borderRadius: 14, padding: 14, border: "1px solid #313244" }}>
            <div style={{ color: gas.color, fontWeight: 600, fontSize: 12, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>⚕️ Health Impact</div>
            <div style={{ color: "#d4d4d8", fontSize: 13, lineHeight: 1.5 }}>{gas.health}</div>
          </div>

          {/* Sources */}
          <div style={{ background: "#1e1e2ecc", borderRadius: 14, padding: 14, border: "1px solid #313244" }}>
            <div style={{ color: "#a1a1aa", fontWeight: 600, fontSize: 12, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>📍 Common Sources</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {gas.sources.map((s, i) => (
                <span key={i} style={{ background: "#11111166", color: "#d4d4d8", borderRadius: 20, padding: "4px 10px", fontSize: 11, border: "1px solid #313244" }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Prevention */}
          <div style={{ background: "#1e1e2ecc", borderRadius: 14, padding: 14, border: "1px solid #22c55e33" }}>
            <div style={{ color: "#22c55e", fontWeight: 600, fontSize: 12, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>🛡️ Prevention</div>
            {gas.prevention.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                <span style={{ color: "#22c55e", marginTop: 1 }}>✓</span>
                <span style={{ color: "#d4d4d8", fontSize: 13 }}>{p}</span>
              </div>
            ))}
          </div>

          {/* First Aid */}
          <div style={{ background: "#1e1e2ecc", borderRadius: 14, padding: 14, border: "1px solid #ef444433" }}>
            <div style={{ color: "#ef4444", fontWeight: 600, fontSize: 12, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>🚑 First Aid</div>
            <div style={{ color: "#d4d4d8", fontSize: 13, lineHeight: 1.5 }}>{gas.firstAid}</div>
          </div>
        </div>
      );
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search gases…"
          style={{ background: "#1e1e2ecc", border: "1px solid #313244", borderRadius: 12, padding: "10px 14px", color: "#fff", fontSize: 13, outline: "none" }} />
        <div style={{ color: "#a1a1aa", fontSize: 11, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase" }}>Gas Encyclopedia</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(g => (
            <div key={g.id} onClick={() => setSelected(g.id)}
              style={{ background: "#1e1e2ecc", border: "1px solid #313244", borderRadius: 14, padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = g.color}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#313244"}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: g.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{g.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{g.name} <span style={{ color: "#52525b", fontWeight: 400, fontSize: 11 }}>{g.formula}</span></div>
                <div style={{ color: "#a1a1aa", fontSize: 11, marginTop: 1 }}>Sensor: {g.sensor} · Threshold: {g.threshold} ppm</div>
              </div>
              <StatusBadge level={g.dangerLevel} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── DEVICES TAB ─────────────────────────────────────────────────────────────
  function DevicesTab({ devices, setDevices }) {
    const [adding, setAdding] = useState(false);
    const [newName, setNewName] = useState("");
    const [newLoc, setNewLoc] = useState("");

    const toggle = (id) => setDevices(prev => prev.map(d => d.id === id ? { ...d, connected: !d.connected, lastSeen: d.connected ? "Just disconnected" : "Just now", signal: d.connected ? 0 : 4 } : d));

    const addDevice = () => {
      if (!newName.trim() || !newLoc.trim()) return;
      setDevices(prev => [...prev, { id: "dev" + Date.now(), name: newName.trim(), location: newLoc.trim(), connected: true, batteryLevel: 100, lastSeen: "Just now", signal: 4 }]);
      setNewName(""); setNewLoc(""); setAdding(false);
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: "#a1a1aa", fontSize: 11, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase" }}>Connected Devices</div>
          <button onClick={() => setAdding(!adding)} style={{ background: "#3b82f6", border: "none", color: "#fff", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>+ Add</button>
        </div>

        {adding && (
          <div style={{ background: "#1e1e2ecc", border: "1px solid #3b82f6aa", borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Device name" style={{ background: "#11111166", border: "1px solid #313244", borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 13, outline: "none" }} />
            <input value={newLoc} onChange={e => setNewLoc(e.target.value)} placeholder="Location (e.g. Kitchen)" style={{ background: "#11111166", border: "1px solid #313244", borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 13, outline: "none" }} />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={addDevice} style={{ flex: 1, background: "#22c55e", border: "none", color: "#fff", borderRadius: 8, padding: "7px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Save</button>
              <button onClick={() => setAdding(false)} style={{ flex: 1, background: "#313244", border: "none", color: "#a1a1aa", borderRadius: 8, padding: "7px", fontSize: 13, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        )}

        {devices.map(d => (
          <div key={d.id} style={{ background: "#1e1e2ecc", border: `1px solid ${d.connected ? "#313244" : "#3f3f4666"}`, borderRadius: 14, padding: 14, display: "flex", alignItems: "center", gap: 12, opacity: d.connected ? 1 : 0.6, transition: "opacity 0.3s" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: d.connected ? "#3b82f622" : "#11111166", border: `1px solid ${d.connected ? "#3b82f6" : "#313244"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📡</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{d.name}</div>
              <div style={{ color: "#a1a1aa", fontSize: 11, marginTop: 1 }}>📍 {d.location} · {d.lastSeen}</div>
              <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                <BatteryIcon level={d.batteryLevel} />
                <SignalDots count={d.signal} />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 10, color: d.connected ? "#22c55e" : "#a1a1aa", fontWeight: 600 }}>{d.connected ? "ON" : "OFF"}</span>
              <div onClick={() => toggle(d.id)} style={{ width: 44, height: 24, borderRadius: 12, background: d.connected ? "#3b82f6" : "#313244", position: "relative", cursor: "pointer", transition: "background 0.3s" }}>
                <div style={{ position: "absolute", top: 3, left: d.connected ? 23 : 3, width: 18, height: 18, borderRadius: 9, background: "#fff", transition: "left 0.3s", boxShadow: "0 1px 3px #0004" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ─── SETTINGS TAB ───────────────────────────────────────────────────────────
  function SettingsTab({ theme, setTheme, profile, setProfile }) {
    const themes = [
      { id: "dark", name: "Dark", swatch: "#11111b" },
      { id: "midnight", name: "Midnight", swatch: "#0f1729" },
      { id: "forest", name: "Forest", swatch: "#0d1f0d" },
      { id: "ember", name: "Ember", swatch: "#1f0d0d" }
    ];
    const [editingProfile, setEditingProfile] = useState(false);
    const [draft, setDraft] = useState({ ...profile });

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Profile */}
        <div style={{ background: "#1e1e2ecc", border: "1px solid #313244", borderRadius: 18, padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: 18, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "#fff", fontWeight: 700 }}>{profile.name?.[0] || "U"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{profile.name}</div>
              <div style={{ color: "#a1a1aa", fontSize: 12 }}>{profile.location}</div>
            </div>
            <button onClick={() => setEditingProfile(!editingProfile)} style={{ background: "#313244", border: "none", color: "#a1a1aa", borderRadius: 8, padding: "5px 10px", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>{editingProfile ? "Cancel" : "Edit"}</button>
          </div>
          {editingProfile && (
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8, borderTop: "1px solid #313244", paddingTop: 12 }}>
              {["name", "email", "location"].map(field => (
                <div key={field}>
                  <div style={{ color: "#a1a1aa", fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 }}>{field}</div>
                  <input value={draft[field] || ""} onChange={e => setDraft(d => ({ ...d, [field]: e.target.value }))}
                    style={{ width: "100%", background: "#11111166", border: "1px solid #313244", borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                </div>
              ))}
              <button onClick={() => { setProfile(draft); setEditingProfile(false); }} style={{ background: "#3b82f6", border: "none", color: "#fff", borderRadius: 8, padding: "8px", fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 4 }}>Save Profile</button>
            </div>
          )}
        </div>

        {/* Theme */}
        <div style={{ background: "#1e1e2ecc", border: "1px solid #313244", borderRadius: 14, padding: 14 }}>
          <div style={{ color: "#a1a1aa", fontSize: 11, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>🎨 App Theme</div>
          <div style={{ display: "flex", gap: 8 }}>
            {themes.map(t => (
              <div key={t.id} onClick={() => setTheme(t.id)}
                style={{ flex: 1, textAlign: "center", cursor: "pointer" }}>
                <div style={{ width: "100%", aspectRatio: "1", borderRadius: 12, background: t.swatch, border: theme === t.id ? "2px solid #3b82f6" : "2px solid #313244", transition: "border 0.2s" }} />
                <div style={{ color: theme === t.id ? "#3b82f6" : "#a1a1aa", fontSize: 10, marginTop: 4, fontWeight: theme === t.id ? 600 : 400 }}>{t.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Toggles */}
        {[
          { label: "Push Notifications", desc: "Get instant alerts on gas detection", icon: "🔔" },
          { label: "Sound Alerts", desc: "Play alarm on detection", icon: "🔊" },
          { label: "Vibration", desc: "Haptic feedback on alerts", icon: "📳" },
          { label: "Auto-reconnect", desc: "Auto reconnect to devices", icon: "🔄" }
        ].map((s, i) => (
          <SettingToggle key={i} {...s} />
        ))}

        {/* Exit */}
        <button style={{ background: "#ef444422", border: "1px solid #ef444444", color: "#ef4444", borderRadius: 14, padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 4 }}>
          🚪 Exit App
        </button>
      </div>
    );
  }

  function SettingToggle({ label, desc, icon }) {
    const [on, setOn] = useState(true);
    return (
      <div style={{ background: "#1e1e2ecc", border: "1px solid #313244", borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{label}</div>
          <div style={{ color: "#52525b", fontSize: 11, marginTop: 1 }}>{desc}</div>
        </div>
        <div onClick={() => setOn(!on)} style={{ width: 44, height: 24, borderRadius: 12, background: on ? "#3b82f6" : "#313244", position: "relative", cursor: "pointer", transition: "background 0.3s" }}>
          <div style={{ position: "absolute", top: 3, left: on ? 23 : 3, width: 18, height: 18, borderRadius: 9, background: "#fff", transition: "left 0.3s", boxShadow: "0 1px 3px #0004" }} />
        </div>
      </div>
    );
  }

  // ─── MAIN APP ────────────────────────────────────────────────────────────────
  export default function App() {
    const [tab, setTab] = useState("dashboard");
    const [devices, setDevices] = useState(INITIAL_DEVICES);
    const [theme, setTheme] = useState("dark");
    const [profile, setProfile] = useState({ name: "User", email: "user@email.com", location: "Home" });
    const [notifications, setNotifications] = useState([]);

    // Simulate random gas detections for demo
    useEffect(() => {
      const interval = setInterval(() => {
        if (Math.random() < 0.18) {
          const gas = GAS_DB[Math.floor(Math.random() * GAS_DB.length)];
          const device = devices.filter(d => d.connected)[Math.floor(Math.random() * devices.filter(d => d.connected).length)];
          if (!device) return;
          const sev = gas.dangerLevel === "critical" ? "critical" : gas.dangerLevel === "high" ? "high" : "medium";
          const n = {
            id: Date.now(),
            gasId: gas.id,
            device: device.name,
            severity: sev,
            message: `Concentration rising — ${(Math.random() * gas.threshold * 0.6 + gas.threshold * 0.5).toFixed(0)} ppm`
          };
          setNotifications(prev => [...prev.slice(-3), n]);
          setTimeout(() => setNotifications(prev => prev.filter(x => x.id !== n.id)), 7000);
        }
      }, 4000);
      return () => clearInterval(interval);
    }, [devices]);

    // Theme colors
    const themeBg = { dark: "#11111b", midnight: "#0f1729", forest: "#0d1f0d", ember: "#1f0d0d" };
    const bg = themeBg[theme] || themeBg.dark;

    const tabs = [
      { id: "dashboard", label: "Dashboard", icon: "📊" },
      { id: "gases", label: "Gases", icon: "🧪" },
      { id: "devices", label: "Devices", icon: "📡" },
      { id: "settings", label: "Settings", icon: "⚙️" }
    ];

    return (
      <>
        <style>{`
          @keyframes slideDown { from { opacity:0; transform:translateY(-18px); } to { opacity:1; transform:translateY(0); } }
          * { box-sizing: border-box; margin:0; padding:0; }
          body { background: ${bg}; }
          input::placeholder { color:#52525b; }
          input:focus { border-color: #3b82f6 !important; }
          ::-webkit-scrollbar { width:4px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background:#313244; border-radius:2px; }
        `}</style>

        <NotificationToast notifications={notifications} onDismiss={id => setNotifications(prev => prev.filter(n => n.id !== id))} />

        <div style={{ minHeight: "100vh", background: bg, color: "#fff", fontFamily: "'SF Pro Display', 'Segoe UI', system-ui, sans-serif", maxWidth: 420, margin: "0 auto", position: "relative", display: "flex", flexDirection: "column" }}>

          {/* Header */}
          <div style={{ padding: "20px 20px 10px", background: bg, position: "sticky", top: 0, zIndex: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>
                  <span style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Gas</span>Guard
                </div>
                <div style={{ color: "#52525b", fontSize: 11, marginTop: 1 }}>Smart Leak Detection System</div>
              </div>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: "#1e1e2ecc", border: "1px solid #313244", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, position: "relative", cursor: "pointer" }}>
                🔔
                {notifications.length > 0 && (
                  <div style={{ position: "absolute", top: 4, right: 4, width: 8, height: 8, borderRadius: "50%", background: "#ef4444", border: `2px solid ${bg}` }} />
                )}
              </div>
            </div>
          </div>

          {/* Tab pills */}
          <div style={{ padding: "8px 20px", display: "flex", gap: 6 }}>
            {tabs.map(t => (
              <div key={t.id} onClick={() => setTab(t.id)}
                style={{ flex: 1, textAlign: "center", padding: "7px 4px", borderRadius: 10, background: tab === t.id ? "#3b82f6" : "transparent", cursor: "pointer", transition: "background 0.25s" }}>
                <div style={{ fontSize: 14 }}>{t.icon}</div>
                <div style={{ fontSize: 9.5, color: tab === t.id ? "#fff" : "#52525b", fontWeight: tab === t.id ? 600 : 400, marginTop: 1 }}>{t.label}</div>
              </div>
            ))}
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "4px 20px 100px" }}>
            {tab === "dashboard" && <DashboardTab devices={devices} notifications={notifications} />}
            {tab === "gases" && <GasInfoTab />}
            {tab === "devices" && <DevicesTab devices={devices} setDevices={setDevices} />}
            {tab === "settings" && <SettingsTab theme={theme} setTheme={setTheme} profile={profile} setProfile={setProfile} />}
          </div>
        </div>
      </>
    );
  }
