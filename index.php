<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/autoload.php';

use App\Config\Database;
use App\Repositories\RelatoRepository;
use App\Services\RelatoService;
use App\Controllers\RelatoController;

// ── Helpers ───────────────────────────────────────────────────────────────────

function respondJson(mixed $data, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// ── Bootstrap (DI manual) ─────────────────────────────────────────────────────

try {
    $pdo        = Database::getInstance();
    $repository = new RelatoRepository($pdo);
    $service    = new RelatoService($repository);
    $controller = new RelatoController($service);
} catch (\Throwable $e) {
    respondJson(['erro' => 'Erro ao iniciar a aplicação: ' . $e->getMessage()], 500);
}

// ── Roteamento ────────────────────────────────────────────────────────────────

$uri    = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

// Arquivos estáticos (css, js, imagens, fontes) — o PHP built-in server precisa
// devolver false para o servidor servir o arquivo diretamente
$ext = strtolower(pathinfo($uri, PATHINFO_EXTENSION));
if (in_array($ext, ['css','js','png','jpg','jpeg','ico','svg','woff','woff2','ttf','map'], true)) {
    $staticFile = __DIR__ . $uri;
    if (file_exists($staticFile)) {
        return false; // deixa o servidor built-in servir
    }
    http_response_code(404);
    exit;
}

try {
    switch (true) {

        // ── GET /  →  serve qualquer .html encontrado na raiz ─────────────────
        case $uri === '/' && $method === 'GET':
            header('Content-Type: text/html; charset=utf-8');

            // 1. Tenta nomes preferidos em ordem
            $preferred = ['index.html', 'home.html', 'app.html', 'main.html'];
            $htmlFile  = null;

            foreach ($preferred as $name) {
                if (file_exists(__DIR__ . '/' . $name)) {
                    $htmlFile = __DIR__ . '/' . $name;
                    break;
                }
            }

            // 2. Fallback: qualquer .html na raiz (independente do nome)
            if (!$htmlFile) {
                $found = glob(__DIR__ . '/*.html');
                if (!empty($found)) {
                    $htmlFile = $found[0]; // pega o primeiro que encontrar
                }
            }

            if ($htmlFile) {
                readfile($htmlFile);
            } else {
                respondJson(['erro' => 'Nenhum arquivo HTML encontrado na raiz do projeto.'], 404);
            }
            break;

        // ── API de Relatos ─────────────────────────────────────────────────────
        case $uri === '/relatos' && $method === 'GET':
            $controller->index();
            break;

        case $uri === '/relatos' && $method === 'POST':
            $controller->store();
            break;

        case $uri === '/relatos/delete' && $method === 'POST':
            $controller->delete();
            break;

        // ── 404 ───────────────────────────────────────────────────────────────
        default:
            respondJson(['erro' => "Rota não encontrada: [{$method}] {$uri}"], 404);
    }
} catch (\Throwable $e) {
    respondJson(['erro' => 'Erro inesperado no servidor.'], 500);
}
