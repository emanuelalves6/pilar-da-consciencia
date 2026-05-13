<?php
/**
 * router.php - Responsável por decidir qual Controller ou View exibir
 */

use App\Config\Database;
use App\Repositories\RelatoRepository;
use App\Models\Relato;
use App\Middleware\Middleware;

// Captura a URL (exemplo básico de roteamento)
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

try {
    // 1. Instanciar conexão e repositório
    $db = Database::getInstance();
    $repository = new RelatoRepository($db);

    // 2. Lógica de Roteamento Simples
    if ($method === 'POST') {
        // Processa o formulário (Cadastro)
        $dadosLimpos = Middleware::sanitizePost();

        if (!empty($dadosLimpos['humor']) && !empty($dadosLimpos['relato'])) {
            $novoRelato = new Relato();
            $novoRelato->humor = $dadosLimpos['humor'];
            $novoRelato->relato = $dadosLimpos['relato'];
            $novoRelato->data = date('Y-m-d H:i:s');

            $repository->save($novoRelato);
            
            // Redireciona para evitar reenvio de formulário (F5)
            header("Location: " . BASE_URL . "index.php?sucesso=1");
            exit;
        }
    } else {
        // Exibe a interface (Passo 3: arquivos dentro de view/)
        // Usando a função render_view definida no seu config.php
        render_view('inscricao.html');
    }

} catch (Exception $e) {
    die("Erro no Roteador: " . $e->getMessage());
}
