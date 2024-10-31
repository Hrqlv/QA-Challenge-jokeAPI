const { test, expect } = require('@playwright/test');
const JokeApiPage = require('../services/servicesAPI'); 
const { isUnique } = require('../../../suporte/helpers');


test.describe('[Objetivo do Teste] Garantir que a API de piadas retorne dados corretos, no formato esperado e que funcione de maneira eficiente', () => {
  
  test('[Cenario 1] Verificar o formato e conteúdo da resposta', async () => {
    const response = await JokeApiPage.buscarPiadaComRepeticao()
    expect(response.status()).toBe(200);
    const data = await response.json();

    expect(data).toHaveProperty("type");
    expect(data).toHaveProperty("setup");
    expect(data).toHaveProperty("punchline");
    expect(data).toHaveProperty("id");
    expect(typeof data.id).toBe('number');
    expect(typeof data.setup).toBe('string');
    expect(typeof data.punchline).toBe('string');

    console.log(data);
  });

  test('[Cenario 2] Verificar unicidade dos IDs em 100 requisições', async () => {
    const ids = [];
  
    for (let i = 0; i < 100; i++) {
      const response = await JokeApiPage.buscarPiadaComRepeticao()
      const data = await response.json();
      ids.push(data.id);
  
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  
    expect(isUnique(ids)).toBe(true);
  });
  
  test('[Cenario 3] Teste de carga com 10 requisições simultâneas', async () => {
    const numDeRequisicoes = 10;

    const inicio = performance.now();

    const responses = await Promise.all(Array.from({ length: numDeRequisicoes }, async () => {
      const response = await JokeApiPage.solicitacaoPiadas(); 
      return response;
    }));

    const fim = performance.now();
    const duracao = fim - inicio;

    for (const response of responses) {
      expect(response.status()).toBe(200);
    }

    console.log(`Tempo total para ${numDeRequisicoes} requisições: ${duracao.toFixed(2)} ms`);
  });
});
