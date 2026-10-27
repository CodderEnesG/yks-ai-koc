import { CHAT_MAX_LENGTH } from '@yks/ai/limits';
import { describe, expect, it } from 'vitest';

import { chatError, checkChatText } from './rules';

describe('checkChatText', () => {
  it('kırpar, boşu ve uzunu reddeder', () => {
    expect(checkChatText('  merhaba  ')).toEqual({ text: 'merhaba' });
    expect(checkChatText('   ')).toEqual({ issue: 'empty' });
    expect(checkChatText('a'.repeat(CHAT_MAX_LENGTH))).toEqual({
      text: 'a'.repeat(CHAT_MAX_LENGTH),
    });
    expect(checkChatText('a'.repeat(CHAT_MAX_LENGTH + 1))).toEqual({ issue: 'too_long' });
  });
});

describe('chatError', () => {
  it('durum kodunu hataya çevirir', () => {
    expect(chatError(429)).toBe('quota');
    expect(chatError(403)).toBe('consent');
    expect(chatError(401)).toBe('auth');
    expect(chatError(500)).toBe('network');
    expect(chatError(undefined)).toBe('network');
  });
});
