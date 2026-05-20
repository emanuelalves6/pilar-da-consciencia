<?php
define('ROOT_PATH', __DIR__ . '/');
define('APP_PATH',  ROOT_PATH . 'app/');
define('VIEW_PATH', ROOT_PATH . 'app/view/');  // <- agora aponta para app/view/
define('DB_PATH',   ROOT_PATH . 'database/');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
date_default_timezone_set('America/Sao_Paulo');

$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'
    || ($_SERVER['SERVER_PORT'] ?? 80) == 443) ? 'https://' : 'http://';
$host    = $_SERVER['HTTP_HOST'] ?? 'localhost';
$baseDir = str_replace(basename($_SERVER['SCRIPT_NAME'] ?? '/'), '', $_SERVER['SCRIPT_NAME'] ?? '/');
define('BASE_URL', $protocol . $host . $baseDir);

function render_view(string $viewName, array $data = []): void
{
    extract($data, EXTR_SKIP);
    $file = VIEW_PATH . $viewName;
    if (file_exists($file)) {
        require_once $file;
    } else {
        http_response_code(500);
        die("Erro: view '{$viewName}' não encontrada em " . VIEW_PATH);
    }
}
