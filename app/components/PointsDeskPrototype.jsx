"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Plane, Wallet, Radio, ArrowRightLeft, Search, ChevronDown, Sparkles, TrendingUp, Clock } from "lucide-react";

/* ---------------------------------------------------------------
   POINTS DESK — prototype
   Design tokens:
   ink        #0B0F17  (base background)
   panel      #121826  (card / panel surface)
   panel-2    #1A2233  (raised surface)
   brass      #C9A24B  (primary accent — metal card / miles)
   brass-dim  #8E7530
   parchment  #EDE6D6  (primary text on dark)
   slate      #8A93A6  (secondary text)
   good       #4FB8A6  (best value / positive)
   scarce     #E2574C  (limited / urgency)
   Display type: 'Space Grotesk' (headline, geometric, technical)
   Body type:    'Inter'
   Data/mono:    'IBM Plex Mono' (balances, flight times, prices — ticker character)
   Signature: split-flap "departure board" flip character component used in
   hero + price reveals, tying the aviation identity through the whole product.
------------------------------------------------------------------*/

const FONT_IMPORT_ID = "points-desk-fonts";

function useFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_IMPORT_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_IMPORT_ID;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

/* ---------------- Split-flap character ---------------- */
const FLAP_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789      ";

function FlipChar({ target, delay = 0, size = "1em" }) {
  const [display, setDisplay] = useState(" ");
  const settled = useRef(false);

  useEffect(() => {
    settled.current = false;
    let cancelled = false;
    const startTimeout = setTimeout(() => {
      let i = 0;
      const steps = 8 + Math.floor(Math.random() * 6);
      const interval = setInterval(() => {
        if (cancelled) return;
        i++;
        if (i >= steps) {
          setDisplay(target);
          settled.current = true;
          clearInterval(interval);
        } else {
          setDisplay(FLAP_CHARS[Math.floor(Math.random() * FLAP_CHARS.length)]);
        }
      }, 45);
      return () => clearInterval(interval);
    }, delay);
    return () => {
      cancelled = true;
      clearTimeout(startTimeout);
    };
  }, [target, delay]);

  return (
    <span
      className="flap-char"
      style={{
        display: "inline-block",
        width: "0.72em",
        fontSize: size,
        textAlign: "center",
      }}
    >
      {display}
    </span>
  );
}

function FlipWord({ word, baseDelay = 0, stagger = 60, size }) {
  return (
    <span style={{ display: "inline-flex" }}>
      {word.split("").map((ch, idx) => (
        <FlipChar key={idx} target={ch} delay={baseDelay + idx * stagger} size={size} />
      ))}
    </span>
  );
}

/* ---------------- Mock data ---------------- */

const AIRPORTS = [
  { code: "DEL", city: "Delhi" },
  { code: "BOM", city: "Mumbai" },
  { code: "BLR", city: "Bengaluru" },
  { code: "LHR", city: "London" },
  { code: "SIN", city: "Singapore" },
  { code: "DXB", city: "Dubai" },
  { code: "CDG", city: "Paris" },
  { code: "FCO", city: "Rome" },
  { code: "JFK", city: "New York" },
  { code: "BKK", city: "Bangkok" },
  { code: "NRT", city: "Tokyo" },
  { code: "SYD", city: "Sydney" },
];

const WALLET = [
  { name: "HDFC Infinia", group: "Bank currency", balance: 184500, unit: "RP", tone: "brass" },
  { name: "Axis Magnus", group: "Bank currency", balance: 42200, unit: "EDGE", tone: "brass" },
  { name: "Amex Membership Rewards", group: "Bank currency", balance: 9800, unit: "MR", tone: "brass" },
  { name: "RBL World Safari", group: "Bank currency", balance: 21000, unit: "pts", tone: "brass" },
  { name: "Air India Flying Returns", group: "Airline", balance: 34120, unit: "miles", tone: "slate" },
  { name: "Singapore KrisFlyer", group: "Airline", balance: 58900, unit: "miles", tone: "slate" },
  { name: "Marriott Bonvoy", group: "Hotel", balance: 97300, unit: "pts", tone: "slate" },
];

