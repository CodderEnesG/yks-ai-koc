-- Geri bildirim toplama testleri. Çalıştırma: supabase test db
begin;
create extension if not exists pgtap with schema extensions;
select plan(9);

insert into auth.users (id, email) values
  ('99999999-9999-9999-9999-999999999991', 'f1@test.local'),
  ('99999999-9999-9999-9999-999999999992', 'f2@test.local');

-- 1. Girişsiz çağrı yazamaz, okuyamaz.
set local role anon;
select throws_ok(
  $$insert into public.feedback_response (scope, kind, question, value)
    values ('kutuphane', 'rating', 'Deneme?', '5')$$,
  '42501', null, 'anon yazamaz'
);
select throws_ok($$select * from public.feedback_response$$, '42501', null, 'anon okuyamaz');

-- 2. Onaysız kullanıcı (profili yok) yazamaz.
reset role;
set local role authenticated;
set local request.jwt.claim.sub = '99999999-9999-9999-9999-999999999991';
select throws_ok(
  $$insert into public.feedback_response (scope, kind, question, value)
    values ('kutuphane', 'rating', 'Deneme?', '5')$$,
  '42501', null, 'profilsiz (onaysız) kullanıcı yazamaz'
);

-- 3. Onaylı (yetişkin) kullanıcı yazabilir; farklı soru tipleri.
insert into public.profile (id, birth_year, birth_month, grade, field, exam_date, weekday_minutes, consent_status, updated_at)
values ('c0000000-0000-0000-0000-000000000001', 2000, 1, 'mezun', 'SAY', '2027-06-19',
        '{60,60,60,60,60,60,60}', 'not_required', now());

select lives_ok(
  $$insert into public.feedback_response (scope, kind, question, value)
    values ('icindekiler-ekle', 'rating', 'Bölümleri okuma ne kadar doğruydu?', '4')$$,
  'onaylı kullanıcı yıldız yanıtı yazabilir'
);
select lives_ok(
  $$insert into public.feedback_response (scope, kind, question, value)
    values ('genel', 'text', 'En çok neyi değiştirmek isterdin?', 'Bildirim saatini kolay değiştirmek güzel olurdu')$$,
  'açık metin yanıtı yazabilir'
);
select lives_ok(
  $$insert into public.feedback_response (scope, kind, question, value, app_version)
    values ('kutuphane', 'poll', 'Hangi yol işine yaradı?', 'Barkod okutma', '0.1.0')$$,
  'anket yanıtı yazabilir'
);

-- 4. Yıldız yanıtı yalnız 1-5 arası rakam olabilir.
select throws_ok(
  $$insert into public.feedback_response (scope, kind, question, value)
    values ('kutuphane', 'rating', 'Deneme?', '6')$$,
  '23514', null, 'yıldız 1-5 dışında olamaz'
);

-- 5. Başka kullanıcı adına yazılamaz; yazılan satır geri okunamaz, güncellenemez, silinemez.
select throws_ok(
  $$insert into public.feedback_response (user_id, scope, kind, question, value)
    values ('99999999-9999-9999-9999-999999999992', 'kutuphane', 'rating', 'Deneme?', '5')$$,
  '42501', null, 'başkası adına yazılamaz'
);
select throws_ok($$select * from public.feedback_response$$, '42501', null, 'kendi yanıtını bile geri okuyamaz');

select * from finish();
rollback;
