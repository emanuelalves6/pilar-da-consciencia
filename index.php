<?php
declare(strict_types=1);

// ─── Autoloader ──────────────────────────────────────────────────────────────
// Todos os arquivos PHP estão na raiz do projeto (estrutura flat).
// Resolve o nome da classe para o arquivo correspondente.
spl_autoload_register(function (string $class): void {
    $parts     = explode('\\', $class);
    $className = end($parts);
    $file      = __DIR__ . '/' . $className . '.php';
    if (file_exists($file)) {
        require_once $file;
    }
});

// ─── Bootstrap ───────────────────────────────────────────────────────────────
use App\Config\Database;
use App\Repositories\RelatoRepository;
use App\Services\RelatoService;
use App\Controllers\RelatoController;

/**
 * Responde JSON e encerra a execução.
 */
function respondJson(mixed $data, int $status = 200): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Inicializa a cadeia de dependências via injeção de dependência manual.
try {
    $pdo        = Database::getInstance();
    $repository = new RelatoRepository($pdo);
    $service    = new RelatoService($repository);
    $controller = new RelatoController($service);
} catch (\Throwable $e) {
    respondJson(['erro' => 'Erro ao iniciar a aplicação: ' . $e->getMessage()], 500);
}

// ─── Roteamento ──────────────────────────────────────────────────────────────
$uri    = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

// Serve arquivos estáticos diretamente (CSS, JS, fontes, imagens…)
// O servidor embutido do PHP faz isso automaticamente com o router.php,
// mas esta guarda extra cobre casos em que a rota cai aqui mesmo.
$ext = strtolower(pathinfo($uri, PATHINFO_EXTENSION));
if (in_array($ext, ['css', 'js', 'png', 'jpg', 'jpeg', 'ico', 'svg', 'woff', 'woff2', 'ttf'], true)) {
    $staticFile = __DIR__ . $uri;
    if (file_exists($staticFile)) {
        return false; // Deixa o servidor embutido servir o arquivo
    }
    http_response_code(404);
    exit;
}

// ─── Rotas da aplicação ───────────────────────────────────────────────────────
try {
    switch (true) {

        // ── Página principal ─────────────────────────────────────────────────
        case $uri === '/' && $method === 'GET':
            header('Content-Type: text/html; charset=utf-8');

            // Procura o front-end com nomes alternativos — resistente a renomeações
            $htmlCandidates = [
                __DIR__ . '/index.html',
                __DIR__ . '/Index.html',
                __DIR__ . '/home.html',
                __DIR__ . '/app.html',
            ];

            $htmlFile = null;
            foreach ($htmlCandidates as $candidate) {
                if (file_exists($candidate)) {
                    $htmlFile = $candidate;
                    break;
                }
            }

            // Fallback: busca qualquer .html na raiz do projeto
            if ($htmlFile === null) {
                $found = glob(__DIR__ . '/*.html');
                if (!empty($found)) {
                    $htmlFile = $found[0]; // Usa o primeiro encontrado
                }
            }

            if ($htmlFile !== null) {
                readfile($htmlFile);
            } else {
                // Último recurso: página de status inline para não dar tela em branco
                echo <<<HTML
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <title>App — sem front-end</title>
                    <style>
                        body { font-family: sans-serif; max-width: 600px; margin: 4rem auto; color: #333; }
                        code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; }
                        .ok  { color: green; } .warn { color: darkorange; }
                    </style>
                </head>
                <body>
                    <h2>⚙️ API Relatos — Servidor rodando</h2>
                    <p class="warn">⚠️ Nenhum arquivo <code>.html</code> encontrado na raiz do projeto.</p>
                    <p>O back-end está funcional. Endpoints disponíveis:</p>
                    <ul>
                        <li><code>GET  /relatos</code> — lista todos os relatos</li>
                        <li><code>POST /relatos</code> — cria um relato (campos: humor, relato)</li>
                        <li><code>POST /relatos/delete</code> — remove um relato (campo: id)</li>
                    </ul>
                    <p class="ok">✔ Banco de dados conectado e tabela criada.</p>
                </body>
                </html>
                HTML;
            }
            break;

        // ── API: listar relatos ───────────────────────────────────────────────
        case $uri === '/relatos' && $method === 'GET':
            $controller->index();
            break;

        // ── API: criar relato ─────────────────────────────────────────────────
        case $uri === '/relatos' && $method === 'POST':
            $controller->store();
            break;

        // ── API: deletar relato ───────────────────────────────────────────────
        case $uri === '/relatos/delete' && $method === 'POST':
            $controller->delete();
            break;

        // ── Rota não encontrada ───────────────────────────────────────────────
        default:
            respondJson(['erro' => "Rota não encontrada: [{$method}] {$uri}"], 404);
    }
} catch (\Throwable $e) {
    respondJson(['erro' => 'Erro inesperado no servidor.'], 500);
}

