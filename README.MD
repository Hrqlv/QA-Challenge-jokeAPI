# QA-Challenge: Testando a API de Piadas

## Sobre o Projeto
Garantir que a API de piadas retorne dados corretos, no formato esperado e que funcione de maneira eficiente.

### Endpoint: 
https://official-joke-api.appspot.com/random_joke


## O que foi feito
## Principais Aspectos a Serem Verificados:

#### Formato da Resposta: 
A resposta deve estar no formato JSON e conter os campos esperados.

#### Tipos de Dados: 
Validar os tipos de dados dos campos retornados.

#### Unicidade dos IDs: 
Verificar se os IDs das piadas são únicos a cada chamada.

#### Performance: 
Verificar o tempo de resposta da API.

#### Limites: 
Testar limites de chamadas à API.

## Cenários de testes realizados
### Cenário 1:
Verificar o formato e conteúdo da resposta em até 100 requisições

### Cenário 2:
Verificar unicidade dos IDs em até 100 requisições

### Cenário 3:
Teste de carga com 10 usuários fazendo requisições simultâneas

### Cenário 4:
Teste de Limites, chamadas excessivas

## Instalar as dependencias
npm install / npm i

## Como rodar os tests
### Todos os cenarios:
npm run cenarios

### Cenario 1:
npm run cenario1

### Cenario 2:
npm run cenario2

### Cenario 3:
npm run cenario3

### Cenario 4:
npm run cenario4

## Documento do Plano de Testes (CT’s), relatório dos resultados esperado, bugs encontrados e possíveis melhorias e riscos
https://henriquelopesvelozo.atlassian.net/wiki/x/AYACAg


Espero que voces gostem do projeto que fiz, foi de acordo com os meus conhecimentos e habilidades. Fique a vontade!