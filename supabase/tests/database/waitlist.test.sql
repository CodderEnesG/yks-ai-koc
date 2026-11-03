-- Bekleme listesi (T40). Çalıştırma: supabase test db
begin;
create extension if not exists pgtap with schema extensions;
select plan(18);

select ok(
  (select rowsecurity from pg_tables where schemaname = 'public' and tablename = 'waitlist_entry'),
  'waitlist_entry RLS açık'
);
select ok(
  (select rowsecurity from pg_tables where schemaname = 'public' and tablename = 'waitlist_salt'),
  'waitlist_salt RLS açık'
);

set local role anon;
set local request.headers = '{"x-forwarded-for": "198.51.100.4, 10.0.0.1"}';

select lives_ok(
  $$select public.join_waitlist(' Ogrenci@Test.local ', 'ogrenci_18', '12', 'taslak-1')$$,
  'anon listeye katılır'
);
select lives_ok(
  $$select public.join_waitlist('ogrenci@test.local', 'veli', null, 'taslak-1')$$,
  'aynı e-posta ikinci kez hata vermez'
);
select throws_ok($$select * from public.waitlist_entry$$, '42501', null, 'anon tabloyu okuyamaz');
select throws_ok(
  $$insert into public.waitlist_entry (email, role, notice_version) values ('x@test.local', 'veli', 't')$$,
  '42501', null, 'anon tabloya doğrudan yazamaz'
);
select throws_ok($$select * from public.waitlist_salt$$, '42501', null, 'anon tuzu okuyamaz');
select throws_ok(
  $$select public.join_waitlist('gecersiz', 'veli', null, 'taslak-1')$$,
  '22023', 'invalid_email', 'geçersiz e-posta reddedilir'
);
select throws_ok(
  $$select public.join_waitlist('kucuk@test.local', 'ogrenci', '11', 'taslak-1')$$,
  '22023', 'invalid_role', '18 yaş altı öğrenci rolü yok'
);
select throws_ok(
  $$select public.join_waitlist('ogretmen@test.local', 'ogretmen', '12', 'taslak-1')$$,
  '22023', 'invalid_grade', 'öğretmende sınıf olmaz'
);
select throws_ok(
  $$select public.join_waitlist('veli@test.local', 'veli', '9', 'taslak-1')$$,
  '22023', 'invalid_grade', 'bilinmeyen sınıf reddedilir'
);
select throws_ok(
  $$select public.join_waitlist('veli@test.local', 'veli', null, '')$$,
  '22023', 'invalid_notice', 'aydınlatma sürümü zorunlu'
);
select lives_ok(
  $$select public.join_waitlist('bot@test.local', 'veli', null, 'taslak-1', 'http://spam')$$,
  'bal tuzağı dolu istek hata vermeden döner'
);
reset role;

select is(
  (select count(*)::int from public.waitlist_entry where email = 'ogrenci@test.local'),
  1, 'tekrar eden e-posta tek satır; küçük harfe çevrildi'
);
select is(
  (select role from public.waitlist_entry where email = 'ogrenci@test.local'),
  'ogrenci_18', 'ilk kayıt değişmedi'
);
select is_empty($$select 1 from public.waitlist_entry where email = 'bot@test.local'$$, 'tuzak satır açmadı');
select isnt(
  (select ip_hash from public.waitlist_entry where email = 'ogrenci@test.local'),
  null::text, 'IP açık değil, hash olarak durur'
);

-- Hız sınırı: aynı IP'den saatte 5 kayıt (ilk kayıt dahil).
set local role anon;
set local request.headers = '{"x-forwarded-for": "198.51.100.4"}';
do $$ begin
  perform public.join_waitlist('a' || i || '@test.local', 'veli', null, 'taslak-1') from generate_series(1, 4) i;
end $$;
select throws_ok(
  $$select public.join_waitlist('fazla@test.local', 'veli', null, 'taslak-1')$$,
  'P0001', 'rate_limited', 'aynı IP saatte 5 kaydı geçemez'
);
reset role;

select * from finish();
rollback;
