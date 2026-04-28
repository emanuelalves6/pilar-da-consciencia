<?php
/**
 * index.php
 * Front Controller - ponto único de entrada da aplicação.
 *
 * Para iniciar:
 *   1) php migration.php       (cria o banco)
 *   2) php -S localhost:8000   (inicia o servidor)
 *   3) Abra http://localhost:8000 no navegador.
 */

require_once __DIR__ . '/router.php';

$router = new Router();
$router->handle($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);
