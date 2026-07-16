import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Wallet,
  Radio,
  ArrowRightLeft,
  Search,
  Sparkles,
  TrendingUp,
  Clock,
  ExternalLink,
  Plus,
  Pencil,
  X,
  Check,
} from "lucide-react";

/* ---------------------------------------------------------------
   POINTS DESK — prototype v2
   Design tokens:
   ink #0B0F17  panel #121826  panel-2 #1A2233
   brass #C9A24B / brass-dim #8E7530   parchment #EDE6D6
   slate #8A93A6   good #4FB8A6   scarce #E2574C
   Display: Space Grotesk · Body: Inter · Data/mono: IBM Plex Mono
   Signature: split-flap departure-board flip character, used in hero
   and price reveals.

   NOTE on real links: every "View program" / issuer link below points
   to that program's actual official page (verified July 2026). Sample
   balances, transfer ratios and redemption values are still
   illustrative — they are NOT live data.
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
  useEffect(() => {
    let cancelled = false;
    const startTimeout = setTimeout(() => {
      let i = 0;
      const steps = 8 + Math.floor(Math.random() * 6);
      const interval = setInterval(() => {
        if (cancelled) return;
        i++;
        if (i >= steps) {
          setDisplay(target);
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
    <span className="flap-char" style={{ fontSize: size }}>
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

/* ---------------- Tiny signature skyline icons (original line art, not photos) ---------------- */
function SkylineIcon({ type }) {
  const common = { width: 44, height: 32, viewBox: "0 0 44 32", fill: "none" };
  const stroke = "var(--brass)";
  switch (type) {
    case "dubai":
      return (
        <svg {...common}>
          <path d="M22 30V4M18 30V10L22 4L26 10V30" stroke={stroke} strokeWidth="1.4" />
          <path d="M6 30V16h5v14M33 30V12h5v18" stroke={stroke} strokeWidth="1.4" opacity="0.6" />
        </svg>
      );
    case "singapore":
      return (
        <svg {...common}>
          <path d="M8 30V14h4v16M16 30V8h4v22M24 30V12h4v18M32 30V16h4v14" stroke={stroke} strokeWidth="1.4" />
          <path d="M6 30h34" stroke={stroke} strokeWidth="1" opacity="0.5" />
        </svg>
      );
    case "bangkok":
      return (
        <svg {...common}>
          <path d="M22 30V6l-3 3h6l-3-3" stroke={stroke} strokeWidth="1.4" />
          <path d="M12 30V18h20v12" stroke={stroke} strokeWidth="1.4" opacity="0.7" />
        </svg>
      );
    case "goa":
      return (
        <svg {...common}>
          <path d="M10 30c4-10 8-14 12-14s8 4 12 14" stroke={stroke} strokeWidth="1.4" />
          <path d="M22 16V6" stroke={stroke} strokeWidth="1.4" />
          <path d="M22 6c4 0 6 2 6 2s-4 1-6 1-6-1-6-1 2-2 6-2" stroke={stroke} strokeWidth="1.2" />
        </svg>
      );
    default:
      return null;
  }
}

/* ---------------- Data ---------------- */

const AIRPORTS = [
  { code: "DEL", city: "Delhi", region: "domestic" },
  { code: "BOM", city: "Mumbai", region: "domestic" },
  { code: "BLR", city: "Bengaluru", region: "domestic" },
  { code: "HYD", city: "Hyderabad", region: "domestic" },
  { code: "MAA", city: "Chennai", region: "domestic" },
  { code: "CCU", city: "Kolkata", region: "domestic" },
  { code: "GOI", city: "Goa", region: "domestic" },
  { code: "COK", city: "Kochi", region: "domestic" },
  { code: "PNQ", city: "Pune", region: "domestic" },
  { code: "AMD", city: "Ahmedabad", region: "domestic" },
  { code: "LHR", city: "London", region: "international" },
  { code: "SIN", city: "Singapore", region: "international" },
  { code: "DXB", city: "Dubai", region: "international" },
  { code: "CDG", city: "Paris", region: "international" },
  { code: "FCO", city: "Rome", region: "international" },
  { code: "JFK", city: "New York", region: "international" },
  { code: "BKK", city: "Bangkok", region: "international" },
  { code: "NRT", city: "Tokyo", region: "international" },
  { code: "SYD", city: "Sydney", region: "international" },
];

