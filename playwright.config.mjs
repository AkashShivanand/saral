import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/browser',
  use: { baseURL: 'http://127.0.0.1:4322' },
  webServer: { command: 'node tools/serve.mjs', env: { PORT: '4322' }, url: 'http://127.0.0.1:4322/README.md' },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
