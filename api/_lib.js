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
    })().catch(e => { ready = null; throw e; });
  }
  return ready;
}

export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
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
    if (required) throw new HttpError(401, "Sesi tidak sah, sila log masuk semula");
    return null;
  }
}

// Nama samaran: 2–16 aksara, huruf (Rumi/Jawi), nombor dan ruang sahaja
export function cleanName(s) {
  const n = String(s || "").normalize("NFC").replace(/\s+/g, " ").trim();
  if (n.length < 2 || n.length > 16 || !/^[\p{L}\p{M}\p{N} ]+$/u.test(n)) throw new HttpError(400, "Nama samaran mesti 2–16 huruf atau nombor");
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
      res.status(status).json({ error: status === 500 ? "Ralat pelayan" : e.message });
    }
  };
}