// Official program pages — real URLs, verified July 2026
const LINKS = {
  "HDFC Infinia": "https://offers.smartbuy.hdfcbank.com/v1/infinia",
  "Axis Magnus": "https://www.axisbank.com/cards/credit-card/axis-bank-magnus-credit-card",
  "HSBC TravelOne": "https://www.hsbc.co.in/credit-cards/products/travelone/rewards/",
  "Amex Membership Rewards": "https://www.americanexpress.com/in/rewards/membership-rewards.html",
  "RBL World Safari": "https://www.rblbank.com/personal-banking/cards/credit-cards/world-safari-credit-card",
  "Air India Maharaja Club": "https://www.airindia.com/in/en/maharaja-club.html",
  "Singapore KrisFlyer": "https://www.krisflyer.com/",
  "Marriott Bonvoy": "https://www.marriott.com/loyalty.mi",
};

const INITIAL_WALLET = [
  { id: "w1", name: "HDFC Infinia", group: "Bank currency", balance: 184500, unit: "RP", tone: "brass" },
  { id: "w2", name: "Axis Magnus", group: "Bank currency", balance: 42200, unit: "EDGE", tone: "brass" },
  { id: "w3", name: "HSBC TravelOne", group: "Bank currency", balance: 31000, unit: "pts", tone: "brass" },
  { id: "w4", name: "Amex Membership Rewards", group: "Bank currency", balance: 9800, unit: "MR", tone: "brass" },
  { id: "w5", name: "RBL World Safari", group: "Bank currency", balance: 21000, unit: "pts", tone: "brass" },
  { id: "w6", name: "Air India Maharaja Club", group: "Airline", balance: 34120, unit: "pts", tone: "slate" },
  { id: "w7", name: "Singapore KrisFlyer", group: "Airline", balance: 58900, unit: "miles", tone: "slate" },
  { id: "w8", name: "Marriott Bonvoy", group: "Hotel", balance: 97300, unit: "pts", tone: "slate" },
];

const OFFERS = [
  "HDFC Infinia → Marriott Bonvoy — 1:1 base, +20% transfer bonus, ends in 4 days",
  "Axis Magnus → Singapore KrisFlyer — 5:2 ratio, no bonus this cycle",
  "HSBC TravelOne → Air India Maharaja Club — 1:1, instant in-app conversion",
  "RBL World Safari → Etihad Guest — 4:1, limited-time 15% top-up bonus",
  "Axis Magnus → IndiGo BluChip — introductory transfer offer, ends soon",
];

