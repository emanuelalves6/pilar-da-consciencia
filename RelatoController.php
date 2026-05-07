<?php
namespace App\Controllers;
use App\Services\RelatoService;
use App\Exceptions\BusinessRuleException;
use App\Middleware\SanitizeMiddleware;

class RelatoController {
    public function __construct(private RelatoService $service) {}

    public function index(): void {
        $relatos = $this->service->listar();
        $erro = $_GET['erro'] ?? null;
        $ok = isset($_GET['ok']);
        require __DIR__ . '/../../views/index.php';
    }

    public function store(): void {
        $dados = SanitizeMiddleware::handlePost($_POST);
        try {
            $this->service->registrar($dados);
            header("Location: /?ok=1"); exit;
        } catch (BusinessRuleException $e) {
            header("Location: /?erro=" . urlencode($e->getMessage())); exit;
        } catch (\Throwable $e) {
            header("Location: /?erro=" . urlencode("Ocorreu um erro inesperado.")); exit;
        }
    }

    public function delete(): void {
        $id = (int)($_POST['id'] ?? 0);
        if ($id > 0) $this->service->remover($id);
        header("Location: /"); exit;
    }
}
