// Mailpit'teki en yeni e-postadan 6 haneli giriş kodunu okur.
const list = json(http.get('http://127.0.0.1:54324/api/v1/messages').body);
if (list.messages.length > 0) {
  const message = json(
    http.get('http://127.0.0.1:54324/api/v1/message/' + list.messages[0].ID).body,
  );
  const match = message.HTML.match(/>\s*(\d{6})\s*</);
  output.otp = match ? match[1] : '';
}
