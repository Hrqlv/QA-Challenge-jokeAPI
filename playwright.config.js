// @ts-check
const { defineConfig, devices } = require('@playwright/test');
import dotenv from 'dotenv';
dotenv.config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({

  testDir: './tests',
  timeout: 1200000, 
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list', { printSteps: true }], ['html']],

  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
  },

});

