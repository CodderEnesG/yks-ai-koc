# @yks/plan-engine

Saf ve deterministik plan motoru (rapor 2.6). Mobilde, Next.js'te ve Supabase Edge Functions'ta (Deno) aynı kaynak koddan çalışır.

Kurallar:

- Bağımlılık yok. Saat değil takvim günü (`CivilDate`) ile çalışır; `Date`'in cihaz saat dilimine bağlı davranışı kullanılmaz.
- Göreli import'lar `.ts` uzantısıyla yazılır (`./civil-date.ts`). Deno uzantı ister; Metro ve Next bunu `allowImportingTsExtensions` ile kabul eder.
- Property testleri (Vitest + fast-check) CI'da zorunludur.

```sh
pnpm --filter @yks/plan-engine test
pnpm --filter @yks/plan-engine check:deno
```
