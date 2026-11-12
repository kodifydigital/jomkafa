// GET /api/leaderboard?subj=sirah&game=whack[&class=KOD][&y=1]
//   game=all -> jumlah skor terbaik semua permainan Zon Arked tahun y (lalai 3) dalam subjek itu (Juara Subjek)
//   class    -> kedudukan dalam kelas (perlu log masuk dan menjadi ahli kelas)
import { db, userId, handler, HttpError, SUBJECTS, GAMES, YEAR_GAMES } from "./_lib.js";

export default handler(["GET"], async (req) => {
  const sql = db(), q = req.query || {};
  const subj = String(q.subj), game = String(q.game), code = q.class ? String(q.class).toUpperCase() : null;
  if (!SUBJECTS.includes(subj) || !(GAMES.includes(game) || game === "all")) throw new HttpError(400, "Permainan tidak dikenali");
  const uid = await userId(req, !!code);
  if (code) {
    const [m] = await sql`select 1 from members where code = ${code} and player = ${uid}`;
    if (!m) throw new HttpError(403, "Kamu bukan ahli kelas ini");
  }
  const all = game === "all", me = uid ?? "", yg = YEAR_GAMES[Number(q.y)] || YEAR_GAMES[3];
  // kedudukan setiap pemain; skor sama -> yang lebih awal mencapainya di atas
  const rows = await sql`
    with board as (
      select s.player, sum(s.best)::int as best, max(s.updated_at) as at
      from scores s
      where s.subj = ${subj} and ((${all} and s.game = any(${yg})) or s.game = ${game})
        and (${code}::text is null or s.player in (select player from members where code = ${code}))
      group by s.player
    ), ranked as (
      select b.player, b.best, rank() over (order by b.best desc) as rank,
        row_number() over (order by b.best desc, b.at asc) as pos, count(*) over () as total
      from board b where b.best > 0
    )
    select r.rank::int as rank, r.best, p.name, (r.player = ${me}) as me, r.pos::int as pos, r.total::int as total
    from ranked r join players p on p.id = r.player
    where r.pos <= 20 or r.player = ${me}
    order by r.pos`;
  const mine = rows.find(r => r.me);
  return {
    rows: rows.filter(r => r.pos <= 20).map(r => ({ rank: r.rank, name: r.name, best: r.best, me: r.me })),
    me: mine ? { rank: mine.rank, best: mine.best } : null,
    total: rows.length ? rows[0].total : 0
  };
});
