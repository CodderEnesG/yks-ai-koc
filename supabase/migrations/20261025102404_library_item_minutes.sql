-- T10: öğrencinin kaynak başına verdiği süre tahmini (sayfa ya da test başına dakika). Katalog birimlerinde
-- süre yok; plan motoru birim süresini sayfa/test sayısı × bu değerle hesaplar. Oynatma listelerinde boş.
alter table public.library_item
  add column minutes_per_item numeric(5, 2) check (minutes_per_item > 0 and minutes_per_item <= 240);
