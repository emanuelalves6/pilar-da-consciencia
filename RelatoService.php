<?php
// RelatoService.php
require_once 'BusinessRuleException.php';

class RelatoService {
    private IRelatoRepository $repository;

    // A Interface é injetada via construtor (Regra de Ouro)
    public function __construct(IRelatoRepository $repository) {
        $this->repository = $repository;
    }

    public function processarNovoRelato(string $texto, string $humor): bool {
        // Regras complexas e validações
        if (empty(trim($texto))) {
            throw new BusinessRuleException("O relato não pode estar vazio. Expresse seus sentimentos.");
        }
        
        if (strlen($texto) < 10) {
            throw new BusinessRuleException("Seu relato é muito curto. Tente escrever um pouco mais.");
        }

        $relato = new Relato($texto, $humor);
        return $this->repository->save($relato);
    }
}
