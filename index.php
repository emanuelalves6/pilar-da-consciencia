<?php
declare(strict_types=1);

// Autoloader PSR-4 simples
spl_autoload_register(function ($class) {
    $prefix = 'App\\';
    if (strncmp($class, $prefix, 4) !== 0) return;
    $file = __DIR__ . '/app/' . str_replace('\\', '/', substr($class, 4)) . '.php';
    if (file_exists($file)) require $file;
});

use App\Config\Database;
use App\Repositories\RelatoRepository;
use App\Services\RelatoService;
use App\Controllers\RelatoController;

// Container DI: monta dependências
try {
    $pdo        = Database::getInstance();
    $repository = new RelatoRepository($pdo);
    $service    = new RelatoService($repository);
    $controller = new RelatoController($service);
} catch (\Throwable $e) {
    http_response_code(500);
    echo "Erro ao iniciar a aplicação. Verifique config.ini.";
    exit;
}

// Router básico
$uri    = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    switch (true) {
        case $uri === '/' && $method === 'GET':
            $controller->index(); break;
        case $uri === '/relatos' && $method === 'POST':
            $controller->store(); break;
        case $uri === '/relatos/delete' && $method === 'POST':
            $controller->delete(); break;
        default:
            http_response_code(404);
            echo "404 — Rota não encontrada.";
    }
} catch (\Throwable $e) {
    http_response_code(500);
    echo "Erro inesperado. Tente novamente mais tarde.";
}
