// POST /api/class
//   {action:"create", name}          -> guru / ibu bapa cipta kelas, dapat kod 6 aksara
//   {action:"join", code}            -> murid sertai kelas dengan kod
//   {action:"leave", code}           -> keluar kelas (pemilik yang keluar akan memadam kelas)
//   {action:"rename", code, player, name} -> pemilik menukar nama murid (nama dikunci)
//   {action:"kick", code, player}    -> pemilik mengeluarkan murid daripada kelas
import { db, userId, body, handler, HttpError, cleanName, rude } from "./_lib.js";
import { profile } from "./me.js";

const ABC = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // tanpa huruf yang mengelirukan (0/O, 1/I/L)
const newCode = () => Array.from({ length: 6 }, () => ABC[Math.floor(Math.random() * ABC.length)]).join("");

export default handler(["POST"], async (req) => {
  const sql = db(), uid = await userId(req), b = body(req);
  const [me] = await sql`select id from players where id = ${uid}`;
  if (!me) throw new HttpError(409, "Pilih nama samaran dahulu", "no-name");
  const code = String(b.code || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  // tindakan pemilik: pastikan kelas milik pengguna ini dan murid ialah ahlinya
  const ownPupil = async () => {
    const [c] = await sql`select 1 from classes where code = ${code} and owner = ${uid}`;
    if (!c) throw new HttpError(403, "Hanya pemilik kelas boleh berbuat begini", "not-owner");
    const pid = String(b.player || "");
    if (pid === uid) throw new HttpError(400, "Tidak boleh pada diri sendiri");
    const [m] = await sql`select 1 from members where code = ${code} and player = ${pid}`;
    if (!m) throw new HttpError(404, "Murid tiada dalam kelas ini", "no-pupil");
    return pid;
  };

  if (b.action === "create") {
    const name = String(b.name || "").replace(/\s+/g, " ").trim().slice(0, 30);
    if (name.length < 2) throw new HttpError(400, "Nama kelas terlalu pendek", "bad-class");
    if (rude(name)) throw new HttpError(400, "Nama ini tidak sesuai. Pilih nama yang sopan.", "rude-name");
    const [{ n }] = await sql`select count(*)::int as n from classes where owner = ${uid}`;
    if (n >= 10) throw new HttpError(400, "Had 10 kelas bagi setiap guru", "class-limit");
    for (let i = 0; i < 5; i++) {
      const c = newCode();
      const r = await sql`insert into classes (code, name, owner) values (${c}, ${name}, ${uid}) on conflict do nothing returning code`;
      if (r.length) { await sql`insert into members (code, player) values (${c}, ${uid}) on conflict do nothing`; break; }
    }
  } else if (b.action === "join") {
    const [c] = await sql`select code from classes where code = ${code}`;
    if (!c) throw new HttpError(404, "Kod kelas tidak dijumpai", "no-class");
    const [{ n }] = await sql`select count(*)::int as n from members where player = ${uid}`;
    if (n >= 10) throw new HttpError(400, "Had 10 kelas", "class-limit");
    await sql`insert into members (code, player) values (${code}, ${uid}) on conflict do nothing`;
  } else if (b.action === "leave") {
    const del = await sql`delete from classes where code = ${code} and owner = ${uid} returning code`;
    if (!del.length) await sql`delete from members where code = ${code} and player = ${uid}`;
  } else if (b.action === "rename") {
    const pid = await ownPupil(), name = cleanName(b.name);
    await sql`update players set name = ${name}, locked = true where id = ${pid}`;
    return { ok: true };
  } else if (b.action === "kick") {
    const pid = await ownPupil();
    await sql`delete from members where code = ${code} and player = ${pid}`;
    return { ok: true };
  } else throw new HttpError(400, "Tindakan tidak dikenali");

  return profile(sql, uid);
});
