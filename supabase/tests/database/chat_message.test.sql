-- Koç sohbeti mesajları (T17). Çalıştırma: supabase test db
begin;
create extension if not exists pgtap with schema extensions;
select plan(10);

insert into auth.users (id, email) values
  ('aaaaaaaa-1111-1111-1111-111111111111', 'sohbet-a@test.local'),
  ('aaaaaaaa-2222-2222-2222-222222222222', 'sohbet-b@test.local');
-- Mesajları chat fonksiyonu (service role) yazar; testte doğrudan.
insert into public.chat_message (id, user_id, role, content, risk_level, action, created_at) values
  ('cccccccc-0000-0000-0000-000000000001', 'aaaaaaaa-1111-1111-1111-111111111111', 'user', 'merhaba', 'yok', null, now()),
  ('cccccccc-0000-0000-0000-000000000002', 'aaaaaaaa-1111-1111-1111-111111111111', 'assistant', 'selam', null, 'reply', now()),
  ('cccccccc-0000-0000-0000-000000000003', 'aaaaaaaa-1111-1111-1111-111111111111', 'user', 'eski', 'yok', null, now() - interval '91 days'),
  ('cccccccc-0000-0000-0000-000000000004', 'aaaaaaaa-2222-2222-2222-222222222222', 'assistant', 'b için', null, 'reply', now());

select throws_ok(
  $$insert into public.chat_message (id, user_id, role, content, action) values
    (gen_random_uuid(), 'aaaaaaaa-1111-1111-1111-111111111111', 'user', 'x', 'reply')$$,
  '23514', null, 'öğrenci mesajında aksiyon olmaz, koç yanıtında olur'
);

set local role authenticated;
set local request.jwt.claim.sub = 'aaaaaaaa-1111-1111-1111-111111111111';
select is((select count(*)::int from public.chat_message), 3, 'öğrenci yalnız kendi mesajlarını görür');
select throws_ok(
  $$insert into public.chat_message (id, user_id, role, content, risk_level) values
    (gen_random_uuid(), 'aaaaaaaa-1111-1111-1111-111111111111', 'user', 'x', 'yok')$$,
  '42501', null, 'öğrenci mesaj yazamaz (yalnız chat fonksiyonu)'
);
select is(public.report_chat_message('cccccccc-0000-0000-0000-000000000002'), true, 'koç yanıtını bildirir');
select is(public.report_chat_message('cccccccc-0000-0000-0000-000000000001'), false, 'kendi mesajını bildiremez');
select is(public.report_chat_message('cccccccc-0000-0000-0000-000000000004'), false, 'başkasının mesajını bildiremez');
select throws_ok($$select public.purge_chat_messages(auth.uid())$$, '42501', null, 'öğrenci temizliği çağıramaz');

reset role;
select isnt(
  (select reported_at from public.chat_message where id = 'cccccccc-0000-0000-0000-000000000002'),
  null, 'bildirim zamanı yazıldı'
);
select is(public.purge_chat_messages('aaaaaaaa-1111-1111-1111-111111111111'), 1, '90 günden eski mesaj silinir');
delete from auth.users where id = 'aaaaaaaa-1111-1111-1111-111111111111';
select is_empty(
  $$select 1 from public.chat_message where user_id = 'aaaaaaaa-1111-1111-1111-111111111111'$$,
  'hesap silinince mesajlar gider'
);

select * from finish();
rollback;
