-- Saklama süreleri (rapor 2.11). Çalıştırma: supabase test db
begin;
create extension if not exists pgtap with schema extensions;
select plan(13);

insert into auth.users (id, email) values
  ('dddddddd-1111-1111-1111-111111111111', 'saklama@test.local');

insert into public.chat_message (id, user_id, role, content, risk_level, created_at) values
  ('dddddddd-0000-0000-0000-000000000001', 'dddddddd-1111-1111-1111-111111111111', 'user', 'eski', 'yok', now() - interval '91 days'),
  ('dddddddd-0000-0000-0000-000000000002', 'dddddddd-1111-1111-1111-111111111111', 'user', 'yeni', 'yok', now() - interval '89 days');

insert into public.safety_event (user_id, level, category, sources, action, text_version, reviewed_at) values
  ('dddddddd-1111-1111-1111-111111111111', 'yuksek', 'diger', '{list}', 'support', 't', now() - interval '13 months'),
  ('dddddddd-1111-1111-1111-111111111111', 'yuksek', 'diger', '{list}', 'support', 't', now() - interval '11 months'),
  ('dddddddd-1111-1111-1111-111111111111', 'akut', 'diger', '{list}', 'fixed', 't', null);
-- İncelenmemiş eski olay: oluşturulma zamanı eski olsa da kalır.
update public.safety_event set created_at = now() - interval '2 years' where reviewed_at is null;

insert into public.report_link (user_id, token, expires_at) values
  ('dddddddd-1111-1111-1111-111111111111', repeat('e', 64), now() - interval '1 minute');

insert into public.consent_request (token_hash, parent_email, status, expires_at) values
  (public.consent_token_hash(repeat('p', 43)), 'eski@test.local', 'pending', now() - interval '31 days'),
  (public.consent_token_hash(repeat('q', 43)), 'yeni@test.local', 'pending', now() - interval '29 days'),
  (public.consent_token_hash(repeat('g', 43)), 'onay@test.local', 'granted', now() - interval '60 days');

insert into public.ai_usage (user_id, day, kind, count) values
  ('dddddddd-1111-1111-1111-111111111111', current_date - 40, 'chat', 3),
  ('dddddddd-1111-1111-1111-111111111111', current_date, 'chat', 1);

select isnt_empty(
  $$select 1 from cron.job where jobname = 'retention-daily' and schedule = '0 1 * * *'$$,
  'günlük temizlik işi kurulu (04:00 İstanbul)'
);

set local role authenticated;
select throws_ok($$select public.run_retention()$$, '42501', null, 'öğrenci temizliği çağıramaz');
reset role;

select is(
  public.run_retention(),
  '{"chat_message": 1, "safety_event": 1, "report_link": 1, "consent_request": 1, "ai_usage": 1}'::jsonb,
  'her tablodan yalnız süresi geçen satır silinir'
);

select is_empty($$select 1 from public.chat_message where content = 'eski'$$, '90 günden eski mesaj gitti');
select isnt_empty($$select 1 from public.chat_message where content = 'yeni'$$, '89 günlük mesaj kaldı');
select is(
  (select count(*)::int from public.safety_event where user_id = 'dddddddd-1111-1111-1111-111111111111'),
  2, 'incelemeden 1 yıl geçen olay gitti, diğerleri kaldı'
);
select isnt_empty(
  $$select 1 from public.safety_event where reviewed_at is null and user_id = 'dddddddd-1111-1111-1111-111111111111'$$,
  'incelenmemiş olay silinmez'
);
select is_empty($$select 1 from public.report_link where token = repeat('e', 64)$$, 'süresi dolan rapor linki gitti');
select is_empty($$select 1 from public.consent_request where parent_email = 'eski@test.local'$$,
  'süresi 30 günden fazla geçmiş onaysız istek gitti');
select isnt_empty($$select 1 from public.consent_request where parent_email = 'yeni@test.local'$$,
  'yakın zamanda süresi dolan istek kaldı');
select isnt_empty($$select 1 from public.consent_request where parent_email = 'onay@test.local'$$,
  'onaylanmış istek (rıza kaydı) kalır');
select is(
  (select count(*)::int from public.ai_usage where user_id = 'dddddddd-1111-1111-1111-111111111111'),
  1, '30 günden eski kota sayacı gitti'
);
select is(
  public.run_retention(),
  '{"chat_message": 0, "safety_event": 0, "report_link": 0, "consent_request": 0, "ai_usage": 0}'::jsonb,
  'ikinci koşu bir şey silmez'
);

select * from finish();
rollback;
