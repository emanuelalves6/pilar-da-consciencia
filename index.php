<?php
// index.php

require_once 'Database.php';
require_once 'RelatoRepository.php';
require_once 'RelatoService.php';
require_once 'RelatoController.php';
require_once 'middleware.php';

// 1. Container de Injeção de Dependência (Montagem)
$pdo = Database::getInstance();
$relatoRepository = new RelatoRepository($pdo);
$relatoService = new RelatoService($relatoRepository);
$relatoController = new RelatoController($relatoService);

// 2. Roteamento Simples (Router)
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

if ($uri === '/relato/store' && $method === 'POST') {
    // Passa pelo Middleware de Sanitização
    $safeData = Middleware::sanitizePost();
    
    // Envia ao Controller
    $relatoController->store($safeData);
} else {
    // Caso seja apenas a raiz, mostra o form
    echo '<form action="/relato/store" method="POST">
            <textarea name="texto" placeholder="Como você se sente?"></textarea><br>
            <input type="text" name="humor" placeholder="Humor (ex: Feliz)"><br>
            <button type="submit">Salvar</button>
          </form>';
}
