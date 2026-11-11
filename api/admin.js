// /api/admin — hanya untuk e-mel dalam ADMIN_EMAILS (pemboleh ubah Vercel)
//   GET                                   -> ringkasan kod & pembelian, 100 kod terkini
//   POST {action:"generate", year, count, note} -> jana kod pengaktifan (maks 500 sekali)
//   POST {action:"grant", email, year}    -> buka tahun terus untuk e-mel (contoh: bayaran manual)
//   POST {action:"delete", code}          -> padam kod yang belum digunakan
//   POST {action:"users", offset, q}      -> senarai pengguna (log masuk terkini dahulu) + statistik
import { db, userId, body, handler, HttpError, isAdmin, clerk, SELL_YEARS } from "./_lib.js";
import { normCode } from "./redeem.js";
import crypto from "node:crypto";

const ABC = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // tanpa 0/O, 1/I/L
const rand = n => Array.from(crypto.randomBytes(n), b => ABC[b % ABC.length]).join("");
const pretty = c => c.replace(/^(T\d)(.{4})(.{4})$/, "$1-$2-$3");

export default handler(["GET", "POST"], async (req) => {
  const sql = db(), uid = await userId(req);
  if (!(await isAdmin(uid))) throw new HttpError(403, "Bukan admin", "not-admin");
  if (req.method === "GET") {
    const summary = await sql`select y.year,
        (select count(*)::int from codes c where c.year = y.year) as codes,
        (select count(*)::int from codes c where c.year = y.year and c.used_by is not null) as used,
        (select count(*)::int from entitlements e where e.year = y.year) as owners
      from unnest(${SELL_YEARS}::int[]) as y(year) order by y.year`;
    const recent = await sql`select code, year, note, created_at, used_email, used_at from codes order by created_at desc, code limit 100`;
    const grants = await sql`select email, year, source, created_at from entitlements order by created_at desc limit 30`;
    return { summary, recent: recent.map(r => ({ ...r, code: pretty(r.code) })), grants };
  }
  const b = body(req), year = Math.floor(Number(b.year));
  if (b.action === "generate") {
    const count = Math.floor(Number(b.count)), note = String(b.note || "").trim().slice(0, 60) || null;
    if (!SELL_YEARS.includes(year)) throw new HttpError(400, "Tahun tidak sah");
    if (!(count >= 1 && count <= 500)) throw new HttpError(400, "Bilangan kod 1–500");
    const list = [...new Set(Array.from({ length: count }, () => `T${year}${rand(8)}`))];
    const made = await sql`insert into codes (code, year, note) select c, ${year}, ${note} from unnest(${list}::text[]) as c on conflict do nothing returning code`;
    return { codes: made.map(r => pretty(r.code)), year, note };
  }
  if (b.action === "grant") {
    const email = String(b.email || "").trim().toLowerCase();
    if (!SELL_YEARS.includes(year) || !/^[^@\s]+@[^@\s]+$/.test(email)) throw new HttpError(400, "E-mel atau tahun tidak sah");
    const res = await clerk().users.getUserList({ emailAddress: [email] });
    const user = (res.data || res)[0];
    if (!user) throw new HttpError(404, "Tiada akaun dengan e-mel ini. Minta pengguna log masuk sekali dahulu.", "no-user");
    await sql`insert into entitlements (player, year, source, email) values (${user.id}, ${year}, 'admin', ${email}) on conflict (player, year) do nothing`;
    return { ok: true, email, year };
  }
  if (b.action === "users") return users(sql, b);
  if (b.action === "delete") {
    const del = await sql`delete from codes where code = ${normCode(b.code)} and used_by is null returning code`;
    if (!del.length) throw new HttpError(400, "Kod tidak dijumpai atau sudah digunakan");
    return { ok: true };
  }
  throw new HttpError(400, "Tindakan tidak dikenali");
});

// ---------- Pengguna: data akaun dari Clerk + aktiviti & pembelian dari pangkalan data ----------
const PAGE = 50, DAY = 864e5;
const list = r => (r && r.data) || r || [];
const emailOf = u => { const p = (u.emailAddresses || []).find(e => e.id === u.primaryEmailAddressId) || (u.emailAddresses || [])[0]; return p ? p.emailAddress : ""; };

async function users(sql, b) {
  const c = clerk();
  const offset = Math.max(0, Math.floor(Number(b.offset) || 0));
  const q = String(b.q || "").trim().slice(0, 80);
  const page = await c.users.getUserList({ limit: PAGE, offset, orderBy: "-last_sign_in_at", ...(q ? { query: q } : {}) });
  const rows = list(page);
  const total = (page && typeof page.totalCount === "number") ? page.totalCount : rows.length;

  // statistik (tanpa carian): imbas pengguna ikut log masuk terkini sehingga lebih 30 hari (had 1000)
  let stats = null;
  if (!q) {
    const now = Date.now(); stats = { total, today: 0, d7: 0, d30: 0, new7: 0, buyers: 0 };
    for (let off = 0; off < 1000; off += 100) {
      const batch = off === 0 && offset === 0 && PAGE >= 100 ? rows : list(await c.users.getUserList({ limit: 100, offset: off, orderBy: "-last_sign_in_at" }));
      for (const u of batch) {
        const t = u.lastSignInAt || 0;
        if (now - t < DAY) stats.today++;
        if (now - t < 7 * DAY) stats.d7++;
        if (now - t < 30 * DAY) stats.d30++;
        if (now - (u.createdAt || 0) < 7 * DAY) stats.new7++;
      }
      if (batch.length < 100 || now - (batch[batch.length - 1].lastSignInAt || 0) >= 30 * DAY) break;
    }
    const [{ n }] = await sql`select count(distinct player)::int as n from entitlements`;
    stats.buyers = n;
  }

  const ids = rows.map(u => u.id);
  const [names, owns, acts] = ids.length ? await Promise.all([
    sql`select id, name from players where id = any(${ids})`,
    sql`select player, array_agg(year order by year) as years from entitlements where player = any(${ids}) group by player`,
    sql`select player, count(*)::int as plays, max(at) as last_play from plays where player = any(${ids}) group by player`,
  ]) : [[], [], []];
  const by = (arr, k) => Object.fromEntries(arr.map(r => [r[k], r]));
  const N = by(names, "id"), O = by(owns, "player"), A = by(acts, "player");
  const out = rows.map(u => ({
    id: u.id,
    email: emailOf(u),
    name: [u.firstName, u.lastName].filter(Boolean).join(" "),
    nick: N[u.id] ? N[u.id].name : null,
    img: u.imageUrl || null,
    created: u.createdAt || null,
    lastSignIn: u.lastSignInAt || null,
    lastActive: u.lastActiveAt || null,
    years: O[u.id] ? O[u.id].years : [],
    plays: A[u.id] ? A[u.id].plays : 0,
    lastPlay: A[u.id] ? A[u.id].last_play : null,
  }));
  return { users: out, total, offset, page: PAGE, q, stats };
}
