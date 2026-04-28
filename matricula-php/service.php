<?php
/**
 * service.php
 * Camada Service - regras de negócio.
 * Não conhece HTTP nem SQL.
 */

class MatriculaService
{
    /**
     * Idade mínima exigida por curso.
     */
    private array $idadeMinimaPorCurso = [
        'Informática'   => 14,
        'Administração' => 16,
        'Direito'       => 17,
        'Medicina'      => 18,
        'Engenharia'    => 17,
    ];

    /**
     * Aplica as regras de negócio da matrícula.
     *
     * @param array $dados ['nome' => ..., 'idade' => ..., 'curso' => ...]
     * @return array Dados processados (com bolsa, status, etc.)
     * @throws Exception se alguma regra falhar.
     */
    public function processar(array $dados): array
    {
        $nome  = trim($dados['nome']);
        $idade = (int) $dados['idade'];
        $curso = trim($dados['curso']);

        // Regra 1: curso precisa estar cadastrado
        if (!isset($this->idadeMinimaPorCurso[$curso])) {
            throw new Exception("Curso '{$curso}' não é oferecido pela instituição.");
        }

        // Regra 2: idade mínima
        $minima = $this->idadeMinimaPorCurso[$curso];
        if ($idade < $minima) {
            throw new Exception(
                "Idade insuficiente para o curso de {$curso}. Mínimo: {$minima} anos."
            );
        }

        // Regra 3: bolsa de estudos para menores de idade
        $bolsa = $idade < 18 ? 'Bolsa Jovem (20%)' : 'Sem bolsa';

        return [
            'nome'  => $nome,
            'idade' => $idade,
            'curso' => $curso,
            'bolsa' => $bolsa,
        ];
    }
}
