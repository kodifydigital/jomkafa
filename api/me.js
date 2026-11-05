// GET  /api/me            -> profil murid (nama samaran) dan kelas yang disertai
// POST /api/me {name}     -> cipta / tukar nama samaran
import { db, userId, cleanName, body, handler } from "./_lib.js";

export async function profile(sql, uid) {
  const [p] = await sql`select name from players where id = ${uid}`;
  const classes = await sql`select c.code, c.name, (c.owner = ${uid}) as owner,
      (select count(*)::int from members x where x.code = c.code) as size
    from members m join classes c on c.code = m.code where m.player = ${uid} order by c.created_at`;
  return { player: p ? { name: p.name } : null, classes };
}

export default handler(["GET", "POST"], async (req) => {
  const sql = db(), uid = await userId(req);
  if (req.method === "POST") {
    const name = cleanName(body(req).name);
    await sql`insert into players (id, name) values (${uid}, ${name}) on conflict (id) do update set name = excluded.name`;
  }
  return profile(sql, uid);
});
