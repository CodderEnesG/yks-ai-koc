-- AI kota testleri (T11). Çalıştırma: supabase test db
begin;
create extension if not exists pgtap with schema extensions;
select plan(6);

insert into auth.users (id, email) values ('33333333-3333-3333-3333-333333333333', 'c@test.local');
set local role authenticated;
set local request.jwt.claim.sub = '33333333-3333-3333-3333-333333333333';

select is(public.consume_ai_quota('toc', 2), true, '1. çağrı kotada');
select is(public.consume_ai_quota('toc', 2), true, '2. çağrı kotada');
select is(public.consume_ai_quota('toc', 2), false, '3. çağrı kota dolu');
select is(public.consume_ai_quota('chat', 2), true, 'farklı tür ayrı sayılır');
select throws_ok($$select count(*) from public.ai_usage$$, '42501', null, 'öğrenci sayacı doğrudan okuyamaz');

reset request.jwt.claim.sub;
set local role anon;
select throws_ok($$select public.consume_ai_quota('toc', 2)$$, '42501', null, 'girişsiz çağrılamaz');

select * from finish();
rollback;
