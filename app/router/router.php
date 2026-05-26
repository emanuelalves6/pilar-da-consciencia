<?php
/**
 * Rodar a partir da raiz do projeto:
 *   php -S localhost:8000 app/router/router.php
 */
 
// Raiz do projeto (sobe duas pastas: router → app → raiz)
$root = dirname(__DIR__, 2);
 
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$ext = strtolower(pathinfo($uri, PATHINFO_EXTENSION));
 
$staticExts = ['css','js','png','jpg','jpeg','gif','ico','svg','woff','woff2','ttf','eot','webp','map'];
 
// Se for asset estático, busca em app/view/
if (in_array($ext, $staticExts, true)) {
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
 
    // Tenta direto: /style.css → app/view/style.css
    $direct = $root . '/app/view/' . ltrim($uri, '/');
    if (file_exists($direct) && is_file($direct)) {
        header('Content-Type: ' . ($mimes[$ext] ?? 'application/octet-stream'));
        header('Cache-Control: no-cache, must-revalidate');
        readfile($direct);
        return true;
    }
 
    // Busca recursiva pelo nome do arquivo em qualquer subpasta de app/view/
    $viewRoot = $root . '/app/view/';
    $filename = basename($uri);
    foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($viewRoot, FilesystemIterator::SKIP_DOTS)) as $f) {
        if ($f->isFile() && $f->getFilename() === $filename) {
            header('Content-Type: ' . ($mimes[$ext] ?? 'application/octet-stream'));
            header('Cache-Control: no-cache, must-revalidate');
            readfile($f->getPathname());
            return true;
        }
    }
 
    http_response_code(404);
    echo "404: Asset não encontrado — " . htmlspecialchars($uri);
    return true;
}
 
// Se for arquivo físico existente na raiz, deixa o servidor servir
$filePath = $root . $uri;
if ($uri !== '/' && file_exists($filePath) && !is_dir($filePath)) {
    return false;
}
 
// Tudo o mais passa pelo front controller
require $root . '/index.php';
