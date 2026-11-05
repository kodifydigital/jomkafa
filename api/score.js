// POST /api/score {subj, game, score, good, bad} -> simpan skor terbaik (mod Main Sendiri sahaja)
// Semakan asas supaya skor yang mustahil ditolak: had markah setiap jawapan betul dan had kekerapan.
import { db, userId, body, handler, HttpError, SUBJECTS, GAMES } from "./_lib.js";

// teks soalan/jawapan: rentetan (al-Quran/Arab) atau [Rumi, Jawi]
const txt = v => typeof v === "string" ? v.length <= 200 : Array.isArray(v) && v.length === 2 && v.every(x => typeof x === "string" && x.length <= 200);
const key = v => Array.isArray(v) ? v[0] : v;
function mistakes(list, subj) {
  if (!Array.isArray(list)) return [];
  const seen = new Set(), out = [];
  for (const m of list.slice(0, 20)) {
    if (!m || !Array.isArray(m.p) || !txt(m.p) || !txt(m.it) || (m.right != null && !txt(m.right))) continue;
    const s = subj === "mix" && SUBJECTS.includes(m.s) && m.s !== "mix" ? m.s : subj;
    const k = `${s}|${key(m.p)}|${key(m.it)}`; if (seen.has(k)) continue; seen.add(k);
    out.push({ s, qk: key(m.p), wk: key(m.it), q: m.p, w: m.it, r: m.right ?? null });
  }
  return out;
}

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
  // kesilapan (untuk papan pemuka guru): soalan, jawapan salah, jawapan betul
  const ms = mistakes(b.mistakes, subj);
  if (ms.length) await sql`insert into mistakes (player, subj, qkey, wkey, q, w, r)
    select ${uid}, e->>'s', e->>'qk', e->>'wk', e->'q', e->'w', e->'r' from jsonb_array_elements(${JSON.stringify(ms)}::jsonb) e
    on conflict (player, subj, qkey, wkey) do update set n = mistakes.n + 1, last_at = now(), r = coalesce(excluded.r, mistakes.r)`;

  const [{ rank }] = await sql`select count(*)::int + 1 as rank from scores where subj = ${subj} and game = ${game} and best > ${row.best}`;
  return { best: row.best, improved: !prev || score > prev.best, first: !prev, rank };
});
