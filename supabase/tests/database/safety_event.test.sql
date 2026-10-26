-- Güvenlik olay kaydı (T18). Çalıştırma: supabase test db
begin;
create extension if not exists pgtap with schema extensions;
select plan(9);

insert into auth.users (id, email) values
  ('66666666-6666-6666-6666-666666666666', 'f@test.local'),
  ('77777777-7777-7777-7777-777777777777', 'g@test.local');

set local role authenticated;
-- Yetişkin, profili var.
set local request.jwt.claim.sub = '66666666-6666-6666-6666-666666666666';
insert into public.profile (id, birth_year, birth_month, grade, field, exam_date, weekday_minutes, consent_status, updated_at)
values ('a6666666-0000-0000-0000-000000000001', 2000, 1, 'mezun', 'SAY', '2027-06-19',
        array[60,60,60,60,60,60,60], 'not_required', now());

select lives_ok(
  $$select public.record_safety_event('akut', 'kendine_zarar', array['list', 'classifier'], 'fixed', 'taslak-2026-10-26')$$,
  'onaylı kullanıcı olay kaydeder'
);
select throws_ok($$select count(*) from public.safety_event$$, '42501', null, 'öğrenci olayları okuyamaz');
select throws_ok(
  $$insert into public.safety_event (user_id, level, category, sources, action, text_version)
    values ('66666666-6666-6666-6666-666666666666', 'akut', 'diger', array['list'], 'fixed', 'x')$$,
  '42501', null, 'öğrenci tabloya doğrudan yazamaz'
);
select throws_ok(
  $$select public.record_safety_event('yok', 'diger', array['list'], 'fixed', 'x')$$,
  '23514', null, 'risk yoksa kayıt yok'
);
select throws_ok(
  $$select public.record_safety_event('yuksek', 'diger', array['forum'], 'support', 'x')$$,
  '23514', null, 'bilinmeyen kaynak reddedilir'
);
select is(public.consume_ai_quota('safety', 1), true, 'sınıflandırma kotası ayrı tür');

-- Profili sunucuda olmayan kullanıcı (18 yaş altı onaysız öğrencinin profili sunucuya yazılamaz; consent.test.sql).
set local request.jwt.claim.sub = '77777777-7777-7777-7777-777777777777';
select throws_ok(
  $$select public.record_safety_event('akut', 'kendine_zarar', array['list'], 'fixed', 'x')$$,
  '42501', null, 'onaysız kullanıcı olay kaydedemez'
);

reset role;
select results_eq(
  $$select user_id, level, sources from public.safety_event
     where user_id in ('66666666-6666-6666-6666-666666666666', '77777777-7777-7777-7777-777777777777')$$,
  $$values ('66666666-6666-6666-6666-666666666666'::uuid, 'akut'::text, array['list', 'classifier']::text[])$$,
  'kimlik oturumdan alınır, tek kayıt var'
);
delete from auth.users where id = '66666666-6666-6666-6666-666666666666';
select is_empty(
  $$select 1 from public.safety_event where user_id = '66666666-6666-6666-6666-666666666666'$$,
  'hesap silinince olaylar da silinir'
);

select * from finish();
rollback;
