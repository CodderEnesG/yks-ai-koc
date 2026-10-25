-- Şema v1 (T03): katalog ve öğrencinin senkronlanan tabloları. Rapor 2.5, TECH-STACK "Yerel veri ve sync".
--
-- Kurallar:
-- * Her tabloda RLS açık. Katalog herkese okunur, yalnız service role (editör paneli) yazar.
-- * Kullanıcı tabloları yalnız sahibine açık; satır silinmez, `deleted_at` ile işaretlenir.
-- * Kullanıcı kayıtlarının kimliği cihazda üretilir (çevrimdışı oluşturulup sonra gönderilir).
-- * `updated_at` istemcinin zamanıdır (son yazan kazanır); `server_updated_at` sunucuda tetikleyiciyle
--   yazılır ve çekme imleci olarak kullanılır (istemci saatine güvenilmez).
-- * Paylaşılan katalogda ham içindekiler başlığı tutulmaz (değişmez kural); yalnız olgular.
-- * Varsayılan yetkiler geri alınır, erişim yalnız aşağıdaki açık GRANT'larla verilir (yetki + RLS).

-- Ortak: sunucu zamanını yazan tetikleyici.
create function public.set_server_updated_at() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.server_updated_at := now();
  return new;
end;
$$;

------------------------------------------------------------------------------------------------------
-- Katalog (paylaşılan, salt okunur)
------------------------------------------------------------------------------------------------------

create type public.exam_kind as enum ('TYT', 'AYT', 'YDT');
create type public.curriculum_version as enum ('MEB-2027', 'MAARIF-2028');

-- Konu taksonomisi. İki müfredat sürümü ilk günden ayrı satırlarla taşınır (rapor 2.1, ilke 5).
create table public.topic (
  id uuid primary key default gen_random_uuid(),
  curriculum public.curriculum_version not null,
  subject text not null,
  parent_id uuid references public.topic (id),
  name text not null,
  meb_code text,
  exam_weight numeric(4, 3) check (exam_weight between 0 and 1)
);

-- Eser: baskıdan bağımsız kitap kimliği.
create table public.work (
  id uuid primary key default gen_random_uuid(),
  publisher text not null,
  series text,
  subject text not null,
  exam public.exam_kind not null,
  kind text not null check (kind in ('soru_bankasi', 'konu_anlatimi', 'deneme', 'karma'))
);

