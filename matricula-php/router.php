<?php
/**
 * router.php
 * Avalia método + URL e direciona para a ação correta.
 */

require_once __DIR__ . '/controller.php';
require_once __DIR__ . '/middleware.php';

class Router
{
    public function handle(string $method, string $uri): void
    {
        // Normaliza URI (remove querystring)
        $path = parse_url($uri, PHP_URL_PATH) ?: '/';

        $controller = new MatriculaController();

        if ($method === 'GET' && $path === '/') {
            $controller->exibirFormulario();
            return;
        }

        if ($method === 'POST' && $path === '/') {
            // Middleware valida ANTES de chegar no controller
            $dadosValidados = Middleware::validarMatricula($_POST);
            $controller->processarMatricula($dadosValidados);
            return;
        }

        // 404
        http_response_code(404);
        echo "<h1>404 - Página não encontrada</h1>";
    }
}
