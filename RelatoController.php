<?php
namespace App\Controllers;

use App\Services\RelatoService;
use App\Exceptions\BusinessRuleException;
use App\Middleware\SanitizeMiddleware;

/**
 * RelatoController
 *
 * Responsabilidade única: receber a requisição HTTP, delegar ao Service
 * e devolver a resposta JSON adequada. Nenhuma regra de negócio aqui.
 */
class RelatoController {

    public function __construct(private RelatoService $service) {}

    // ── Helpers ──────────────────────────────────────────────────────────────

    private function json(mixed $data, int $status = 200): void {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
    }

    /**
     * Lê o corpo da requisição como JSON ou cai de volta para $_POST.
     * Isso torna a API compatível tanto com formulários HTML quanto com
     * fetch/axios enviando application/json.
     */
    private function input(): array {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        if (str_contains($contentType, 'application/json')) {
            $body = file_get_contents('php://input');
            $decoded = json_decode($body, true);
            return is_array($decoded) ? $decoded : [];
        }
        return $_POST;
    }

    // ── Actions ───────────────────────────────────────────────────────────────

    /**
     * GET /relatos
     * Lista todos os relatos em ordem decrescente.
     */
    public function index(): void {
        try {
            $relatos = $this->service->listar();
            $this->json($relatos);
        } catch (\Throwable $e) {
            $this->json(['ok' => false, 'erro' => 'Erro ao buscar relatos.'], 500);
        }
    }

    /**
     * POST /relatos
     * Cria um novo relato após sanitizar e validar os dados.
     */
    public function store(): void {
        $raw   = $this->input();
        $dados = SanitizeMiddleware::handlePost($raw);

        try {
            $id = $this->service->registrar($dados);
            $this->json(['ok' => true, 'id' => $id], 201);
        } catch (BusinessRuleException $e) {
            // Erros de regra de negócio → 422 Unprocessable Entity
            $this->json(['ok' => false, 'erro' => $e->getMessage()], 422);
        } catch (\Throwable $e) {
            $this->json(['ok' => false, 'erro' => 'Ocorreu um erro inesperado.'], 500);
        }
    }

    /**
     * POST /relatos/delete
     * Remove um relato pelo ID.
     */
    public function delete(): void {
        $raw = $this->input();
        $id  = (int)($raw['id'] ?? 0);

        if ($id <= 0) {
            $this->json(['ok' => false, 'erro' => 'ID inválido ou não informado.'], 400);
            return;
        }

        try {
            $removido = $this->service->remover($id);
            if ($removido) {
                $this->json(['ok' => true]);
            } else {
                $this->json(['ok' => false, 'erro' => 'Relato não encontrado.'], 404);
            }
        } catch (\Throwable $e) {
            $this->json(['ok' => false, 'erro' => 'Erro ao remover relato.'], 500);
        }
    }
}