const OFFERS = [
  "HDFC Infinia → Marriott Bonvoy — 1:1 base, +20% transfer bonus, ends in 4 days",
  "Axis Magnus → Singapore KrisFlyer — 5:2 ratio, no bonus this cycle",
  "Amex MR → Air India Flying Returns — 1:1, buy miles at ₹1.7/mile through 31 Jul",
  "RBL World Safari → Etihad Guest — 4:1, limited-time 15% top-up bonus",
  "HDFC Infinia → Air India Flying Returns — 1:1 direct, no transfer fee this week",
];

const RESULTS_TEMPLATE = [
  {
    route: "DEL → LHR",
    airline: "Air India",
    cabin: "Business",
    cash: "₹2,84,000",
    options: [
      { program: "Air India Flying Returns", miles: 72000, taxes: "₹28,400", via: "direct", value: 3.6 },
      { program: "HDFC Infinia → Air India", miles: 72000, taxes: "₹28,400", via: "transfer 1:1", value: 3.6 },
      { program: "Amex MR → buy + transfer", miles: 72000, taxes: "₹28,400", via: "buy miles", value: 2.1 },
    ],
  },
  {
    route: "BOM → SIN",
    airline: "Singapore Airlines",
    cabin: "Business",
    cash: "₹1,68,000",
    options: [
      { program: "Singapore KrisFlyer", miles: 57500, taxes: "₹14,200", via: "direct", value: 2.7 },
      { program: "Axis Magnus → KrisFlyer", miles: 57500, taxes: "₹14,200", via: "transfer 5:2", value: 2.4 },
    ],
  },
  {
    route: "DEL → FCO",
    airline: "Etihad Airways",
    cabin: "Business",
    cash: "₹3,15,000",
    options: [
      { program: "RBL World Safari → Etihad Guest", miles: 84000, taxes: "₹31,000", via: "transfer 4:1 +15%", value: 3.4 },
      { program: "Etihad Guest direct", miles: 96000, taxes: "₹31,000", via: "direct", value: 3.0 },
    ],
  },
];

/* ---------------- Root component ---------------- */

