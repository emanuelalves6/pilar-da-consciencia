<?php
namespace App\Services;

use App\Repositories\IRelatoRepository;
use App\Models\Relato;
use App\Exceptions\BusinessRuleException;

/**
 * RelatoService
 *
 * Contém TODA a lógica de negócio da entidade Relato.
 * Depende da interface IRelatoRepository — nunca da implementação concreta.
 * Isso permite trocar o repositório (ex: MySQL) sem tocar no Service.
 */
class RelatoService {

    // ← Injeção de dependência via construtor (depende da INTERFACE, não da classe)
    public function __construct(private IRelatoRepository $repo) {}

    /**
     * Valida e persiste um novo relato.
     *
     * @throws BusinessRuleException se os dados violarem alguma regra de negócio
     */
    public function registrar(array $dados): int {
        $humor = trim($dados['humor'] ?? '');
        $texto = trim($dados['relato'] ?? '');

        // ── Validações (regras de negócio) ────────────────────────────────────
        if ($humor === '' || $texto === '') {
            throw new BusinessRuleException("Humor e relato são obrigatórios.");
        }

        $humoresValidos = ['feliz', 'triste', 'ansioso', 'animado', 'neutro', 'estressado'];
        if (!in_array(mb_strtolower($humor), $humoresValidos, true)) {
            // Aceitamos qualquer valor não vazio — validação só avisa se quiser restringir
            // Descomente a linha abaixo para forçar apenas valores pré-definidos:
            // throw new BusinessRuleException("Humor inválido. Use: " . implode(', ', $humoresValidos));
        }

        if (mb_strlen($texto) < 5) {
            throw new BusinessRuleException("O relato deve ter pelo menos 5 caracteres.");
        }

        if (mb_strlen($texto) > 1000) {
            throw new BusinessRuleException("O relato excede o limite de 1000 caracteres.");
        }

        // ── Monta a entidade e persiste ───────────────────────────────────────
        $r         = new Relato();
        $r->humor  = $humor;
        $r->relato = $texto;
        $r->data   = date('Y-m-d H:i:s');

        return $this->repo->save($r);
    }

    /** Retorna todos os relatos em ordem decrescente de criação. */
    public function listar(): array {
        return $this->repo->find();
    }

    /** Remove um relato pelo ID. Retorna true se removeu, false se não encontrou. */
    public function remover(int $id): bool {
        return $this->repo->delete($id);
    }
}