-- Baskı. Anahtar yalnız ISBN olamaz (fizibilite; MEB 3 Adım serisinde dersler takım ISBN'i paylaşıyor):
-- ISBN + basım yılı + sayfa sayısı + eser.
create table public.edition (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references public.work (id),
  isbn text check (isbn ~ '^[0-9]{9,13}X?$'),
  print_year smallint check (print_year between 2000 and 2100),
  page_count smallint not null check (page_count > 0),
  curriculum public.curriculum_version not null,
  source text not null,
  status text not null default 'draft' check (status in ('draft', 'verified')),
  verified_by text,
  unique (work_id, isbn, print_year, page_count)
);
create index edition_isbn_idx on public.edition (isbn);

-- Baskının birimleri; ham başlık yok, konu eşlemesi var.
create table public.unit (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid not null references public.edition (id),
  seq smallint not null check (seq > 0),
  page_start smallint not null check (page_start > 0),
  page_end smallint not null,
  test_count smallint check (test_count >= 0),
  topic_id uuid references public.topic (id),
  est_minutes smallint check (est_minutes > 0),
  check (page_end >= page_start),
  unique (edition_id, seq)
);

------------------------------------------------------------------------------------------------------
-- Öğrenci (yalnız sahibine açık, cihazla senkronlanır)
------------------------------------------------------------------------------------------------------

-- Kurulum profili (T09). Cihazdaki SQLite `profile` tablosunun sunucu karşılığı.
create table public.profile (
  id uuid primary key,
  user_id uuid not null unique default auth.uid() references auth.users (id) on delete cascade,
  birth_year smallint not null check (birth_year between 1950 and 2100),
  birth_month smallint not null check (birth_month between 1 and 12),
  grade text not null check (grade in ('11', '12', 'mezun')),
  field text not null check (field in ('SAY', 'EA', 'SOZ', 'DIL')),
  target_kind text check (target_kind in ('siralama', 'puan')),
  target_value numeric(9, 2),
  exam_date date not null,
  weekday_minutes smallint[] not null check (
    cardinality(weekday_minutes) = 7 and 0 <= all (weekday_minutes) and 720 >= all (weekday_minutes)
  ),
  consent_status text not null check (consent_status in ('not_required', 'pending', 'granted', 'withdrawn')),
  updated_at timestamptz not null,
  server_updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  check ((target_kind is null) = (target_value is null))
);

-- Öğrencinin kaynakları: katalog baskısı, özel baskı (yalnız ona açık) ya da YouTube oynatma listesi.
create table public.library_item (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  source_kind text not null check (source_kind in ('book', 'playlist')),
  edition_id uuid references public.edition (id),
  -- Özel baskı: içindekilerden ya da "hızlı ekle" ile girilen birimler. Ham başlık yalnız burada durur.
  custom_edition jsonb,
  yt_playlist_id text,
  sort_order integer not null default 0,
  priority smallint not null default 0,
  status text not null default 'active' check (status in ('active', 'paused', 'done')),
  watch_speed numeric(3, 2) check (watch_speed in (1, 1.25, 1.5, 2)),
  note_ratio numeric(3, 2) check (note_ratio between 0 and 1),
  updated_at timestamptz not null,
  server_updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  check (
    (source_kind = 'book' and yt_playlist_id is null and (edition_id is null) <> (custom_edition is null))
    or (source_kind = 'playlist' and yt_playlist_id is not null and edition_id is null and custom_edition is null)
  )
);
create index library_item_user_idx on public.library_item (user_id, server_updated_at);

-- Plan motorunun ürettiği günlük görevler. Geçmiş görevler değişmez (rapor 2.6).
create table public.plan_task (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  library_item_id uuid not null references public.library_item (id),
  day date not null,
  kind text not null check (kind in ('pages', 'tests', 'video')),
  -- Katalog birimi ya da özel baskıdaki birimin anahtarı.
  unit_id uuid references public.unit (id),
  custom_unit_key text,
  range_first integer,
  range_last integer,
  video_id text,
  est_seconds integer not null check (est_seconds >= 0),
  status text not null default 'planned' check (status in ('planned', 'done', 'partial', 'skipped')),
  reason text check (reason in ('zaman_yetmedi', 'konu_zor', 'isteksiz', 'kotu_hissediyorum')),
  updated_at timestamptz not null,
  server_updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  check (
    (kind = 'video' and video_id is not null and range_first is null and range_last is null)
    or (kind <> 'video' and video_id is null and range_first is not null and range_last >= range_first)
  )
);
create index plan_task_user_idx on public.plan_task (user_id, server_updated_at);
create index plan_task_day_idx on public.plan_task (user_id, day);

-- Akşam check-in'i: günün özeti; görev bazlı durum plan_task'ta.
create table public.checkin (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  day date not null,
  correct_count integer check (correct_count >= 0),
  wrong_count integer check (wrong_count >= 0),
  reason text check (reason in ('zaman_yetmedi', 'konu_zor', 'isteksiz', 'kotu_hissediyorum')),
  note text check (char_length(note) <= 500),
  updated_at timestamptz not null,
  server_updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (user_id, day)
);

------------------------------------------------------------------------------------------------------
-- Tetikleyiciler, RLS ve yetkiler
------------------------------------------------------------------------------------------------------

do $$
declare
  t text;
begin
  foreach t in array array['profile', 'library_item', 'plan_task', 'checkin'] loop
    execute format(
      'create trigger %1$s_server_updated_at before insert or update on public.%1$I
         for each row execute function public.set_server_updated_at()',
      t
    );
    execute format('alter table public.%I enable row level security', t);
    -- Sahibi okur, ekler, günceller; silme yok (deleted_at ile işaretlenir). Sahiplik devredilemez.
    execute format(
      'create policy %1$s_select_own on public.%1$I for select to authenticated
         using ((select auth.uid()) = user_id)',
      t
    );
    execute format(
      'create policy %1$s_insert_own on public.%1$I for insert to authenticated
         with check ((select auth.uid()) = user_id)',
      t
    );
    execute format(
      'create policy %1$s_update_own on public.%1$I for update to authenticated
         using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)',
      t
    );
    -- Supabase'in varsayılan "her role her yetki" ayarı geri alınır; yetki ve RLS iki ayrı katman olur.
    execute format('revoke all on public.%I from anon, authenticated', t);
    execute format('grant select, insert, update on public.%I to authenticated', t);
  end loop;

  -- Katalog: herkes okur (rapor 2.11: onaydan önce de katalog araması yapılabilir; kişisel veri yok),
  -- yazma yalnız service role ile (editör paneli, RLS'i atlar).
  foreach t in array array['topic', 'work', 'edition', 'unit'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy %1$s_read_all on public.%1$I for select to anon, authenticated using (true)',
      t
    );
    execute format('revoke all on public.%I from anon, authenticated', t);
    execute format('grant select on public.%I to anon, authenticated', t);
  end loop;
end;
$$;

-- Yabancı anahtar kontrolü RLS'i atlar: görev yalnız öğrencinin kendi kaynağına bağlanabilir.
create policy plan_task_own_library_item on public.plan_task as restrictive for all to authenticated
  using (
    exists (
      select 1 from public.library_item li
      where li.id = library_item_id and li.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.library_item li
      where li.id = library_item_id and li.user_id = (select auth.uid())
    )
  );

-- Data API kullanıcıları dışındaki rollerin tetikleyici fonksiyonunu çağırması gerekmiyor.
revoke execute on function public.set_server_updated_at() from public, anon, authenticated;
