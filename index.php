<?php
declare(strict_types=1);

// Autoloader — todos os arquivos estão na raiz do projeto
spl_autoload_register(function ($class) {
    $parts = explode('\\', $class);
    $className = end($parts);
    $file = __DIR__ . '/' . $className . '.php';
    if (file_exists($file)) require $file;
});

use App\Config\Database;
use App\Repositories\RelatoRepository;
use App\Services\RelatoService;
use App\Controllers\RelatoController;

try {
    $pdo        = Database::getInstance();
    $repository = new RelatoRepository($pdo);
    $service    = new RelatoService($repository);
    $controller = new RelatoController($service);
} catch (\Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['erro' => 'Erro ao iniciar a aplicação.']);
    exit;
}

$uri    = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    switch (true) {
        case $uri === '/relatos' && $method === 'GET':
            $controller->index(); break;
        case $uri === '/relatos' && $method === 'POST':
            $controller->store(); break;
        case $uri === '/relatos/delete' && $method === 'POST':
            $controller->delete(); break;
        default:
            http_response_code(404);
            header('Content-Type: application/json');
            echo json_encode(['erro' => 'Rota não encontrada.']);
    }
} catch (\Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['erro' => 'Erro inesperado.']);
}
