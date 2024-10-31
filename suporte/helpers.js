const { expect } = require('@playwright/test');

// Verifica unicidade de IDs

const idsUnico = (ids) => new Set(ids).size === ids.length;

// Coleta IDs únicos com limite de requisições simultâneas
async function coletarIdsUnicos(apiInstance, numRequisicoes = 100, maxSimultaneas = 5) {
    const ids = [];
    const promises = [];
    
    for (let i = 0; i < numRequisicoes; i++) {
      if (promises.length >= maxSimultaneas) {
        await Promise.race(promises); // Espera qualquer uma das promessas serem resolvidas
      }
      
      const promise = (async () => {
        try {
          const { id } = await buscarPiadaComRepeticao(apiInstance);
          ids.push(id);
        } catch (error) {
          console.error(`Erro ao coletar ID: ${error.message}`);
        }
      })();
      
      promises.push(promise);
      
      promise.finally(() => {
        promises.splice(promises.indexOf(promise), 1);
      });
    }
    
    await Promise.all(promises); // Espera todas as promessas serem resolvidas
    return ids;
  }
  

// Mede performance de requisições

async function medirPerformanceRequisicoes(apiInstance, numDeRequisicoes = 10) {
  const inicio = performance.now();
  const responses = await Promise.all(Array.from({ length: numDeRequisicoes }, () => apiInstance.obterPiadas()));
  responses.forEach(response => expect(response.status()).toBe(200));
  console.log(`Tempo total para ${numDeRequisicoes} requisições: ${(performance.now() - inicio).toFixed(2)} ms`);
}

// Busca piadas com repetição

async function buscarPiadaComRepeticao(apiInstance, maximoTentativas = 10) {
    for (let tentativas = 1; tentativas <= maximoTentativas; tentativas++) {
      const response = await apiInstance.obterPiadas();
      
      if (response.status() === 200) {
        return response;
      }
      
      if (response.status() === 429) {
        const tempoEspera = Math.min(1000 * (2 ** (tentativas - 1)), 30000);
        console.log(`Muitas solicitações, esperando por ${tempoEspera} ms...`);
        await new Promise(resolve => setTimeout(resolve, tempoEspera));
      } else {
        throw new Error(`Request falhou com status ${response.status()}`);
      }
    }
    throw new Error('Máximo de tentativas atingido');
  }
  

module.exports = {
  idsUnico,
  coletarIdsUnicos,
  medirPerformanceRequisicoes,
  buscarPiadaComRepeticao,
};
