<?php
declare(strict_types=1);

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

// Bootstrap
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

// Servir assets estáticos da pasta app/view (css, js, imagens)
$ext = strtolower(pathinfo($uri, PATHINFO_EXTENSION));
if (in_array($ext, ['css','js','png','jpg','jpeg','gif','ico','svg','woff','woff2','ttf','map'], true)) {
    $asset = __DIR__ . '/app/view' . $uri;
    if (file_exists($asset)) {
        $mimes = [
            'css'=>'text/css','js'=>'application/javascript','png'=>'image/png',
            'jpg'=>'image/jpeg','jpeg'=>'image/jpeg','gif'=>'image/gif',
            'ico'=>'image/x-icon','svg'=>'image/svg+xml','woff'=>'font/woff',
            'woff2'=>'font/woff2','ttf'=>'font/ttf','map'=>'application/json',
        ];
        header('Content-Type: ' . ($mimes[$ext] ?? 'application/octet-stream'));
        readfile($asset);
        exit;
    }
    http_response_code(404);
    exit;
}

try {
    switch (true) {

        // GET / → renderiza a home via PHP (não depende do nome do arquivo HTML)
        case $uri === '/' && $method === 'GET':
            header('Content-Type: text/html; charset=utf-8');

            $candidatos = ['index.html', 'home.html', 'app.html', 'main.html'];
            $htmlFile   = null;
            foreach ($candidatos as $nome) {
                if (file_exists(VIEW_PATH . $nome)) {
                    $htmlFile = VIEW_PATH . $nome;
                    break;
                }
            }
            // Fallback: pega o primeiro .html dentro de app/view/
            if ($htmlFile === null) {
                foreach (glob(VIEW_PATH . '*.html') ?: [] as $f) {
                    $htmlFile = $f;
                    break;
                }
            }
            if ($htmlFile === null) {
                http_response_code(500);
                echo "Nenhum arquivo .html encontrado em " . VIEW_PATH;
                exit;
            }
            readfile($htmlFile);
            exit;

        // POST /relatos → cria
        case $uri === '/relatos' && $method === 'POST':
            respondJson($controller->criar($_POST));

        // GET /relatos → lista
        case $uri === '/relatos' && $method === 'GET':
            respondJson($controller->listar());

        default:
            respondJson(['erro' => 'Rota não encontrada: ' . $method . ' ' . $uri], 404);
    }
} catch (\Throwable $e) {
    respondJson(['erro' => $e->getMessage()], 500);
}
