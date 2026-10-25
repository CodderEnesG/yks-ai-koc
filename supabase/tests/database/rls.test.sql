-- RLS testleri (T03). Çalıştırma: supabase test db
begin;
create extension if not exists pgtap with schema extensions;
select plan(19);

-- Her public tabloda RLS açık olmalı (AGENTS.md: RLS kapalı tablo olmaz).
select is(
  (select count(*)::int from pg_tables where schemaname = 'public' and not rowsecurity),
  0,
  'public şemasında RLS kapalı tablo yok'
);

-- İki öğrenci.
insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111', 'a@test.local'),
  ('22222222-2222-2222-2222-222222222222', 'b@test.local');

-- Katalog: service role (postgres) yazar.
insert into public.work (id, publisher, subject, exam, kind)
  values ('aaaaaaaa-0000-0000-0000-000000000001', 'MEB', 'Tarih', 'TYT', 'soru_bankasi');

-- A öğrencisi olarak.
set local role authenticated;
set local request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';

select lives_ok(
  $$insert into public.profile (id, birth_year, birth_month, grade, field, exam_date, weekday_minutes,
      consent_status, updated_at)
    values ('a0000000-0000-0000-0000-000000000001', 2008, 3, '12', 'SAY', '2027-06-19',
      '{120,120,120,120,120,240,240}', 'pending', now())$$,
  'A kendi profilini ekler (user_id varsayılanla auth.uid())'
);
select lives_ok(
  $$insert into public.library_item (id, source_kind, custom_edition, updated_at)
    values ('a0000000-0000-0000-0000-000000000002', 'book', '{"units": []}', now())$$,
  'A kendi kütüphane kaydını ekler'
);
select lives_ok(
  $$insert into public.plan_task (id, library_item_id, day, kind, range_first, range_last, est_seconds, updated_at)
    values ('a0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', '2026-11-02',
      'pages', 1, 30, 3600, now())$$,
  'A kendi kaynağına görev ekler'
);
select throws_ok(
  $$insert into public.profile (id, user_id, birth_year, birth_month, grade, field, exam_date, weekday_minutes,
      consent_status, updated_at)
    values ('a0000000-0000-0000-0000-000000000009', '22222222-2222-2222-2222-222222222222', 2008, 3, '12', 'SAY',
      '2027-06-19', '{60,60,60,60,60,60,60}', 'pending', now())$$,
  '42501', null,
  'A, B adına kayıt ekleyemez'
);
select is(
  (select server_updated_at > '2000-01-01' from public.profile where id = 'a0000000-0000-0000-0000-000000000001'),
  true,
  'server_updated_at sunucuda yazılır'
);
select ok((select count(*) from public.work where id = 'aaaaaaaa-0000-0000-0000-000000000001') = 1, 'öğrenci kataloğu okur');
select throws_ok(
  $$insert into public.work (publisher, subject, exam, kind) values ('X', 'Fizik', 'TYT', 'deneme')$$,
  '42501', null,
  'öğrenci kataloğa yazamaz'
);
select throws_ok(
  $$delete from public.profile where id = 'a0000000-0000-0000-0000-000000000001'$$,
  '42501', null,
  'öğrenci satır silemez (yalnız deleted_at)'
);

-- B öğrencisi olarak.
set local request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';

select is((select count(*)::int from public.profile), 0, 'B, A''nın profilini göremez');
select is((select count(*)::int from public.library_item), 0, 'B, A''nın kütüphanesini göremez');
select is((select count(*)::int from public.plan_task), 0, 'B, A''nın görevlerini göremez');
select is_empty(
  $$update public.profile set grade = 'mezun' where id = 'a0000000-0000-0000-0000-000000000001' returning id$$,
  'B, A''nın profilini güncelleyemez'
);
select lives_ok(
  $$insert into public.library_item (id, source_kind, custom_edition, updated_at)
    values ('b0000000-0000-0000-0000-000000000002', 'book', '{"units": []}', now())$$,
  'B kendi kütüphane kaydını ekler'
);
select throws_ok(
  $$insert into public.plan_task (id, library_item_id, day, kind, range_first, range_last, est_seconds, updated_at)
    values ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', '2026-11-02',
      'pages', 1, 10, 600, now())$$,
  '42501', null,
  'B, A''nın kaynağına görev bağlayamaz'
);
select throws_ok(
  $$update public.library_item set user_id = '11111111-1111-1111-1111-111111111111'
    where id = 'b0000000-0000-0000-0000-000000000002'$$,
  '42501', null,
  'sahiplik devredilemez'
);
select throws_ok(
  $$insert into public.checkin (id, day, note, updated_at)
    values ('b0000000-0000-0000-0000-000000000004', '2026-11-02', repeat('x', 501), now())$$,
  '23514', null,
  'check-in notu 500 karakterle sınırlı'
);

-- Giriş yapmamış (anon): katalog açık, öğrenci verisi kapalı.
reset request.jwt.claim.sub;
set local role anon;
select ok((select count(*) from public.work where id = 'aaaaaaaa-0000-0000-0000-000000000001') = 1, 'anon kataloğu okur');
select throws_ok(
  $$select count(*) from public.profile$$,
  '42501', null,
  'anon öğrenci tablolarına erişemez'
);

select * from finish();
rollback;
