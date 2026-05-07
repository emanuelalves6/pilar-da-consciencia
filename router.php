<?php
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Se o arquivo estático existe (html, css, js, etc), serve ele diretamente
if ($uri !== '/' && file_exists(__DIR__ . $uri)) {
    return false;
}

// Caso contrário, passa pelo index.php (API)
require __DIR__ . '/index.php';
