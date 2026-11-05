-- Skema leaderboard Zon Arked (Neon Postgres).
-- API juga mencipta jadual ini secara automatik pada panggilan pertama.
create table if not exists players (
  id text primary key,               -- id pengguna Clerk
  name text not null,                -- nama samaran (bukan nama sebenar)
  created_at timestamptz not null default now()
);
create table if not exists classes (
  code text primary key,             -- kod 6 aksara untuk murid sertai
  name text not null,
  owner text not null references players(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table if not exists members (
  code text not null references classes(code) on delete cascade,
  player text not null references players(id) on delete cascade,
  primary key (code, player)
);
create table if not exists scores (   -- skor terbaik setiap murid, ikut subjek & permainan
  player text not null references players(id) on delete cascade,
  subj text not null,
  game text not null,
  best int not null,
  plays int not null default 1,
  updated_at timestamptz not null default now(),
  primary key (player, subj, game)
);
create index if not exists scores_board on scores (subj, game, best desc);
create table if not exists plays (     -- log ringkas untuk had kekerapan hantar skor
  id bigserial primary key,
  player text not null,
  subj text not null,
  game text not null,
  score int not null,
  at timestamptz not null default now()
);
create index if not exists plays_player on plays (player, at desc);
