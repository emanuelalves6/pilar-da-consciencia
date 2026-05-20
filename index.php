<?php
declare(strict_types=1);

// Carrega configurações e o autoloader correto
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/autoload.php';

use App\Config\Database;
use App\Repositories\RelatoRepository;
use App\Services\RelatoService;
use App\Controllers\RelatoController;

function respondJson(mixed $data, int $status = 200): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $pdo        = Database::getInstance();
    $repository = new RelatoRepository($pdo);
    $service    = new RelatoService($repository);
    $controller = new RelatoController($service);
} catch (\Throwable $e) {
    respondJson(['erro' => 'Erro ao iniciar a aplicação: ' . $e->getMessage()], 500);
}

$uri    = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

// Arquivos estáticos (css, js, imagens, fontes)
$ext = strtolower(pathinfo($uri, PATHINFO_EXTENSION));
if (in_array($ext, ['css','js','png','jpg','jpeg','ico','svg','woff','woff2','ttf'], true)) {
    $staticFile = __DIR__ . $uri;
    if (file_exists($staticFile)) {
        return false;
    }
    http_response_code(404); exit;
}

try {
    switch (true) {

        case $uri === '/' && $method === 'GET':
            header('Content-Type: text/html; charset=utf-8');
            $htmlFile = null;
            foreach (['index.html', 'home.html', 'app.html'] as $name) {
                if (file_exists(__DIR__ . '/' . $name)) {
                    $htmlFile = __DIR__ . '/' . $name;
                    break;
                }
            }
            // Fallback: qualquer .html na raiz
            if (!$htmlFile) {
                $found = glob(__DIR__ . '/*.html');
                if (!empty($found)) $htmlFile = $found[0];
            }
            if ($htmlFile) {
                readfile($htmlFile);
            } else {
                respondJson(['erro' => 'Nenhum arquivo HTML encontrado na raiz.'], 404);
            }
            break;

        case $uri === '/relatos' && $method === 'GET':
            $controller->index(); break;

        case $uri === '/relatos' && $method === 'POST':
            $controller->store(); break;

        case $uri === '/relatos/delete' && $method === 'POST':
            $controller->delete(); break;

        default:
            respondJson(['erro' => "Rota não encontrada: [{$method}] {$uri}"], 404);
    }
} catch (\Throwable $e) {
    respondJson(['erro' => 'Erro inesperado no servidor.'], 500);
}
