-- Veli raporu linki (T22). Çalıştırma: supabase test db
begin;
create extension if not exists pgtap with schema extensions;
select plan(9);

insert into auth.users (id, email) values
  ('99999999-9999-9999-9999-999999999991', 'veli2@test.local'),
  ('99999999-9999-9999-9999-999999999992', 'ogr2@test.local'),
  ('99999999-9999-9999-9999-999999999993', 'yetiskin@test.local');
insert into public.consent_request (token_hash, parent_email, status, report_consent, student_user_id)
values (public.consent_token_hash(repeat('r', 43)), 'veli2@test.local', 'granted', true,
        '99999999-9999-9999-9999-999999999992');

set local role authenticated;
set local request.jwt.claims = '{"sub": "99999999-9999-9999-9999-999999999993"}';
select is(public.my_report_link(), null, 'rapor rızası olmayan (yetişkin) link alamaz');

set local request.jwt.claims = '{"sub": "99999999-9999-9999-9999-999999999992"}';
select matches(public.my_report_link(), '^[0-9a-f]{64}$', 'onaylı öğrenci link alır');
select is(public.my_report_link(), public.my_report_link(), 'geçerli link tekrar istenince aynı');
select throws_ok($$select * from public.report_link$$, '42501', null, 'tablo istemciye kapalı');
select throws_ok($$select public.report_owner('x')$$, '42501', null, 'öğrenci report_owner çağıramaz');

reset role;
select is(
  public.report_owner((select token from public.report_link where user_id = '99999999-9999-9999-9999-999999999992')),
  '99999999-9999-9999-9999-999999999992'::uuid,
  'kod öğrenciyi verir'
);
select is(public.report_owner(repeat('0', 64)), null, 'bilinmeyen kod: boş');

update public.report_link set expires_at = now() - interval '1 minute' where user_id = '99999999-9999-9999-9999-999999999992';
select is(public.report_owner((select token from public.report_link where user_id = '99999999-9999-9999-9999-999999999992')), null, 'süresi dolan link açılmaz');

update public.report_link set expires_at = now() + interval '30 days' where user_id = '99999999-9999-9999-9999-999999999992';
update public.consent_request set report_consent = false where student_user_id = '99999999-9999-9999-9999-999999999992';
select is(public.report_owner((select token from public.report_link where user_id = '99999999-9999-9999-9999-999999999992')), null, 'rapor rızası yoksa açılmaz');

select * from finish();
rollback;
