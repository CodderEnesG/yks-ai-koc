-- Konu taksonomisi ve katalog eşlemesi (T12; tools/taxonomy). Çalıştırma: supabase test db
begin;
create extension if not exists pgtap with schema extensions;
select plan(10);

select is(
  (select count(*)::int from public.topic where curriculum = 'MEB-2027'),
  514,
  'MEB-2027: 13 ders + 195 ünite + 306 konu'
);

select is(
  (select count(*)::int from public.topic where parent_id is null),
  13,
  'kökler yalnız dersler'
);

select is(
  (select count(*)::int from public.topic c join public.topic p on p.id = c.parent_id
   where c.subject <> p.subject or c.curriculum <> p.curriculum),
  0,
  'alt düğüm üstüyle aynı ders ve müfredatta'
);

select is(
  (select count(*)::int from public.topic where exam_weight is not null),
  0,
  'sınav ağırlığı resmî kaynakta yok (NOT DEFINED): hepsi null'
);

select is(
  (select count(*)::int from public.unit where topic_id is not null),
  654,
  '654 katalog birimi bir konuya bağlı'
);

select is(
  (select count(*)::int from public.unit where topic_id is null),
  16,
  '16 birim eşlenmedi: 12 YDT İngilizce (ERTELENDİ) + 4 karma tekrar (README)'
);

select is(
  (select count(*)::int from public.unit u join public.topic t on t.id = u.topic_id
   where t.parent_id is null),
  0,
  'birimler ders köküne değil ünite ya da konuya bağlı'
);

-- Örnek: 3adim-ayt-cografya sıra 5 → COG/11.2 (Claude kararı); 3adim-ydt-ingilizce sıra 1 eşlenmez.
select is(
  (select topic_id from public.unit where id = '1075c82d-5074-45c8-8007-9eecfb2af008'),
  '0ee3c396-bb82-4b79-8be5-bba94ec6b1ff'::uuid,
  'örnek birim beklenen konuda'
);
select is(
  (select topic_id from public.unit where id = '63ad9f9a-19c9-43ec-8037-85b10a9f52d0'),
  null,
  'İngilizce birimi eşlenmemiş'
);

set local role anon;
select is(
  (select count(*)::int from public.topic),
  514,
  'taksonomi herkese açık okunur (katalog, kişisel veri yok)'
);
reset role;

select * from finish();
rollback;
