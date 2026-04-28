# Matrícula de Alunos — PHP MVC + SQLite

Projeto didático demonstrando arquitetura em camadas: **Migration, Model, Service, Controller, View, Router, Middleware** e **Front Controller**.

## Estrutura

```
matricula-php/
├── migration.php     # Cria database.sqlite e a tabela `alunos`
├── model.php         # AlunoModel (PDO + Prepared Statements)
├── service.php       # MatriculaService (regras de negócio)
├── controller.php    # MatriculaController (orquestrador)
├── view.php          # Formulário HTML
├── middleware.php    # Validação de entrada
├── router.php        # Roteador GET/POST
└── index.php         # Front Controller
```

## Como executar

```bash
# 1. Criar o banco SQLite (executar UMA vez)
php migration.php

# 2. Subir o servidor embutido do PHP
php -S localhost:8000

# 3. Abrir no navegador
http://localhost:8000
```

## Testes sugeridos

| Cenário | O que acontece |
|---|---|
| Enviar formulário vazio | Middleware bloqueia com aviso |
| Idade não numérica (ex: `abc`) | Middleware bloqueia |
| Curso "Medicina" com 15 anos | Service lança Exception (idade mínima 18) |
| Dados válidos | Controller salva via Model e exibe sucesso |

## Regras de negócio (Service)

- **Informática**: mín. 14 anos
- **Administração**: mín. 16 anos
- **Direito / Engenharia**: mín. 17 anos
- **Medicina**: mín. 18 anos
- Menores de 18 anos recebem **Bolsa Jovem (20%)** automaticamente.

## Verificando o banco

Use a extensão **SQLite Viewer** (VSCode) para abrir `database.sqlite` e conferir os registros inseridos na tabela `alunos`.
