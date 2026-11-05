// /api/admin — hanya untuk e-mel dalam ADMIN_EMAILS (pemboleh ubah Vercel)
//   GET                                   -> ringkasan kod & pembelian, 100 kod terkini
//   POST {action:"generate", year, count, note} -> jana kod pengaktifan (maks 500 sekali)
//   POST {action:"grant", email, year}    -> buka tahun terus untuk e-mel (contoh: bayaran manual)
//   POST {action:"delete", code}          -> padam kod yang belum digunakan
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
  if (b.action === "delete") {
    const del = await sql`delete from codes where code = ${normCode(b.code)} and used_by is null returning code`;
    if (!del.length) throw new HttpError(400, "Kod tidak dijumpai atau sudah digunakan");
    return { ok: true };
  }
  throw new HttpError(400, "Tindakan tidak dikenali");
});
