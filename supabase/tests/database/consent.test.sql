-- Veli onayı (T21). Çalıştırma: supabase test db
begin;
create extension if not exists pgtap with schema extensions;
select plan(25);

insert into auth.users (id, email) values
  ('66666666-6666-6666-6666-666666666666', 'veli@test.local'),
  ('77777777-7777-7777-7777-777777777777', 'ogrenci@test.local'),
  ('88888888-8888-8888-8888-888888888888', 'baska@test.local');

-- 1. Öğrenci hesapsız (anon) istek açar.
set local role anon;
select lives_ok(
  $$select public.create_consent_request(repeat('a', 43), ' Veli@Test.local ')$$,
  'anon onay isteği açar'
);
select throws_ok(
  $$select public.create_consent_request('kisa', 'veli@test.local')$$,
  '22023', 'invalid_token', 'kısa kod reddedilir'
);
select is((select status from public.consent_request_status(repeat('a', 43))), 'pending', 'durum: bekliyor');
select is_empty($$select * from public.consent_request_status(repeat('b', 43))$$, 'bilinmeyen kod: satır yok');
select is(
  (select parent_email_hint from public.consent_request_view(repeat('a', 43))),
  've***@test.local',
  'web sayfası e-postayı maskeli görür'
);
select throws_ok($$select * from public.consent_request$$, '42501', null, 'anon tabloyu okuyamaz');
select throws_ok(
  $$select public.grant_consent(repeat('a', 43), 'Ayşe Yılmaz', true, true, 'taslak-1')$$,
  '42501', null, 'anon onay veremez'
);

-- 2. Reşit olmayan öğrenci onaydan önce hesap açsa bile sunucu verisini kabul etmez.
set local role authenticated;
set local request.jwt.claims = '{"sub": "77777777-7777-7777-7777-777777777777", "email": "ogrenci@test.local"}';
select throws_ok(
  $$insert into public.profile (id, birth_year, birth_month, grade, field, exam_date, weekday_minutes,
      consent_status, updated_at)
    values ('b0000000-0000-0000-0000-000000000001', 2010, 5, '11', 'SAY', '2027-06-19',
      '{60,60,60,60,60,60,60}', 'pending', now())$$,
  '42501', null,
  'onaysız 18 yaş altı profil sunucuya yazılamaz'
);
select throws_ok(
  $$insert into public.library_item (id, source_kind, custom_edition, updated_at)
    values ('b0000000-0000-0000-0000-000000000002', 'book', '{"units": []}', now())$$,
  '42501', null,
  'profilsiz kütüphane kaydı yazılamaz'
);
select is(public.claim_consent(repeat('a', 43)), false, 'onay gelmeden bağlanamaz');

-- 3. Veli: yanlış hesapla onay veremez; kendi e-postasıyla verir.
set local request.jwt.claims = '{"sub": "88888888-8888-8888-8888-888888888888", "email": "baska@test.local"}';
select throws_ok(
  $$select public.grant_consent(repeat('a', 43), 'Ayşe Yılmaz', true, true, 'taslak-1')$$,
  '42501', 'email_mismatch', 'başka e-posta onay veremez'
);
set local request.jwt.claims = '{"sub": "66666666-6666-6666-6666-666666666666", "email": "veli@test.local"}';
set local request.headers = '{"x-forwarded-for": "203.0.113.7, 10.0.0.1"}';
select throws_ok(
  $$select public.grant_consent(repeat('a', 43), 'Ayşe Yılmaz', false, true, 'taslak-1')$$,
  '22023', 'ai_consent_required', 'AI ve yurt dışı aktarım rızası zorunlu'
);
select lives_ok(
  $$select public.grant_consent(repeat('a', 43), 'Ayşe Yılmaz', true, false, 'taslak-1')$$,
  'veli onay verir (rapor rızası olmadan)'
);
select throws_ok(
  $$select public.grant_consent(repeat('a', 43), 'Ayşe Yılmaz', true, true, 'taslak-1')$$,
  '22023', 'not_pending', 'ikinci kez onay verilemez'
);
select is(public.claim_consent(repeat('a', 43)), false, 'veli hesabı öğrenci olarak bağlanamaz');

reset role;
select is(
  (select array_agg(kind order by kind) from public.consent),
  array['ai_yurt_disi', 'aydinlatma'],
  'rızalar ayrı satırlar; rapor rızası verilmedi'
);
select ok(
  (select bool_and(ip_hash is not null and evidence_hash !~ 'Ayşe') from public.consent),
  'IP ve ad açık tutulmaz, hash tutulur'
);

-- 4. Öğrenci hesabını bağlar; artık verisi sunucuya yazılabilir.
set local role authenticated;
set local request.jwt.claims = '{"sub": "77777777-7777-7777-7777-777777777777", "email": "ogrenci@test.local"}';
select is(public.claim_consent(repeat('a', 43)), true, 'öğrenci onayı hesabına bağlar');
select lives_ok(
  $$insert into public.profile (id, birth_year, birth_month, grade, field, exam_date, weekday_minutes,
      consent_status, updated_at)
    values ('b0000000-0000-0000-0000-000000000001', 2010, 5, '11', 'SAY', '2027-06-19',
      '{60,60,60,60,60,60,60}', 'granted', now())$$,
  'onaylı 18 yaş altı profil yazılır'
);
select lives_ok(
  $$insert into public.library_item (id, source_kind, custom_edition, updated_at)
    values ('b0000000-0000-0000-0000-000000000002', 'book', '{"units": []}', now())$$,
  'onaylı öğrencinin kütüphanesi yazılır'
);
set local request.jwt.claims = '{"sub": "88888888-8888-8888-8888-888888888888", "email": "baska@test.local"}';
select is(public.claim_consent(repeat('a', 43)), false, 'başka öğrenci aynı onayı alamaz');

-- 5. Veli geri çeker: öğrencinin sunucu hesabı ve verisi silinir, rıza kayıtları kalır.
set local request.jwt.claims = '{"sub": "66666666-6666-6666-6666-666666666666", "email": "veli@test.local"}';
select lives_ok($$select public.withdraw_consent(repeat('a', 43))$$, 'veli rızayı geri çeker');
reset role;
select is_empty(
  $$select 1 from auth.users where id = '77777777-7777-7777-7777-777777777777'$$,
  'öğrencinin sunucu hesabı silindi'
);
select is_empty(
  $$select 1 from public.profile where id = 'b0000000-0000-0000-0000-000000000001'$$,
  'öğrencinin profili silindi'
);
select ok(
  (select count(*) = 2 and bool_and(withdrawn_at is not null) from public.consent),
  'rıza kayıtları geri çekilme zamanıyla kalır'
);

select * from finish();
rollback;
