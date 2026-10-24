import { defineConfig } from 'vitest/config';

// Yalnız saf mantık (React Native'e dokunmayan modüller) burada test edilir.
// Bileşen testleri gelince jest-expo eklenecek (TECH-STACK).
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
