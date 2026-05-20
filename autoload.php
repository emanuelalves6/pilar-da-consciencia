<?php
/**
 * Autoload PSR-4
 * Namespace raiz: App\  →  app/
 *
 * Mapeamento de subpastas (namespace → pasta em disco):
 *   App\Config        → app/Config/
 *   App\Controllers   → app/Controllers/
 *   App\Exceptions    → app/Exceptions/
 *   App\Middleware    → app/Middleware/
 *   App\Models        → app/Models/
 *   App\Repositories  → app/Repositories/
 *   App\Services      → app/Services/
 */

spl_autoload_register(function (string $class): void {

    $prefix   = 'App\\';
    $base_dir = __DIR__ . '/app/';

    // Ignora classes que não usam o prefixo do projeto
    if (strncmp($prefix, $class, strlen($prefix)) !== 0) {
        return;
    }

    // "App\Controllers\RelatoController" → "Controllers/RelatoController"
    $relative = substr($class, strlen($prefix));

    // Primeira tentativa: pasta com a capitalização exata do namespace
    $file = $base_dir . str_replace('\\', '/', $relative) . '.php';
    if (file_exists($file)) {
        require_once $file;
        return;
    }

    // Segunda tentativa: converte a primeira parte para minúsculo
    // (suporte a projetos que usam pastas em lowercase)
    $parts    = explode('\\', $relative);
    $parts[0] = strtolower($parts[0]);
    $alt_file = $base_dir . implode('/', $parts) . '.php';
    if (file_exists($alt_file)) {
        require_once $alt_file;
        return;
    }
});
