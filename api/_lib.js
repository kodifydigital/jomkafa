// Fungsi bersama API leaderboard (fail bermula "_" tidak menjadi laluan API di Vercel).
// Pemboleh ubah persekitaran Vercel: DATABASE_URL (Neon), CLERK_SECRET_KEY (Clerk).
import { neon } from "@neondatabase/serverless";
import { verifyToken } from "@clerk/backend";

export const SUBJECTS = ["sirah", "feqah", "tauhid", "akhlak", "arab", "tajwid", "hafazan", "mix"];
export const GAMES = ["whack", "catch", "pop", "run", "climb"];

let _sql = null;
export function db() {
  if (!_sql) {
    if (!process.env.DATABASE_URL) throw new HttpError(500, "DATABASE_URL belum ditetapkan");
    _sql = neon(process.env.DATABASE_URL);
  }
  return _sql;
}

// Cipta jadual sekali bagi setiap instans fungsi (sama seperti sql/schema.sql)
let ready = null;
export function ensureSchema() {
  if (!ready) {
    const sql = db();
    ready = (async () => {
      await sql`create table if not exists players (id text primary key, name text not null, created_at timestamptz not null default now())`;
      await sql`create table if not exists classes (code text primary key, name text not null, owner text not null references players(id) on delete cascade, created_at timestamptz not null default now())`;
      await sql`create table if not exists members (code text not null references classes(code) on delete cascade, player text not null references players(id) on delete cascade, primary key (code, player))`;
      await sql`create table if not exists scores (player text not null references players(id) on delete cascade, subj text not null, game text not null, best int not null, plays int not null default 1, updated_at timestamptz not null default now(), primary key (player, subj, game))`;
      await sql`create index if not exists scores_board on scores (subj, game, best desc)`;
      await sql`create table if not exists plays (id bigserial primary key, player text not null, subj text not null, game text not null, score int not null, at timestamptz not null default now())`;
      await sql`create index if not exists plays_player on plays (player, at desc)`;
      // nama yang ditetapkan guru dikunci supaya murid tidak boleh menukarnya semula
      await sql`alter table players add column if not exists locked boolean not null default false`;
      await sql`create table if not exists mistakes (player text not null references players(id) on delete cascade, subj text not null, qkey text not null, wkey text not null, q jsonb not null, w jsonb not null, r jsonb, n int not null default 1, last_at timestamptz not null default now(), primary key (player, subj, qkey, wkey))`;
    })().catch(e => { ready = null; throw e; });
  }
  return ready;
}

// code: kod ringkas supaya laman boleh memaparkan mesej dalam Rumi atau Jawi
export class HttpError extends Error {
  constructor(status, message, code) { super(message); this.status = status; this.code = code; }
}

// Sahkan token sesi Clerk daripada pengepala Authorization. Pulangkan id pengguna atau null.
export async function userId(req, required = true) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) { if (required) throw new HttpError(401, "Sila log masuk"); return null; }
  try {
    const p = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
    return p.sub;
  } catch (e) {
    // contoh sebab: "jwk-kid-mismatch" / "token-invalid-signature" = CLERK_SECRET_KEY bukan dari instans Clerk yang sama
    console.error("Clerk verifyToken gagal:", e.reason || "", e.message);
    if (required) throw new HttpError(401, "Sesi tidak sah, sila log masuk semula");
    return null;
  }
}

// Penapis perkataan kasar (Melayu/Inggeris). WORDS dibanding sebagai perkataan penuh supaya nama
// seperti "Hassan" tidak tersekat; PARTS cukup panjang untuk dicari di mana-mana dalam teks.
const WORDS = new Set(["babi", "bodoh", "sial", "puki", "pukimak", "kimak", "pantat", "lancau", "kote", "butoh", "konek", "jubur", "pepek", "tetek",
  "celaka", "bangsat", "keparat", "sundal", "pelacur", "lahanat", "bahlol", "bengap", "bebal", "tolol", "goblok", "mampus", "jahanam",
  "anjing", "setan", "syaitan", "lucah", "seks", "sex", "porn", "fuck", "shit", "bitch", "dick", "pussy", "ass", "asshole", "bastard", "slut", "whore",
  "nigger", "nigga", "bunuh", "بابي", "بودوه", "سيال", "ڤوکي", "ڤوکيمق", "چلاک", "انجيڠ"]);
const PARTS = ["pukimak", "lancau", "bangsat", "keparat", "pantat", "sundal", "pelacur", "haramjadah", "kepalabapak", "fuck", "shit", "bitch", "asshole", "bastard", "nigg", "porn", "whore"];
const squeeze = w => w.replace(/(.)\1+/g, "$1"); // "fuuuck" -> "fuck"
export function rude(s) {
  const t = String(s).toLowerCase().normalize("NFKC")
    .replace(/[4@]/g, "a").replace(/[1!|]/g, "i").replace(/0/g, "o").replace(/3/g, "e").replace(/[5$]/g, "s").replace(/7/g, "t");
  const words = t.split(/[^\p{L}\p{M}]+/u).filter(Boolean);
  const joined = squeeze(words.join(""));
  return words.some(w => WORDS.has(w) || WORDS.has(squeeze(w))) || PARTS.some(p => joined.includes(p));
}
// Nama samaran: 2–16 aksara, huruf (Rumi/Jawi), nombor dan ruang sahaja, tanpa perkataan kasar
export function cleanName(s) {
  const n = String(s || "").normalize("NFC").replace(/\s+/g, " ").trim();
  if (n.length < 2 || n.length > 16 || !/^[\p{L}\p{M}\p{N} ]+$/u.test(n)) throw new HttpError(400, "Nama samaran mesti 2–16 huruf atau nombor", "bad-name");
  if (rude(n)) throw new HttpError(400, "Nama ini tidak sesuai. Pilih nama yang sopan.", "rude-name");
  return n;
}

export function body(req) {
  if (req.body && typeof req.body === "object") return req.body;
  try { return JSON.parse(req.body || "{}"); } catch { return {}; }
}

// Pembalut pengendali: kod status, CORS asas dan ralat yang mesra
export function handler(methods, fn) {
  return async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    if (!methods.includes(req.method)) { res.setHeader("Allow", methods.join(", ")); return res.status(405).json({ error: "Kaedah tidak dibenarkan" }); }
    try {
      await ensureSchema();
      const out = await fn(req, res);
      if (!res.headersSent) res.status(200).json(out ?? {});
    } catch (e) {
      const status = e instanceof HttpError ? e.status : 500;
      if (status === 500) console.error(e);
      res.status(status).json(status === 500 ? { error: "Ralat pelayan" } : { error: e.message, code: e.code });
    }
  };
}
