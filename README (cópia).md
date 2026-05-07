# Gênese do Equilíbrio — Refactor v2

Refatoração do projeto aplicando **Repository Pattern**, **Singleton (PDO)**,
**Injeção de Dependência**, **Service Layer** e **Sanitização (Middleware)**.

## Como rodar (localhost — zero configuração)

Usa **SQLite**, então não precisa instalar MySQL.

```bash
php -S localhost:8000
```

Acesse: http://localhost:8000

> Requer apenas PHP 8.0+ com a extensão `pdo_sqlite` (já vem por padrão).

## Estrutura

```
index.php                 # Front Controller + Container DI + Router
config.ini                # Credenciais (no .gitignore)
app/
  Config/Database.php     # Singleton PDO
  Models/Relato.php       # Entidade
  Repositories/
    IRelatoRepository.php # Interface (contrato)
    RelatoRepository.php  # SQL isolado aqui
  Services/RelatoService.php       # Regras de negócio
  Exceptions/BusinessRuleException.php
  Middleware/SanitizeMiddleware.php
  Controllers/RelatoController.php # Enxuto: try/catch
views/index.php
```

## Commit sugerido

```
git add .
git commit -m "refactor: implementa padrao repository, variaveis de ambiente e injeção de dependencia"
git push origin main
```
