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
 
// Captura a URI e o Método
$uri    = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
 
// Limpeza da URI para suportar subpastas no localhost (ex: /meu-projeto/)
$baseDir = dirname($_SERVER['SCRIPT_NAME']);
$baseDir = str_replace('\\', '/', $baseDir);
if ($baseDir === '/') {
    $baseDir = '';
}
$cleanUri = $uri;
if ($baseDir !== '' && str_starts_with($cleanUri, $baseDir)) {
    $cleanUri = substr($cleanUri, strlen($baseDir));
}
if ($cleanUri === '') {
    $cleanUri = '/';
}
 
// ============================================================
// ASSETS ESTÁTICOS — serve qualquer css/js/imagem que esteja
// em qualquer subpasta dentro de app/view/
// Ex: /css/style.css  → app/view/css/style.css
//     /js/script.js   → app/view/js/script.js
//     /logo.png       → app/view/logo.png
// ============================================================
$ext = strtolower(pathinfo($cleanUri, PATHINFO_EXTENSION));
$staticExts = ['css','js','png','jpg','jpeg','gif','ico','svg','woff','woff2','ttf','eot','map','webp'];
 
if (in_array($ext, $staticExts, true)) {
 
    $viewRoot = __DIR__ . '/app/view/';
 
    // Caminho direto: /css/style.css → app/view/css/style.css
    $uriPath  = ltrim($cleanUri, '/');
 
    // Remove prefixo redundante caso o HTML use "app/view/..." como caminho
    if (str_starts_with($uriPath, 'app/view/')) {
        $uriPath = substr($uriPath, strlen('app/view/'));
    }
 
    $asset = $viewRoot . $uriPath;
 
    // Se achou direto, serve
    if (file_exists($asset) && !is_dir($asset)) {
        serveAsset($asset, $ext);
    }
 
    // Busca recursiva: procura o arquivo pelo nome em qualquer subpasta de app/view/
    // Útil se o arquivo existir mas estiver numa pasta diferente do esperado
    $filename  = basename($uriPath);
    $found     = findFileRecursive($viewRoot, $filename);
    if ($found) {
        serveAsset($found, $ext);
    }
 
    // Arquivo realmente não existe
    http_response_code(404);
    echo "Erro 404: Asset não encontrado — tentou: " . htmlspecialchars($asset);
    exit;
}
 
// ============================================================
// ROTAS DA APLICAÇÃO
// ============================================================
try {
    switch (true) {
 
        // GET / → serve o primeiro .html encontrado em app/view/
        case $cleanUri === '/' && $method === 'GET':
            header('Content-Type: text/html; charset=utf-8');
            $viewFolder = __DIR__ . '/app/view/';
 
            // Tenta nomes comuns primeiro, depois pega qualquer .html
            $htmlFile = null;
            foreach (['index.html','home.html','app.html','main.html'] as $nome) {
                if (file_exists($viewFolder . $nome)) {
                    $htmlFile = $viewFolder . $nome;
                    break;
                }
            }
            if ($htmlFile === null) {
                foreach (glob($viewFolder . '*.html') ?: [] as $f) {
                    $htmlFile = $f;
                    break;
                }
            }
            if ($htmlFile === null) {
                http_response_code(500);
                echo "Nenhum arquivo .html encontrado em " . htmlspecialchars($viewFolder);
                exit;
            }
            readfile($htmlFile);
            exit;
 
        // POST /relatos → cria
        case $cleanUri === '/relatos' && $method === 'POST':
            respondJson($controller->criar($_POST));
 
        // GET /relatos → lista
        case $cleanUri === '/relatos' && $method === 'GET':
            respondJson($controller->listar());
 
        default:
            respondJson(['erro' => 'Rota não encontrada: ' . $method . ' ' . $cleanUri], 404);
    }
} catch (\Throwable $e) {
    respondJson(['erro' => $e->getMessage()], 500);
}
 
// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================
 
/**
 * Serve um arquivo estático com o Content-Type correto.
 */
function serveAsset(string $path, string $ext): never {
    $mimes = [
        'css'   => 'text/css',
        'js'    => 'application/javascript',
        'png'   => 'image/png',
        'jpg'   => 'image/jpeg',
        'jpeg'  => 'image/jpeg',
        'gif'   => 'image/gif',
        'ico'   => 'image/x-icon',
        'svg'   => 'image/svg+xml',
        'woff'  => 'font/woff',
        'woff2' => 'font/woff2',
        'ttf'   => 'font/ttf',
        'eot'   => 'application/vnd.ms-fontobject',
        'webp'  => 'image/webp',
        'map'   => 'application/json',
    ];
    header('Content-Type: ' . ($mimes[$ext] ?? 'application/octet-stream'));
    header('Cache-Control: no-cache, must-revalidate');
    readfile($path);
    exit;
}
 
/**
 * Busca recursivamente um arquivo pelo nome dentro de uma pasta.
 * Retorna o caminho completo se encontrar, ou null.
 */
function findFileRecursive(string $dir, string $filename): ?string {
    foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS)) as $file) {
        if ($file->isFile() && $file->getFilename() === $filename) {
            return $file->getPathname();
        }
    }
    return null;
}
