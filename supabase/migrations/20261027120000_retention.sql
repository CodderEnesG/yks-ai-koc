-- Saklama süreleri (rapor 2.11) için günlük temizlik. pg_cron her gece 04:00 İstanbul'da (01:00 UTC)
-- run_retention'ı çağırır. Süreler:
--   * Sohbet mesajları: 90 günlük kayan pencere (chat her istekte yazan öğrenci için de temizler).
--   * Güvenlik olayları: incelemeden sonra 1 yıl (avukat teyidiyle). İncelenmemiş olay silinmez.
--   * Rapor linkleri: süresi dolunca.
--   * Onaylanmadan süresi dolan veli onay istekleri: 30 gün sonra (veli e-postası gider). Onaylanmış ya da
--     geri çekilmiş istekler rıza kaydının parçası, kalır.
--   * AI kota sayaçları: 30 gün (yalnız günlük sınır için).
-- Hesap silme ayrı: cascade ile hemen (T28).
create extension if not exists pg_cron with schema pg_catalog;

create function public.run_retention() returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_chat integer;
  v_events integer;
  v_links integer;
  v_requests integer;
  v_usage integer;
begin
  delete from public.chat_message where created_at < now() - interval '90 days';
  get diagnostics v_chat = row_count;

  delete from public.safety_event where reviewed_at < now() - interval '1 year';
  get diagnostics v_events = row_count;

  delete from public.report_link where expires_at < now();
  get diagnostics v_links = row_count;

  delete from public.consent_request
  where status = 'pending' and expires_at < now() - interval '30 days';
  get diagnostics v_requests = row_count;

  delete from public.ai_usage where day < (now() at time zone 'Europe/Istanbul')::date - 30;
  get diagnostics v_usage = row_count;

  return jsonb_build_object(
    'chat_message', v_chat,
    'safety_event', v_events,
    'report_link', v_links,
    'consent_request', v_requests,
    'ai_usage', v_usage
  );
end;
$$;

revoke execute on function public.run_retention() from public, anon, authenticated;

select cron.schedule('retention-daily', '0 1 * * *', 'select public.run_retention()');