export default function PointsDesk() {
  useFonts();
  const [tab, setTab] = useState("search");
  const [destQuery, setDestQuery] = useState("");
  const [destOpen, setDestOpen] = useState(false);
  const [origin, setOrigin] = useState("DEL");
  const [destination, setDestination] = useState("LHR");
  const [cabin, setCabin] = useState("Business");
  const [date, setDate] = useState("2026-09-14");
  const [hasSearched, setHasSearched] = useState(false);
  const wrapRef = useRef(null);

  const filteredAirports = useMemo(() => {
    if (!destQuery) return AIRPORTS;
    const q = destQuery.toLowerCase();
    return AIRPORTS.filter(
      (a) => a.city.toLowerCase().includes(q) || a.code.toLowerCase().includes(q)
    );
  }, [destQuery]);

  useEffect(() => {
    function onClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setDestOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const bestValueIdx = (opts) => {
    let best = 0;
    opts.forEach((o, i) => {
      if (o.value > opts[best].value) best = i;
    });
    return best;
  };

  return (
    <div className="pd-root">
      <style>{`
        .pd-root {
          --ink: #0B0F17;
          --panel: #121826;
          --panel2: #1A2233;
          --brass: #C9A24B;
          --brass-dim: #8E7530;
          --parchment: #EDE6D6;
          --slate: #8A93A6;
          --good: #4FB8A6;
          --scarce: #E2574C;
          background: var(--ink);
          color: var(--parchment);
          font-family: 'Inter', sans-serif;
          min-height: 100%;
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
        }
        .pd-display { font-family: 'Space Grotesk', sans-serif; }
        .pd-mono { font-family: 'IBM Plex Mono', monospace; }

        .pd-hero {
          position: relative;
          padding: 44px 32px 32px;
          background:
            radial-gradient(1200px 400px at 15% -10%, rgba(201,162,75,0.14), transparent 60%),
            linear-gradient(180deg, #0D1220 0%, #0B0F17 100%);
          border-bottom: 1px solid rgba(201,162,75,0.15);
        }
        .pd-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--brass);
          margin-bottom: 14px;
        }
        .pd-eyebrow .dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--good);
          box-shadow: 0 0 8px var(--good);
          animation: pulse 1.8s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }

        .flap-char {
          background: linear-gradient(180deg, #1E2740 0%, #141B2B 100%);
          border: 1px solid rgba(201,162,75,0.35);
          border-radius: 3px;
          margin: 0 1px;
          color: var(--brass);
          font-weight: 700;
          line-height: 1.5em;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 2px rgba(0,0,0,0.4);
          position: relative;
        }
        .flap-char::after {
          content: "";
          position: absolute; left: 0; right: 0; top: 50%;
          height: 1px; background: rgba(0,0,0,0.45);
        }

        .pd-hero h1 {
          font-size: 34px;
          font-weight: 700;
          letter-spacing: -0.01em;
          margin: 0 0 10px;
        }
        .pd-hero p.sub {
          color: var(--slate);
          font-size: 14.5px;
          max-width: 560px;
          line-height: 1.55;
          margin: 0;
        }

        .pd-tabs {
          display: flex;
          gap: 6px;
          padding: 14px 32px 0;
          background: var(--ink);
        }
        .pd-tab {
          display: flex; align-items: center; gap: 7px;
          padding: 10px 16px;
          font-size: 13.5px;
          font-weight: 500;
          color: var(--slate);
          border-radius: 8px 8px 0 0;
          cursor: pointer;
          border: 1px solid transparent;
          border-bottom: none;
          transition: color .15s ease;
        }
        .pd-tab.active {
          color: var(--brass);
          background: var(--panel);
          border-color: rgba(201,162,75,0.25);
        }
        .pd-tab:hover:not(.active) { color: var(--parchment); }

        .pd-body {
          background: var(--panel);
          padding: 26px 32px 32px;
          min-height: 480px;
        }

        /* Search form */
        .pd-form {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr auto;
          gap: 10px;
          background: var(--panel2);
          border: 1px solid rgba(201,162,75,0.18);
          border-radius: 12px;
          padding: 14px;
          margin-bottom: 26px;
        }
        .pd-field { position: relative; }
        .pd-field label {
          display: block;
          font-size: 10.5px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--slate);
          margin-bottom: 5px;
        }
        .pd-field input, .pd-field select {
          width: 100%;
          background: #0F1524;
          border: 1px solid rgba(255,255,255,0.08);
          color: var(--parchment);
          border-radius: 7px;
          padding: 9px 10px;
          font-size: 13.5px;
          font-family: inherit;
        }
        .pd-field input:focus, .pd-field select:focus {
          outline: none;
          border-color: var(--brass);
        }
        .pd-dropdown {
          position: absolute;
          top: 100%; left: 0; right: 0;
          margin-top: 4px;
          background: #141B2B;
          border: 1px solid rgba(201,162,75,0.3);
          border-radius: 8px;
          max-height: 220px;
          overflow-y: auto;
          z-index: 20;
          box-shadow: 0 12px 30px rgba(0,0,0,0.5);
        }
        .pd-dropdown-item {
          padding: 9px 12px;
          font-size: 13px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
        }
        .pd-dropdown-item:hover { background: rgba(201,162,75,0.12); }
        .pd-dropdown-item .code { color: var(--brass); font-family: 'IBM Plex Mono', monospace; }

        .pd-searchbtn {
          display: flex; align-items: center; justify-content: center; gap: 7px;
          background: linear-gradient(180deg, var(--brass) 0%, var(--brass-dim) 100%);
          color: #14100a;
          font-weight: 600;
          font-size: 13.5px;
          border: none;
          border-radius: 8px;
          padding: 0 20px;
          cursor: pointer;
          align-self: end;
          height: 40px;
          transition: filter .15s ease;
        }
        .pd-searchbtn:hover { filter: brightness(1.08); }

        /* Result cards */
        .pd-result {
          background: var(--panel2);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 18px 20px;
          margin-bottom: 14px;
        }
        .pd-result-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 4px;
        }
        .pd-result-route {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 18px;
          font-weight: 600;
        }
        .pd-result-meta { color: var(--slate); font-size: 12.5px; }
        .pd-result-cash { color: var(--slate); font-size: 12.5px; margin-bottom: 14px; }

        .pd-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          border-radius: 8px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          margin-bottom: 8px;
        }
        .pd-option.best {
          border-color: rgba(79,184,166,0.5);
          background: rgba(79,184,166,0.06);
        }
        .pd-option-left { display: flex; align-items: center; gap: 10px; }
        .pd-badge {
          font-size: 9.5px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: var(--good);
          color: #08201b;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 100px;
        }
        .pd-option-program { font-size: 13.5px; font-weight: 500; }
        .pd-option-via { font-size: 11.5px; color: var(--slate); }
        .pd-option-right { text-align: right; }
        .pd-option-miles { font-family: 'IBM Plex Mono', monospace; font-size: 14px; color: var(--brass); }
        .pd-option-taxes { font-size: 11px; color: var(--slate); }
        .pd-option-value {
          font-size: 10.5px;
          color: var(--good);
          font-family: 'IBM Plex Mono', monospace;
        }

        /* Wallet */
        .pd-wallet-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 14px;
        }
        .pd-card {
          border-radius: 14px;
          padding: 18px;
          position: relative;
          overflow: hidden;
          min-height: 130px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .pd-card.brass {
          background: linear-gradient(135deg, #2A2210 0%, #3B2F12 40%, #C9A24B 180%);
          border: 1px solid rgba(201,162,75,0.4);
        }
        .pd-card.slate {
          background: linear-gradient(135deg, #1A2233 0%, #232E45 100%);
          border: 1px solid rgba(138,147,166,0.3);
        }
        .pd-card-group {
          font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em;
          color: rgba(237,230,214,0.55);
        }
        .pd-card-name {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          font-size: 15px;
          margin-top: 4px;
        }
        .pd-card-balance {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 22px;
          font-weight: 600;
          margin-top: 14px;
        }
        .pd-card-unit { font-size: 11px; color: rgba(237,230,214,0.6); margin-left: 4px; }

        /* Ticker */
        .pd-ticker-wrap {
          border: 1px solid rgba(201,162,75,0.18);
          border-radius: 10px;
          background: var(--panel2);
          overflow: hidden;
          padding: 10px 0;
        }
        .pd-ticker-track {
          display: flex;
          white-space: nowrap;
          animation: ticker 32s linear infinite;
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .pd-ticker-item {
          display: flex; align-items: center; gap: 8px;
          padding: 0 28px;
          font-size: 13px;
          color: var(--parchment);
          border-right: 1px solid rgba(255,255,255,0.08);
        }
        .pd-ticker-item svg { color: var(--brass); flex-shrink: 0; }

        .pd-section-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--slate);
          margin: 0 0 12px;
        }
      `}</style>

      {/* HERO */}
      <div className="pd-hero">
        <div className="pd-eyebrow">
          <span className="dot" />
          Live desk · synced offers &amp; balances
        </div>
        <h1 className="pd-display">
          <FlipWord word="POINTS" baseDelay={0} /> <FlipWord word="DESK" baseDelay={300} />
        </h1>
        <p className="sub">
          Every mile, point, and transfer ratio you hold — mapped against real redemption
          value, so the best way to book a seat is always the one you actually take.
        </p>
      </div>

      {/* TABS */}
      <div className="pd-tabs">
        {[
          { id: "search", label: "Search", icon: Search },
          { id: "wallet", label: "Wallet", icon: Wallet },
          { id: "offers", label: "Offers", icon: Radio },
        ].map((t) => (
          <div
            key={t.id}
            className={`pd-tab ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            <t.icon size={14} />
            {t.label}
          </div>
        ))}
      </div>

      <div className="pd-body">
        {tab === "search" && (
          <>
            <div className="pd-form">
              <div className="pd-field">
                <label>From</label>
                <select value={origin} onChange={(e) => setOrigin(e.target.value)}>
                  {AIRPORTS.map((a) => (
                    <option key={a.code} value={a.code}>
                      {a.city} ({a.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pd-field" ref={wrapRef}>
                <label>To</label>
                <input
                  placeholder="City or airport"
                  value={destQuery || AIRPORTS.find((a) => a.code === destination)?.city || ""}
                  onFocus={() => setDestOpen(true)}
                  onChange={(e) => {
                    setDestQuery(e.target.value);
                    setDestOpen(true);
                  }}
                />
                {destOpen && (
                  <div className="pd-dropdown">
                    {filteredAirports.map((a) => (
                      <div
                        key={a.code}
                        className="pd-dropdown-item"
                        onClick={() => {
                          setDestination(a.code);
                          setDestQuery("");
                          setDestOpen(false);
                        }}
                      >
                        <span>{a.city}</span>
                        <span className="code">{a.code}</span>
                      </div>
                    ))}
                    {filteredAirports.length === 0 && (
                      <div className="pd-dropdown-item" style={{ color: "var(--slate)" }}>
                        No matches
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pd-field">
                <label>Depart</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>

              <div className="pd-field">
                <label>Cabin</label>
                <select value={cabin} onChange={(e) => setCabin(e.target.value)}>
                  <option>Economy</option>
                  <option>Premium Economy</option>
                  <option>Business</option>
                  <option>First</option>
                </select>
              </div>

              <button className="pd-searchbtn" onClick={() => setHasSearched(true)}>
                <Search size={15} />
                Find miles
              </button>
            </div>

            {hasSearched ? (
              <>
                <div className="pd-section-title">Best redemption paths</div>
                {RESULTS_TEMPLATE.map((r, ri) => {
                  const bIdx = bestValueIdx(r.options);
                  return (
                    <div className="pd-result" key={ri}>
                      <div className="pd-result-head">
                        <div className="pd-result-route">{r.route}</div>
                        <div className="pd-result-meta">
                          {r.airline} · {r.cabin}
                        </div>
                      </div>
                      <div className="pd-result-cash">Cash fare: {r.cash}</div>
                      {r.options.map((o, oi) => (
                        <div className={`pd-option ${oi === bIdx ? "best" : ""}`} key={oi}>
                          <div className="pd-option-left">
                            <ArrowRightLeft size={14} color="var(--slate)" />
                            <div>
                              <div className="pd-option-program">
                                {o.program} {oi === bIdx && <span className="pd-badge">Best value</span>}
                              </div>
                              <div className="pd-option-via">{o.via}</div>
                            </div>
                          </div>
                          <div className="pd-option-right">
                            <div className="pd-option-miles">
                              {o.miles.toLocaleString()} <span style={{ color: "var(--slate)", fontSize: 11 }}>mi</span>
                            </div>
                            <div className="pd-option-taxes">+{o.taxes} taxes</div>
                            <div className="pd-option-value">₹{o.value.toFixed(1)}/mile value</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </>
            ) : (
              <div style={{ color: "var(--slate)", fontSize: 13.5, padding: "40px 0", textAlign: "center" }}>
                Set a route and hit <span style={{ color: "var(--brass)" }}>Find miles</span> to see redemption
                options mapped across your transferable and airline balances.
              </div>
            )}
          </>
        )}

        {tab === "wallet" && (
          <>
            <div className="pd-section-title">Bank transferable currency</div>
            <div className="pd-wallet-grid" style={{ marginBottom: 26 }}>
              {WALLET.filter((w) => w.group === "Bank currency").map((w) => (
                <WalletCard key={w.name} w={w} />
              ))}
            </div>
            <div className="pd-section-title">Airline &amp; hotel loyalty</div>
            <div className="pd-wallet-grid">
              {WALLET.filter((w) => w.group !== "Bank currency").map((w) => (
                <WalletCard key={w.name} w={w} />
              ))}
            </div>
          </>
        )}

        {tab === "offers" && (
          <>
            <div className="pd-section-title">Live transfer &amp; purchase offers</div>
            <div className="pd-ticker-wrap" style={{ marginBottom: 22 }}>
              <div className="pd-ticker-track">
                {[...OFFERS, ...OFFERS].map((o, i) => (
                  <div className="pd-ticker-item" key={i}>
                    <TrendingUp size={13} />
                    {o}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {OFFERS.map((o, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: "var(--panel2)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 8,
                    padding: "12px 14px",
                    fontSize: 13,
                  }}
                >
                  <Clock size={14} color="var(--brass)" />
                  {o}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function WalletCard({ w }) {
  return (
    <div className={`pd-card ${w.tone}`}>
      <div>
        <div className="pd-card-group">{w.group}</div>
        <div className="pd-card-name">{w.name}</div>
      </div>
      <div>
        <span className="pd-card-balance">{w.balance.toLocaleString()}</span>
        <span className="pd-card-unit">{w.unit}</span>
      </div>
    </div>
  );
}
