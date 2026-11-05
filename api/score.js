// POST /api/score {subj, game, score, good, bad} -> simpan skor terbaik (mod Main Sendiri sahaja)
// Semakan asas supaya skor yang mustahil ditolak: had markah setiap jawapan betul dan had kekerapan.
import { db, userId, body, handler, HttpError, SUBJECTS, GAMES } from "./_lib.js";

export default handler(["POST"], async (req) => {
  const sql = db(), uid = await userId(req), b = body(req);
  const subj = String(b.subj), game = String(b.game);
  const score = Math.floor(Number(b.score)), good = Math.floor(Number(b.good)), bad = Math.floor(Number(b.bad));
  if (!SUBJECTS.includes(subj) || !GAMES.includes(game)) throw new HttpError(400, "Permainan tidak dikenali");
  // 60 saat: setiap jawapan betul maksimum 40 mata (kombo x4); Susun dapat +20 setiap urutan lengkap
  if (![score, good, bad].every(Number.isFinite) || score < 0 || good < 0 || bad < 0 || good > 150 || bad > 3
      || score % 10 !== 0 || score > good * 40 + (game === "climb" ? good * 20 : 0)) throw new HttpError(400, "Skor tidak sah");

  const [me] = await sql`select id from players where id = ${uid}`;
  if (!me) throw new HttpError(409, "Pilih nama samaran dahulu");
  const [last] = await sql`select extract(epoch from now() - at)::float as ago from plays where player = ${uid} order by at desc limit 1`;
  if (last && last.ago < 5) throw new HttpError(429, "Terlalu pantas, tunggu sebentar");
  await sql`insert into plays (player, subj, game, score) values (${uid}, ${subj}, ${game}, ${score})`;

  const [prev] = await sql`select best from scores where player = ${uid} and subj = ${subj} and game = ${game}`;
  const [row] = await sql`insert into scores (player, subj, game, best) values (${uid}, ${subj}, ${game}, ${score})
    on conflict (player, subj, game) do update set plays = scores.plays + 1,
      best = greatest(scores.best, excluded.best),
      updated_at = case when excluded.best > scores.best then now() else scores.updated_at end
    returning best`;
  const [{ rank }] = await sql`select count(*)::int + 1 as rank from scores where subj = ${subj} and game = ${game} and best > ${row.best}`;
  return { best: row.best, improved: !prev || score > prev.best, first: !prev, rank };
});
