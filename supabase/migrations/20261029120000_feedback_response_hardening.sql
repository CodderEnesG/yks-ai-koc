-- feedback_response sağlamlaştırma (2026-10-29, kalite kontrol incelemesi):
-- * Hesap silinince cascade tabloyu taramasın: user_id indeksi (diğer kullanıcı tablolarında var).
-- * İstemci yalnız içerik sütunlarını yazar; id, user_id ve created_at varsayılandan gelir (geriye tarihli
--   ya da başkası adına satır yazılamaz). Tablo düzeyindeki insert yetkisi sütun yetkisine indirildi.
-- * app_version uzunluğu sınırlı.
create index feedback_response_user_idx on public.feedback_response (user_id);

revoke insert on public.feedback_response from authenticated;
grant insert (scope, kind, question, value, app_version) on public.feedback_response to authenticated;

alter table public.feedback_response
  add constraint feedback_response_app_version_len
  check (app_version is null or char_length(app_version) between 1 and 40);
