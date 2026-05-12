<?php
/**
 * router.php — Entry point para o servidor embutido do PHP.
 *
 * Uso:
 *   php -S localhost:8000 router.php
 *
 * O servidor embutido chama este arquivo para TODA requisição.
 * Retornar `false` faz o PHP servir o arquivo estático normalmente.
 */

$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$ext = strtolower(pathinfo($uri, PATHINFO_EXTENSION));

// Arquivos estáticos: deixa o servidor embutido lidar diretamente
$staticExtensions = ['css', 'js', 'png', 'jpg', 'jpeg', 'gif', 'ico', 'svg',
                     'woff', 'woff2', 'ttf', 'eot', 'map', 'webp'];

if (in_array($ext, $staticExtensions, true) && file_exists(__DIR__ . $uri)) {
    return false; // Serve o arquivo estático sem passar pelo index.php
}

// Tudo o mais passa pelo roteador da aplicação
require __DIR__ . '/index.php';