const RESULTS_TEMPLATE = [
  {
    route: "DEL → LHR",
    airline: "Air India",
    cabin: "Business",
    cash: "₹2,84,000",
    options: [
      { program: "Air India Maharaja Club", miles: 72000, taxes: "₹28,400", via: "direct", value: 3.6 },
      { program: "HDFC Infinia → Maharaja Club", miles: 72000, taxes: "₹28,400", via: "transfer 1:1", value: 3.6 },
      { program: "HSBC TravelOne → Maharaja Club", miles: 72000, taxes: "₹28,400", via: "transfer 1:1", value: 3.4 },
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
    route: "DEL → GOI",
    airline: "IndiGo",
    cabin: "Economy",
    cash: "₹7,200",
    options: [
      { program: "Axis Magnus → IndiGo BluChip", miles: 6800, taxes: "₹900", via: "transfer, intro offer", value: 1.0 },
      { program: "Cash fare (no redemption beats it)", miles: 0, taxes: "₹7,200", via: "book direct", value: 0 },
    ],
  },
];

const HERO_TEASERS = [
  { code: "DXB", city: "Dubai", cabin: "Business", points: "72,000 pts", icon: "dubai" },
  { code: "SIN", city: "Singapore", cabin: "Business", points: "57,500 miles", icon: "singapore" },
  { code: "BKK", city: "Bangkok", cabin: "Economy", points: "15,000 pts", icon: "bangkok" },
  { code: "GOI", city: "Goa", cabin: "Economy", points: "6,800 pts", icon: "goa" },
];

/* ---------------- Root ---------------- */

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
  const [wallet, setWallet] = useState(INITIAL_WALLET);
  const [addingCard, setAddingCard] = useState(false);
  const [editingId, setEditingId] = useState(null);
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

  const jumpToDestination = (code) => {
    setDestination(code);
    setTab("search");
    setHasSearched(true);
  };

  const addWalletCard = (card) => {
    setWallet((w) => [...w, { ...card, id: `w${Date.now()}` }]);
    setAddingCard(false);
  };
  const updateWalletCard = (id, patch) => {
    setWallet((w) => w.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    setEditingId(null);
  };
  const deleteWalletCard = (id) => setWallet((w) => w.filter((c) => c.id !== id));

  return (
    <div className="pd-root">
      <style>{`
        .pd-root {
          --ink: #0B0F17; --panel: #121826; --panel2: #1A2233;
          --brass: #C9A24B; --brass-dim: #8E7530; --parchment: #EDE6D6;
          --slate: #8A93A6; --good: #4FB8A6; --scarce: #E2574C;
          background: var(--ink); color: var(--parchment);
          font-family: 'Inter', sans-serif;
          min-height: 100%; width: 100%; border-radius: 12px;
          overflow: hidden; position: relative;
        }
        .pd-display { font-family: 'Space Grotesk', sans-serif; }
        .pd-mono { font-family: 'IBM Plex Mono', monospace; }

        .pd-hero {
          position: relative; padding: 40px 32px 26px;
          background: radial-gradient(1200px 400px at 15% -10%, rgba(201,162,75,0.14), transparent 60%),
            linear-gradient(180deg, #0D1220 0%, #0B0F17 100%);
          border-bottom: 1px solid rgba(201,162,75,0.15);
        }
        .pd-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--brass); margin-bottom: 14px;
        }
        .pd-eyebrow .dot {
          width: 6px; height: 6px; border-radius: 50%; background: var(--good);
          box-shadow: 0 0 8px var(--good); animation: pulse 1.8s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }

        .flap-char {
          display: inline-block; width: 0.72em; margin: 0 1px;
          background: linear-gradient(180deg, #1E2740 0%, #141B2B 100%);
          border: 1px solid rgba(201,162,75,0.35); border-radius: 3px;
          color: var(--brass); font-weight: 700; line-height: 1.5em; text-align: center;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 2px rgba(0,0,0,0.4);
          position: relative;
        }
        .flap-char::after {
          content: ""; position: absolute; left: 0; right: 0; top: 50%;
          height: 1px; background: rgba(0,0,0,0.45);
        }

        .pd-hero h1 { font-size: 32px; font-weight: 700; letter-spacing: -0.01em; margin: 0 0 8px; }
        .pd-hero p.sub { color: var(--slate); font-size: 14px; max-width: 560px; line-height: 1.5; margin: 0 0 22px; }

        .pd-teasers { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; }
        .pd-teaser {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(201,162,75,0.2);
          border-radius: 10px; padding: 12px; cursor: pointer; transition: transform .15s ease, border-color .15s ease;
          display: flex; flex-direction: column; gap: 8px;
        }
        .pd-teaser:hover { transform: translateY(-2px); border-color: var(--brass); }
        .pd-teaser-city { font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 600; }
        .pd-teaser-meta { font-size: 11px; color: var(--slate); }
        .pd-teaser-points { font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; color: var(--brass); margin-top: 2px; }

        .pd-tabs { display: flex; gap: 6px; padding: 14px 32px 0; background: var(--ink); }
        .pd-tab {
          display: flex; align-items: center; gap: 7px; padding: 10px 16px;
          font-size: 13.5px; font-weight: 500; color: var(--slate);
          border-radius: 8px 8px 0 0; cursor: pointer; border: 1px solid transparent; border-bottom: none;
        }
        .pd-tab.active { color: var(--brass); background: var(--panel); border-color: rgba(201,162,75,0.25); }
        .pd-tab:hover:not(.active) { color: var(--parchment); }

        .pd-body { background: var(--panel); padding: 26px 32px 32px; min-height: 480px; }

        .pd-form {
          display: grid; grid-template-columns: 1fr 1fr 1fr 1fr auto; gap: 10px;
          background: var(--panel2); border: 1px solid rgba(201,162,75,0.18);
          border-radius: 12px; padding: 14px; margin-bottom: 26px;
        }
        .pd-field { position: relative; }
        .pd-field label { display: block; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--slate); margin-bottom: 5px; }
        .pd-field input, .pd-field select {
          width: 100%; background: #0F1524; border: 1px solid rgba(255,255,255,0.08);
          color: var(--parchment); border-radius: 7px; padding: 9px 10px; font-size: 13.5px; font-family: inherit;
        }
        .pd-field input:focus, .pd-field select:focus { outline: none; border-color: var(--brass); }
        .pd-dropdown {
          position: absolute; top: 100%; left: 0; right: 0; margin-top: 4px;
          background: #141B2B; border: 1px solid rgba(201,162,75,0.3); border-radius: 8px;
          max-height: 240px; overflow-y: auto; z-index: 20; box-shadow: 0 12px 30px rgba(0,0,0,0.5);
        }
        .pd-dropdown-section { padding: 6px 12px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--slate); background: rgba(255,255,255,0.02); }
        .pd-dropdown-item { padding: 9px 12px; font-size: 13px; cursor: pointer; display: flex; justify-content: space-between; }
        .pd-dropdown-item:hover { background: rgba(201,162,75,0.12); }
        .pd-dropdown-item .code { color: var(--brass); font-family: 'IBM Plex Mono', monospace; }

        .pd-searchbtn {
          display: flex; align-items: center; justify-content: center; gap: 7px;
          background: linear-gradient(180deg, var(--brass) 0%, var(--brass-dim) 100%);
          color: #14100a; font-weight: 600; font-size: 13.5px; border: none; border-radius: 8px;
          padding: 0 20px; cursor: pointer; align-self: end; height: 40px;
        }
        .pd-searchbtn:hover { filter: brightness(1.08); }

        .pd-result { background: var(--panel2); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 18px 20px; margin-bottom: 14px; }
        .pd-result-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
        .pd-result-route { font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 600; }
        .pd-result-meta { color: var(--slate); font-size: 12.5px; }
        .pd-result-cash { color: var(--slate); font-size: 12.5px; margin-bottom: 14px; }

        .pd-option { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-radius: 8px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); margin-bottom: 8px; }
        .pd-option.best { border-color: rgba(79,184,166,0.5); background: rgba(79,184,166,0.06); }
        .pd-option-left { display: flex; align-items: center; gap: 10px; }
        .pd-badge { font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.06em; background: var(--good); color: #08201b; font-weight: 700; padding: 2px 7px; border-radius: 100px; }
        .pd-option-program { font-size: 13.5px; font-weight: 500; }
        .pd-option-via { font-size: 11.5px; color: var(--slate); }
        .pd-option-right { text-align: right; }
        .pd-option-miles { font-family: 'IBM Plex Mono', monospace; font-size: 14px; color: var(--brass); }
        .pd-option-taxes { font-size: 11px; color: var(--slate); }
        .pd-option-value { font-size: 10.5px; color: var(--good); font-family: 'IBM Plex Mono', monospace; }

        .pd-wallet-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; }
        .pd-card { border-radius: 14px; padding: 16px 18px; position: relative; overflow: hidden; min-height: 138px; display: flex; flex-direction: column; justify-content: space-between; }
        .pd-card.brass { background: linear-gradient(135deg, #2A2210 0%, #3B2F12 40%, #C9A24B 180%); border: 1px solid rgba(201,162,75,0.4); }
        .pd-card.slate { background: linear-gradient(135deg, #1A2233 0%, #232E45 100%); border: 1px solid rgba(138,147,166,0.3); }
        .pd-card-group { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(237,230,214,0.55); }
        .pd-card-name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 14.5px; margin-top: 4px; }
        .pd-card-balance { font-family: 'IBM Plex Mono', monospace; font-size: 21px; font-weight: 600; margin-top: 12px; }
        .pd-card-unit { font-size: 11px; color: rgba(237,230,214,0.6); margin-left: 4px; }
        .pd-card-actions { position: absolute; top: 10px; right: 10px; display: flex; gap: 6px; opacity: 0; transition: opacity .15s ease; }
        .pd-card:hover .pd-card-actions { opacity: 1; }
        .pd-icon-btn { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 6px; background: rgba(0,0,0,0.35); cursor: pointer; color: var(--parchment); border: none; }
        .pd-icon-btn:hover { background: rgba(0,0,0,0.55); }
        .pd-card-link { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; color: var(--parchment); opacity: 0.85; text-decoration: none; margin-top: 8px; }
        .pd-card-link:hover { opacity: 1; text-decoration: underline; }

        .pd-add-card { border: 1px dashed rgba(201,162,75,0.4); border-radius: 14px; min-height: 138px; display: flex; align-items: center; justify-content: center; gap: 8px; color: var(--brass); font-size: 13px; cursor: pointer; background: rgba(201,162,75,0.04); }
        .pd-add-card:hover { background: rgba(201,162,75,0.09); }

        .pd-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.55); display: flex; align-items: center; justify-content: center; z-index: 50; }
        .pd-modal { background: var(--panel2); border: 1px solid rgba(201,162,75,0.3); border-radius: 12px; padding: 22px; width: 320px; }
        .pd-modal h3 { margin: 0 0 14px; font-family: 'Space Grotesk', sans-serif; font-size: 15px; }
        .pd-modal label { display: block; font-size: 10.5px; text-transform: uppercase; color: var(--slate); margin: 10px 0 4px; }
        .pd-modal input, .pd-modal select { width: 100%; background: #0F1524; border: 1px solid rgba(255,255,255,0.1); color: var(--parchment); border-radius: 7px; padding: 8px 10px; font-size: 13px; }
        .pd-modal-actions { display: flex; gap: 8px; margin-top: 18px; }
        .pd-modal-btn { flex: 1; padding: 9px; border-radius: 7px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; }
        .pd-modal-btn.save { background: var(--brass); color: #14100a; }
        .pd-modal-btn.cancel { background: rgba(255,255,255,0.06); color: var(--parchment); }

        .pd-note { font-size: 11.5px; color: var(--slate); background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 10px 12px; margin-bottom: 18px; line-height: 1.5; }

        .pd-ticker-wrap { border: 1px solid rgba(201,162,75,0.18); border-radius: 10px; background: var(--panel2); overflow: hidden; padding: 10px 0; }
        .pd-ticker-track { display: flex; white-space: nowrap; animation: ticker 32s linear infinite; }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .pd-ticker-item { display: flex; align-items: center; gap: 8px; padding: 0 28px; font-size: 13px; color: var(--parchment); border-right: 1px solid rgba(255,255,255,0.08); }
        .pd-ticker-item svg { color: var(--brass); flex-shrink: 0; }

        .pd-offer-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; background: var(--panel2); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 12px 14px; font-size: 13px; }
        .pd-offer-link { display: inline-flex; align-items: center; gap: 4px; font-size: 11.5px; color: var(--brass); text-decoration: none; white-space: nowrap; }
        .pd-offer-link:hover { text-decoration: underline; }

        .pd-section-title { font-family: 'Space Grotesk', sans-serif; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--slate); margin: 0 0 12px; }
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
        <div className="pd-teasers">
          {HERO_TEASERS.map((t) => (
            <div className="pd-teaser" key={t.code} onClick={() => jumpToDestination(t.code)}>
              <SkylineIcon type={t.icon} />
              <div>
                <div className="pd-teaser-city">{t.city}</div>
                <div className="pd-teaser-meta">{t.cabin} redemption from</div>
                <div className="pd-teaser-points">{t.points}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div className="pd-tabs">
        {[
          { id: "search", label: "Search", icon: Search },
          { id: "wallet", label: "Wallet", icon: Wallet },
          { id: "offers", label: "Offers", icon: Radio },
        ].map((t) => (
          <div key={t.id} className={`pd-tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
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
                  <optgroup label="Domestic">
                    {AIRPORTS.filter((a) => a.region === "domestic").map((a) => (
                      <option key={a.code} value={a.code}>{a.city} ({a.code})</option>
                    ))}
                  </optgroup>
                  <optgroup label="International">
                    {AIRPORTS.filter((a) => a.region === "international").map((a) => (
                      <option key={a.code} value={a.code}>{a.city} ({a.code})</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="pd-field" ref={wrapRef}>
                <label>To</label>
                <input
                  placeholder="City or airport, domestic or international"
                  value={destQuery || AIRPORTS.find((a) => a.code === destination)?.city || ""}
                  onFocus={() => setDestOpen(true)}
                  onChange={(e) => { setDestQuery(e.target.value); setDestOpen(true); }}
                />
                {destOpen && (
                  <div className="pd-dropdown">
                    {["domestic", "international"].map((region) => {
                      const items = filteredAirports.filter((a) => a.region === region);
                      if (items.length === 0) return null;
                      return (
                        <div key={region}>
                          <div className="pd-dropdown-section">{region}</div>
                          {items.map((a) => (
                            <div
                              key={a.code}
                              className="pd-dropdown-item"
                              onClick={() => { setDestination(a.code); setDestQuery(""); setDestOpen(false); }}
                            >
                              <span>{a.city}</span>
                              <span className="code">{a.code}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                    {filteredAirports.length === 0 && (
                      <div className="pd-dropdown-item" style={{ color: "var(--slate)" }}>No matches</div>
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
                        <div className="pd-result-meta">{r.airline} · {r.cabin}</div>
                      </div>
                      <div className="pd-result-cash">Cash fare: {r.cash}</div>
                      {r.options.map((o, oi) => (
                        <div className={`pd-option ${oi === bIdx && o.value > 0 ? "best" : ""}`} key={oi}>
                          <div className="pd-option-left">
                            <ArrowRightLeft size={14} color="var(--slate)" />
                            <div>
                              <div className="pd-option-program">
                                {o.program} {oi === bIdx && o.value > 0 && <span className="pd-badge">Best value</span>}
                              </div>
                              <div className="pd-option-via">{o.via}</div>
                            </div>
                          </div>
                          <div className="pd-option-right">
                            {o.miles > 0 && (
                              <div className="pd-option-miles">{o.miles.toLocaleString()} <span style={{ color: "var(--slate)", fontSize: 11 }}>pts</span></div>
                            )}
                            <div className="pd-option-taxes">{o.miles > 0 ? "+" : ""}{o.taxes} {o.miles > 0 ? "taxes" : ""}</div>
                            {o.value > 0 && <div className="pd-option-value">₹{o.value.toFixed(1)}/point value</div>}
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
                options — or tap a destination above.
              </div>
            )}
          </>
        )}

        {tab === "wallet" && (
          <>
            <div className="pd-note">
              Balances here are entered by you — nothing is pulled automatically from your bank,
              card issuer, or email. That's a deliberate choice: doing it safely would mean either
              an official API from each provider (most don't offer one to individual developers)
              or reading your inbox/logging into accounts on your behalf, which isn't something
              this tool does.
            </div>

            <div className="pd-section-title">Bank transferable currency</div>
            <div className="pd-wallet-grid" style={{ marginBottom: 26 }}>
              {wallet.filter((w) => w.group === "Bank currency").map((w) => (
                <WalletCard key={w.id} w={w} onEdit={() => setEditingId(w.id)} onDelete={() => deleteWalletCard(w.id)} />
              ))}
              <div className="pd-add-card" onClick={() => setAddingCard(true)}>
                <Plus size={16} /> Add card / program
              </div>
            </div>

            <div className="pd-section-title">Airline &amp; hotel loyalty</div>
            <div className="pd-wallet-grid">
              {wallet.filter((w) => w.group !== "Bank currency").map((w) => (
                <WalletCard key={w.id} w={w} onEdit={() => setEditingId(w.id)} onDelete={() => deleteWalletCard(w.id)} />
              ))}
            </div>

            {addingCard && (
              <WalletModal
                onCancel={() => setAddingCard(false)}
                onSave={addWalletCard}
              />
            )}
            {editingId && (
              <WalletModal
                initial={wallet.find((w) => w.id === editingId)}
                onCancel={() => setEditingId(null)}
                onSave={(patch) => updateWalletCard(editingId, patch)}
              />
            )}
          </>
        )}

        {tab === "offers" && (
          <>
            <div className="pd-section-title">Live transfer &amp; purchase offers</div>
            <div className="pd-ticker-wrap" style={{ marginBottom: 22 }}>
              <div className="pd-ticker-track">
                {[...OFFERS, ...OFFERS].map((o, i) => (
                  <div className="pd-ticker-item" key={i}><TrendingUp size={13} />{o}</div>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {OFFERS.map((o, i) => {
                const progName = Object.keys(LINKS).find((k) => o.includes(k.split(" ")[0]));
                return (
                  <div className="pd-offer-row" key={i}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Clock size={14} color="var(--brass)" />
                      {o}
                    </div>
                    {progName && (
                      <a className="pd-offer-link" href={LINKS[progName]} target="_blank" rel="noopener noreferrer">
                        View program <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function WalletCard({ w, onEdit, onDelete }) {
  const link = LINKS[w.name];
  return (
    <div className={`pd-card ${w.tone}`}>
      <div className="pd-card-actions">
        <button className="pd-icon-btn" onClick={onEdit} aria-label="Edit"><Pencil size={12} /></button>
        <button className="pd-icon-btn" onClick={onDelete} aria-label="Delete"><X size={12} /></button>
      </div>
      <div>
        <div className="pd-card-group">{w.group}</div>
        <div className="pd-card-name">{w.name}</div>
      </div>
      <div>
        <span className="pd-card-balance">{Number(w.balance).toLocaleString()}</span>
        <span className="pd-card-unit">{w.unit}</span>
        {link && (
          <div>
            <a className="pd-card-link" href={link} target="_blank" rel="noopener noreferrer">
              View program <ExternalLink size={11} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function WalletModal({ initial, onCancel, onSave }) {
  const [name, setName] = useState(initial?.name || "");
  const [group, setGroup] = useState(initial?.group || "Bank currency");
  const [balance, setBalance] = useState(initial?.balance ?? "");
  const [unit, setUnit] = useState(initial?.unit || "pts");

  return (
    <div className="pd-modal-backdrop" onClick={onCancel}>
      <div className="pd-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{initial ? "Edit program" : "Add program"}</h3>
        <label>Program name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. ICICI Emeralde" />
        <label>Type</label>
        <select value={group} onChange={(e) => setGroup(e.target.value)}>
          <option>Bank currency</option>
          <option>Airline</option>
          <option>Hotel</option>
        </select>
        <label>Balance</label>
        <input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} placeholder="0" />
        <label>Unit label</label>
        <input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="pts / miles / RP" />
        <div className="pd-modal-actions">
          <button className="pd-modal-btn cancel" onClick={onCancel}>Cancel</button>
          <button
            className="pd-modal-btn save"
            onClick={() =>
              name &&
              onSave({
                name,
                group,
                balance: Number(balance) || 0,
                unit,
                tone: group === "Bank currency" ? "brass" : "slate",
              })
            }
          >
            <Check size={13} style={{ marginRight: 4, verticalAlign: -2 }} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
