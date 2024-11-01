const { expect } = require('@playwright/test');


// Verifica unicidade de IDs

function idsUnico(ids) {
  const uniqueIds = new Set(ids);
  return uniqueIds.size === ids.length;
}

// Coleta IDs únicos com limite de requisições simultâneas

async function coletarIdsUnicos(apiInstance, numRequisicoes = 100) {
  const ids = new Set();
  
  const tentativas = Array.from({ length: numRequisicoes }, (_, i) => i + 1);
  
  const resultados = await Promise.allSettled(
      tentativas.map(async (i) => {
          try {
              const response = await buscarPiadaComRepeticao(apiInstance);
              const data = await response.json();
              
              // Verifica se o ID já foi coletado

              if (!ids.has(data.id)) {
                  ids.add(data.id);
                  console.log(`ID coletado #${i}: ${data.id}`);
              } else {
                  console.log(`ID já coletado: ${data.id}`);
              }

              await new Promise(resolve => setTimeout(resolve, 9000));
          } catch (error) {
              console.error(`Erro ao coletar ID na tentativa ${i}: ${error.message}`);
          }
      })
  );

  resultados.forEach((resultado, index) => {
      if (resultado.status === 'rejected') {
          console.error(`Tentativa ${index + 1} falhou: ${resultado.reason.message}`);
      }
  });

  console.log('IDs coletados:', Array.from(ids));
  return Array.from(ids);
}

// Mede performance de requisições

async function medirPerformanceRequisicoes(apiInstance, numDeRequisicoes = 10) {
  const inicio = performance.now();
  const responses = await Promise.all(Array.from({ length: numDeRequisicoes }, () => apiInstance.obterPiadas()));
  responses.forEach(response => expect(response.status()).toBe(200));
  console.log(`Tempo total para ${numDeRequisicoes} requisições: ${(performance.now() - inicio).toFixed(2)} ms`);
}

// Busca piadas com repetição

async function buscarPiadaComRepeticao(apiInstance, maximoTentativas = 20) {
  for (let tentativas = 1; tentativas <= maximoTentativas; tentativas++) {
    const response = await apiInstance.obterPiadas();
    
    if (response.status() === 200) {
      return response;
    }
    
    if (response.status() === 429) {
      const tempoEspera = Math.min(1000 * (2 ** (tentativas - 1)), 10000); 
      console.log(`Muitas solicitações, esperando por ${tempoEspera} ms...`);
      await new Promise(resolve => setTimeout(resolve, tempoEspera));
    } else {
      console.error(`Erro inesperado na requisição com status ${response.status()}`);
      throw new Error(`Request falhou com status ${response.status()}`);
    }
    
    if (tentativas === maximoTentativas) {
      console.warn(`Máximo de tentativas atingido sem sucesso, retornando null`);
      return null;  
    }
  }
  throw new Error('Máximo de tentativas atingido');
}

module.exports = { idsUnico, coletarIdsUnicos, medirPerformanceRequisicoes, buscarPiadaComRepeticao, };
