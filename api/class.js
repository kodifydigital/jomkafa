// POST /api/class
//   {action:"create", name}  -> guru cipta kelas, dapat kod 6 aksara
//   {action:"join", code}    -> murid sertai kelas dengan kod
//   {action:"leave", code}   -> keluar kelas (pemilik yang keluar akan memadam kelas)
import { db, userId, body, handler, HttpError } from "./_lib.js";
import { profile } from "./me.js";

const ABC = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // tanpa huruf yang mengelirukan (0/O, 1/I/L)
const newCode = () => Array.from({ length: 6 }, () => ABC[Math.floor(Math.random() * ABC.length)]).join("");

export default handler(["POST"], async (req) => {
  const sql = db(), uid = await userId(req), b = body(req);
  const [me] = await sql`select id from players where id = ${uid}`;
  if (!me) throw new HttpError(409, "Pilih nama samaran dahulu");
  const code = String(b.code || "").toUpperCase().replace(/[^A-Z0-9]/g, "");

  if (b.action === "create") {
    const name = String(b.name || "").replace(/\s+/g, " ").trim().slice(0, 30);
    if (name.length < 2) throw new HttpError(400, "Nama kelas terlalu pendek");
    const [{ n }] = await sql`select count(*)::int as n from classes where owner = ${uid}`;
    if (n >= 10) throw new HttpError(400, "Had 10 kelas bagi setiap guru");
    for (let i = 0; i < 5; i++) {
      const c = newCode();
      const r = await sql`insert into classes (code, name, owner) values (${c}, ${name}, ${uid}) on conflict do nothing returning code`;
      if (r.length) { await sql`insert into members (code, player) values (${c}, ${uid}) on conflict do nothing`; break; }
    }
  } else if (b.action === "join") {
    const [c] = await sql`select code from classes where code = ${code}`;
    if (!c) throw new HttpError(404, "Kod kelas tidak dijumpai");
    const [{ n }] = await sql`select count(*)::int as n from members where player = ${uid}`;
    if (n >= 10) throw new HttpError(400, "Had 10 kelas");
    await sql`insert into members (code, player) values (${code}, ${uid}) on conflict do nothing`;
  } else if (b.action === "leave") {
    const del = await sql`delete from classes where code = ${code} and owner = ${uid} returning code`;
    if (!del.length) await sql`delete from members where code = ${code} and player = ${uid}`;
  } else throw new HttpError(400, "Tindakan tidak dikenali");

  return profile(sql, uid);
});
