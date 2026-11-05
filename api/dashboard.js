// GET /api/dashboard[?class=KOD] -> papan pemuka guru (pemilik kelas sahaja)
//   classes:  kelas milik guru (untuk pilihan)
//   pupils:   setiap murid — skor terbaik ikut subjek, bilangan main, aktiviti minggu ini, kali terakhir main
//   mistakes: soalan yang paling ramai murid salah jawab
//   activity: bilangan permainan sehari, 14 hari terakhir (waktu Malaysia)
import { db, userId, handler, HttpError } from "./_lib.js";

export default handler(["GET"], async (req) => {
  const sql = db(), uid = await userId(req), q = req.query || {};
  const classes = await sql`select c.code, c.name, (select count(*)::int from members m where m.code = c.code and m.player <> c.owner) as size
    from classes c where c.owner = ${uid} order by c.created_at`;
  if (!classes.length) return { classes, cls: null };
  const want = q.class ? String(q.class).toUpperCase() : classes[0].code;
  const cls = classes.find(c => c.code === want);
  if (!cls) throw new HttpError(403, "Hanya pemilik kelas boleh melihat papan pemuka ini", "not-owner");
  const code = cls.code;

  const pupils = await sql`
    with mem as (select m.player from members m where m.code = ${code} and m.player <> ${uid}),
    sub as (select s.player, s.subj, sum(s.best)::int as best, sum(s.plays)::int as plays from scores s where s.player in (select player from mem) group by s.player, s.subj),
    act as (select p.player, max(p.at) as last, count(*) filter (where p.at > now() - interval '7 days')::int as week from plays p where p.player in (select player from mem) group by p.player)
    select pl.id, pl.name, pl.locked,
      coalesce((select jsonb_object_agg(subj, jsonb_build_object('best', best, 'plays', plays)) from sub where sub.player = pl.id), '{}'::jsonb) as subj,
      coalesce((select sum(plays)::int from sub where sub.player = pl.id), 0) as plays,
      coalesce((select sum(best)::int from sub where sub.player = pl.id), 0) as total,
      act.last, coalesce(act.week, 0) as week
    from mem join players pl on pl.id = mem.player left join act on act.player = pl.id
    order by total desc, pl.name`;

  const mistakes = await sql`
    select x.subj, (array_agg(x.q))[1] as q, (array_agg(x.w))[1] as w, (array_agg(x.r) filter (where x.r is not null))[1] as r,
      count(distinct x.player)::int as pupils, sum(x.n)::int as times, max(x.last_at) as last
    from mistakes x where x.player in (select player from members where code = ${code} and player <> ${uid})
    group by x.subj, x.qkey, x.wkey
    order by pupils desc, times desc, last desc limit 15`;

  const activity = await sql`
    select to_char(date_trunc('day', p.at at time zone 'Asia/Kuala_Lumpur'), 'YYYY-MM-DD') as day, count(*)::int as n,
      count(distinct p.player)::int as pupils
    from plays p where p.player in (select player from members where code = ${code} and player <> ${uid})
      and p.at > now() - interval '14 days'
    group by 1 order by 1`;

  return { classes, cls, pupils, mistakes, activity };
});
