const { request, expect } = require('@playwright/test');

class JokeApiPage {
  constructor() {}

 
  async solicitacaoPiadas() {
    const context = await request.newContext()
    const response = await context.get(`${process.env.BASE_URL}random_joke`);
    return response;
  }

  async buscarPiadaComRepeticao() {
    const maximoTentativas = 5; 

    for (let tentativas = 1; tentativas <= maximoTentativas; tentativas++) {
      const response = await this.solicitacaoPiadas();

      if (response.status() === 200) {
        return response; 
      }

      if (response.status() === 429) {
        const tempoEspera = 1000 * tentativas; 
        console.log(`Muitas solicitações, esperando por ${tempoEspera} ms...`);
        await new Promise(resolve => setTimeout(resolve, tempoEspera));
      } else {
        throw new Error(`Request falhou com status ${response.status()}`);
      }
    }

    throw new Error('Máximo de tentativas atingido');
  }
}

module.exports = new JokeApiPage();
