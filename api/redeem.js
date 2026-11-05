// POST /api/redeem {code} -> tebus kod pengaktifan; tahun itu dibuka seumur hidup untuk akaun ini
import { db, userId, body, handler, HttpError, userEmails } from "./_lib.js";
import { profile } from "./me.js";

export const normCode = c => String(c || "").toUpperCase().replace(/[^A-Z0-9]/g, "");

export default handler(["POST"], async (req) => {
  const sql = db(), uid = await userId(req), code = normCode(body(req).code);
  // had cubaan salah: 10 sejam bagi setiap akaun
  const [{ n }] = await sql`select count(*)::int as n from redeem_fails where player = ${uid} and at > now() - interval '1 hour'`;
  if (n >= 10) throw new HttpError(429, "Terlalu banyak cubaan. Cuba lagi selepas sejam.", "too-many");
  const [c] = code.length >= 8 ? await sql`select code, year, used_by from codes where code = ${code}` : [];
  if (!c) { await sql`insert into redeem_fails (player) values (${uid})`; throw new HttpError(404, "Kod tidak sah", "bad-code"); }
  if (c.used_by && c.used_by !== uid) throw new HttpError(409, "Kod ini telah digunakan", "code-used");
  let email = null; try { email = (await userEmails(uid))[0] || null; } catch {}
  // tandakan kod digunakan hanya jika belum digunakan (selamat jika ditekan serentak)
  const took = c.used_by === uid ? [c] : await sql`update codes set used_by = ${uid}, used_email = ${email}, used_at = now() where code = ${code} and used_by is null returning code`;
  if (!took.length) throw new HttpError(409, "Kod ini telah digunakan", "code-used");
  const [had] = await sql`select 1 from entitlements where player = ${uid} and year = ${c.year}`;
  await sql`insert into entitlements (player, year, source, code, email) values (${uid}, ${c.year}, 'code', ${code}, ${email}) on conflict (player, year) do nothing`;
  return { year: c.year, already: !!had, ...(await profile(sql, uid)) };
});
