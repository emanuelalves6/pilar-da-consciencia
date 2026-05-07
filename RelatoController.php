<?php
namespace App\Controllers;
use App\Services\RelatoService;
use App\Exceptions\BusinessRuleException;
use App\Middleware\SanitizeMiddleware;

class RelatoController {
    public function __construct(private RelatoService $service) {}

    private function json($data, int $status = 200): void {
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode($data);
    }

    public function index(): void {
        $relatos = $this->service->listar();
        $this->json($relatos);
    }

    public function store(): void {
        $dados = SanitizeMiddleware::handlePost($_POST);
        try {
            $id = $this->service->registrar($dados);
            $this->json(['ok' => true, 'id' => $id], 201);
        } catch (BusinessRuleException $e) {
            $this->json(['ok' => false, 'erro' => $e->getMessage()], 422);
        } catch (\Throwable $e) {
            $this->json(['ok' => false, 'erro' => 'Ocorreu um erro inesperado.'], 500);
        }
    }

    public function delete(): void {
        $id = (int)($_POST['id'] ?? 0);
        if ($id > 0) {
            $this->service->remover($id);
            $this->json(['ok' => true]);
        } else {
            $this->json(['ok' => false, 'erro' => 'ID inválido.'], 400);
        }
    }
}
