const { test, expect } = require('@playwright/test');
const  JokeApiPage  = require('../services/servicesAPI'); 
const { idsUnico, coletarIdsUnicos, medirPerformanceRequisicoes, buscarPiadaComRepeticao } = require('../../../suporte/helpers');


test.describe('[Objetivo do Teste] Garantir que a API de piadas retorne dados corretos, no formato esperado e que funcione de maneira eficiente', () => {
  
  // CENÁRIO DE TESTE 1
  test('[Cenario 1] Verificar o formato e conteúdo da resposta em até 100 requisições @CENARIO1', async () => {
    await test.step('[Casos de teste 1] Fazer requisições e verificar formato e campos', async () => {
      for (let i = 0; i < 100; i++) {
        const response = await buscarPiadaComRepeticao(JokeApiPage);
        
        if (!response) {
          console.log(`Nenhuma piada encontrada na tentativa ${i + 1}`);
          continue; 
        }

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
        console.log(`Piada #${i + 1}:`, data);
      }
    });
  });

  // CENÁRIO DE TESTE 2
test('[Cenario 2] Verificar unicidade dos IDs em até 100 requisições @CENARIO2', async () => {
  await test.step('[Casos de teste 1] Coletar IDs de requisições e verificar unicidade', async () => {
    const ids = await coletarIdsUnicos(JokeApiPage, 100);
    expect(ids.length).toBeGreaterThan(0); 
    expect(idsUnico(ids)).toBe(true);
  });
});

  // CENÁRIO DE TESTE 3
  test('[Cenario 3] Teste de carga com 10 usuários fazendo requisições simultâneas @CENARIO3', async () => {
    await test.step('[Casos de teste 1] Fazer 10 requisições simultâneas para medir performance', async () => {
      await medirPerformanceRequisicoes(JokeApiPage, 10);
    });
  });

  // CENÁRIO DE TESTE 4
  test('[Cenário 4] Teste de Limites, chamadas excessivas @CENARIO4', async () => {
    await test.step('[Casos de teste 1] Verificar a resposta da API de chamadas excessivas', async () => {
      const responses = await Promise.all(
        Array.from({ length: 150 }, () => JokeApiPage.obterPiadas())
      );
    
      const errorResponse = responses.find(r => r.status() !== 200);
      
      if (errorResponse) {
        expect(errorResponse.status()).toBe(429); 
        expect(await errorResponse.json()).toMatchObject({
          type: "error",
          message: expect.stringContaining("Your ip has exceeded the 100 request limit"),
        });
      } else {
        await Promise.all(responses.map(async r => 
          expect(await r.json()).toMatchObject({
            type: expect.any(String),
            setup: expect.any(String),
            punchline: expect.any(String),
            id: expect.any(Number),
          })
        ));
      }
    
      console.log(`Total de requisições feitas: 150`);
    })
  })

});
