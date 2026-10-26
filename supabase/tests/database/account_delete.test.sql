-- Hesap silme (T28). Çalıştırma: supabase test db
-- account-delete fonksiyonu yalnız auth kullanıcısını siler; kişisel veri cascade ile gider. Yeni bir
-- kullanıcı tablosu cascade'siz eklenirse ilk test kırılır (rıza kayıtları T21'de bilinçli istisna olacak).
begin;
create extension if not exists pgtap with schema extensions;
select plan(6);

select is_empty(
  $$select c.conrelid::regclass::text
      from pg_constraint c
     where c.contype = 'f'
       and c.confrelid = 'auth.users'::regclass
       and c.connamespace = 'public'::regnamespace
       and c.confdeltype <> 'c'$$,
  'public şemasında auth.users''a bağlı her yabancı anahtar on delete cascade'
);

insert into auth.users (id, email) values
  ('44444444-4444-4444-4444-444444444444', 'd@test.local'),
  ('55555555-5555-5555-5555-555555555555', 'e@test.local');

set local role authenticated;
set local request.jwt.claim.sub = '44444444-4444-4444-4444-444444444444';
insert into public.profile (id, birth_year, birth_month, grade, field, exam_date, weekday_minutes, consent_status, updated_at)
values ('a4444444-0000-0000-0000-000000000001', 2000, 1, 'mezun', 'SAY', '2027-06-19',
        array[60,60,60,60,60,60,60], 'not_required', now());
insert into public.library_item (id, source_kind, custom_edition, sort_order, minutes_per_item, updated_at)
values ('a4444444-0000-0000-0000-000000000002', 'book',
        '{"title":"x","units":[]}'::jsonb, 0, 3, now());
select public.consume_ai_quota('toc', 20);

set local request.jwt.claim.sub = '55555555-5555-5555-5555-555555555555';
insert into public.library_item (id, source_kind, custom_edition, sort_order, minutes_per_item, updated_at)
values ('a5555555-0000-0000-0000-000000000002', 'book',
        '{"title":"y","units":[]}'::jsonb, 0, 3, now());

reset role;
delete from auth.users where id = '44444444-4444-4444-4444-444444444444';

select is_empty($$select 1 from public.profile where user_id = '44444444-4444-4444-4444-444444444444'$$, 'profil silindi');
select is_empty($$select 1 from public.library_item where user_id = '44444444-4444-4444-4444-444444444444'$$, 'kütüphane silindi');
select is_empty($$select 1 from public.ai_usage where user_id = '44444444-4444-4444-4444-444444444444'$$, 'AI kotası silindi');
select isnt_empty($$select 1 from public.library_item where user_id = '55555555-5555-5555-5555-555555555555'$$, 'başka kullanıcının verisi duruyor');
select isnt_empty($$select 1 from public.edition limit 1$$, 'katalog duruyor');

select * from finish();
rollback;
