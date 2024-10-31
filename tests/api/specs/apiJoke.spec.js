const { test, expect } = require('@playwright/test');
const JokeApiPage = require('../services/servicesAPI'); 
const { idsUnico, coletarIdsUnicos, medirPerformanceRequisicoes, buscarPiadaComRepeticao } = require('../../../suporte/helpers');


test.describe('[Objetivo do Teste] Garantir que a API de piadas retorne dados corretos, no formato esperado e que funcione de maneira eficiente', () => {

// CENÁRIO DE TESTE 1

  test('[Cenario 1] Verificar o formato e conteúdo da resposta em 100 requisições @CENARIO1', async () => {
    await test.step('[Casos de teste 1] Fazer 100 requisições e verificar formato e campos', async () => {
        const response = await buscarPiadaComRepeticao(JokeApiPage, 100);
        expect(response.status()).toBe(200);
        
        const data = await response.json();
        expect(data).toHaveProperty("type");
        expect(data).toHaveProperty("setup");
        expect(data).toHaveProperty("punchline");
        expect(data).toHaveProperty("id");

        expect(typeof data.id).toBe('number');
        expect(typeof data.setup).toBe('string');
        expect(typeof data.punchline).toBe('string');

        expect(data.type).not.toBe('');
        expect(data.setup).not.toBe('');
        expect(data.punchline).not.toBe('');
        console.log(data);
    });
  });

// CENÁRIO DE TESTE 2

  test('[Cenario 2] Verificar unicidade dos IDs em 100 requisições @CENARIO2', async () => {
    await test.step('[Casos de teste 1]  Coletar IDs de 100 requisições e verificar unicidade', async () => {
      const ids = await coletarIdsUnicos(JokeApiPage, 100);
      expect(idsUnico(ids)).toBe(true);
    });
  });

// CENÁRIO DE TESTE 3

  test('[Cenario 3] Teste de carga com 10 usuários fazendo requisições simultâneas @CENARIO3', async () => {
    await test.step('[Casos de teste 1] Fazer 10 requisições simultâneas para medir performance', async () => {
      await medirPerformanceRequisicoes(JokeApiPage, 10);
    });
  });
});
