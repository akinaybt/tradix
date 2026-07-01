import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- fix for ES modules (__dirname) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- serve frontend files ---
app.use(express.static(__dirname));

// --- root route (IMPORTANT) ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
const MARKETSTACK_KEY = process.env.MARKETSTACK_API_KEY;
const MARKETSTACK_BASE = "http://api.marketstack.com/v1";

// --- helpers ---
const timeframeDays = { "1D": 1, "1M": 31, "3M": 92, "1Y": 366 };

function dateDaysAgo(days) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

function trend(changePct) {
  if (changePct > 0) return "up";
  if (changePct < 0) return "down";
  return "flat";
}

function currencyByCountry(code = "US") {
  const map = {
    US: "USD",
    GB: "GBP",
    DE: "EUR",
    FR: "EUR",
    IT: "EUR",
    ES: "EUR",
    NL: "EUR",
    BE: "EUR",
    JP: "JPY",
    KZ: "KZT",
    CA: "CAD",
    AU: "AUD",
    CH: "CHF",
    CN: "CNY",
    IN: "INR",
  };
  return map[code] || "USD";
}

// --- FX ---
const fxCache = new Map();
const FX_TTL_MS = 10 * 60 * 1000;

async function getFxRate(from, to) {
  if (from === to) return 1;

  const key = `${from}_${to}`;
  const now = Date.now();
  const cached = fxCache.get(key);
  if (cached && now - cached.ts < FX_TTL_MS) return cached.rate;

  const url = `https://api.frankfurter.app/latest?from=${from}&to=${to}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`FX API failed: ${r.status}`);

  const raw = await r.json();
  const rate = Number(raw?.rates?.[to]);
  if (!Number.isFinite(rate) || rate <= 0) throw new Error("Invalid FX rate");

  fxCache.set(key, { rate, ts: now });
  return rate;
}

async function convertCurrency(value, from, to) {
  if (value == null) return null;
  if (from === to) return Number(value);

  try {
    const rate = await getFxRate(from, to);
    return +(Number(value) * rate).toFixed(6);
  } catch {
    return Number(value);
  }
}

// --- ROUTES ---

app.get("/api/market/snapshot", async (req, res) => {
  try {
    if (!MARKETSTACK_KEY) {
      return res.status(500).json({ error: "Missing MARKETSTACK_API_KEY" });
    }

    const q = (req.query.q || "").toString();
    const country = (req.query.country || "US").toString().toUpperCase();
    const currency = (req.query.currency || "USD").toString().toUpperCase();

    const symbols = q || "AAPL,MSFT,GOOGL,AMZN,TSLA";

    const url = `${MARKETSTACK_BASE}/eod/latest?access_key=${MARKETSTACK_KEY}&symbols=${symbols}`;
    const r = await fetch(url);

    if (!r.ok) {
      return res.status(502).json({ error: "Market API failed", status: r.status });
    }

    const raw = await r.json();
    const rows = Array.isArray(raw?.data) ? raw.data : [];

    const items = await Promise.all(
      rows.map(async (x) => {
        const open = Number(x.open ?? x.previous_close ?? 0);
        const close = Number(x.close ?? 0);

        const changePct = open ? ((close - open) / open) * 100 : 0;

        return {
          symbol: x.symbol,
          price: await convertCurrency(close, "USD", currency),
          open: await convertCurrency(open, "USD", currency),
          change_pct: +changePct.toFixed(4),
          trend: trend(changePct),
        };
      })
    );

    res.json({ country, currency, items });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// (остальные API ты можешь оставить без изменений)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
