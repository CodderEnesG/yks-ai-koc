// Yerel Supabase'in sahte posta kutusunu (Mailpit) boşaltır.
http.request('http://127.0.0.1:54324/api/v1/messages', { method: 'DELETE' });
output.email = output.email || 'e2e-' + Date.now() + '@test.local';
