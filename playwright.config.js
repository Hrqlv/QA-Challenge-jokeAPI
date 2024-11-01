// @ts-check
const { defineConfig, devices } = require('@playwright/test');
import dotenv from 'dotenv';
dotenv.config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({

  // caminho para onde estao os tests
  testDir: './tests',
  // define o tempo limite global para os testes em milissegundos.
  timeout: 1200000, 
  // roda todos os tests em paralelo
  fullyParallel: true,
  // impede que os testes sejam executados apenas em um teste específico
  forbidOnly: !!process.env.CI,
  // define o número de tentativas para cada teste em caso de falha
  retries: process.env.CI ? 2 : 0,
  // define o número de worker para execução paralela dos testes
  workers: process.env.CI ? 1 : undefined,
  // configura diferentes formatos de relatórios para os resultados dos testes
  reporter: [['list', { printSteps: true }], ['html']],

  // vao ser o que vai usar durante os tests, como url do prj, screenshot, video, trace, etc
  use: {
    baseURL: process.env.BASE_URL,
  },

});

