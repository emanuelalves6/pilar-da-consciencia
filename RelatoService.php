<?php
namespace App\Services;
use App\Repositories\IRelatoRepository;
use App\Models\Relato;
use App\Exceptions\BusinessRuleException;

class RelatoService {
    public function __construct(private IRelatoRepository $repo) {}

    public function registrar(array $dados): int {
        $humor = trim($dados['humor'] ?? '');
        $texto = trim($dados['relato'] ?? '');

        if ($humor === '' || $texto === '') {
            throw new BusinessRuleException("Humor e relato são obrigatórios.");
        }
        if (mb_strlen($texto) < 5) {
            throw new BusinessRuleException("O relato deve ter pelo menos 5 caracteres.");
        }
        if (mb_strlen($texto) > 1000) {
            throw new BusinessRuleException("O relato excede 1000 caracteres.");
        }

        $r = new Relato();
        $r->humor = $humor;
        $r->relato = $texto;
        $r->data = date('Y-m-d H:i:s');
        return $this->repo->save($r);
    }

    public function listar(): array { return $this->repo->find(); }
    public function remover(int $id): bool { return $this->repo->delete($id); }
}
