const { request, expect } = require('@playwright/test');

class JokeApiPage {

  constructor() {

  }

  // API para obter as piadas
  async obterPiadas() {
    const context = await request.newContext()
    const response = await context.get(`${process.env.BASE_URL}random_joke`);
    return response;
  }
}

module.exports = new JokeApiPage();