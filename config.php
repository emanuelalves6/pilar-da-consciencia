<?php
/**
 * Configuração Geral do Sistema
 * Define constantes de caminhos, configurações de erro e ambiente.
 */

// 1. Definição de caminhos absolutos para evitar erros de inclusão
define('ROOT_PATH', __DIR__ . '/');
define('APP_PATH', ROOT_PATH . 'app/');
define('VIEW_PATH', ROOT_PATH . 'view/');
define('DB_PATH', ROOT_PATH . 'database/'); // Local sugerido no Passo 2

// 2. Configurações de exibição de erros (Ambiente de Desenvolvimento)
// Em produção, mude para 0
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// 3. Configurações de fuso horário
date_default_timezone_set('America/Sao_Paulo');

// 4. URL Base para carregamento de assets (CSS, JS, Imagens) na View
// Ajuste conforme o seu servidor local (ex: http://localhost/meu-projeto/)
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
$domainName = $_SERVER['HTTP_HOST'];
$baseDir = str_replace(basename($_SERVER['SCRIPT_NAME']), '', $_SERVER['SCRIPT_NAME']);
define('BASE_URL', $protocol . $domainName . $baseDir);

/**
 * Função utilitária para facilitar o carregamento de views
 */
function render_view(string $viewName, array $data = []) {
    extract($data);
    $file = VIEW_PATH . $viewName;
    if (file_exists($file)) {
        require_once $file;
    } else {
        die("Erro: View '{$viewName}' não encontrada em " . VIEW_PATH);
    }
}
?>
