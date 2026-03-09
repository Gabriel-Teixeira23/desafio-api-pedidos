# Desafio API de Pedidos

Esta é uma API RESTful desenvolvida em Node.js para o gerenciamento de pedidos. O projeto atende a todos os requisitos obrigatórios e opcionais do desafio técnico, realizando as operações completas de CRUD e aplicando a transformação (mapeamento) de dados de um formato JSON aninhado para uma estrutura otimizada no banco de dados.

## Tecnologias Utilizadas

* Node.js
* Express
* MongoDB (Mongoose)
* Dotenv

## Funcionalidades Implementadas

* **POST /order**: Cria um novo pedido aplicando o mapeamento de dados exigido.
* **GET /order/:id**: Retorna os dados de um pedido específico com base no número do pedido passado na URL.
* **GET /order/list/all**: Lista todos os pedidos cadastrados no banco de dados.
* **PUT /order/:id**: Atualiza os dados de um pedido existente.
* **DELETE /order/:id**: Exclui um pedido do banco de dados.

## Como executar o projeto localmente

1. Clone este repositório:
```bash
git clone [https://github.com/Gabriel-Teixeira23/desafio-api-pedidos.git](https://github.com/Gabriel-Teixeira23/desafio-api-pedidos.git)