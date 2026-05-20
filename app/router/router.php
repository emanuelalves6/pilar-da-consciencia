<?php
/**
 * Rodar a partir da raiz do projeto:
 *   php -S localhost:8000 app/router/router.php
 */

// Raiz do projeto (sobe duas pastas: router → app → raiz)
$root = dirname(__DIR__, 2);

$uri      = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$filePath = $root . $uri;

// Se for arquivo físico existente na RAIZ, deixa o servidor servir
if ($uri !== '/' && file_exists($filePath) && !is_dir($filePath)) {
    return false;
}

// Tudo o mais passa pelo front controller
require $root . '/index.php';
