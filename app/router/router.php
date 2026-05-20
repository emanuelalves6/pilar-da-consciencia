<?php
/**
 * router.php
 *
 * Usado com o servidor embutido do PHP:
 *   php -S localhost:8000 router.php
 *
 * Permite que arquivos estáticos (css, js, imagens) sejam servidos
 * diretamente, e roteia todo o resto para o index.php.
 */

$uri = $_SERVER['REQUEST_URI'];
$filePath = __DIR__ . parse_url($uri, PHP_URL_PATH);

// Se o arquivo físico existe (css, js, imagem etc.), serve diretamente
if ($filePath !== __DIR__ . '/' && file_exists($filePath) && !is_dir($filePath)) {
    return false;
}

// Tudo o mais passa pelo front controller
require __DIR__ . '/index.php';
